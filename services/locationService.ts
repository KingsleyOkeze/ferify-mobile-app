import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { getToken } from './api';

const LOCATION_CACHE_KEY = 'user_current_location';

export interface LocationData {
    latitude: number;
    longitude: number;
    timestamp: number;
    address?: string;
}

/**
 * Requests location permissions and returns the status.
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting location permissions:', error);
        return false;
    }
};

/**
 * Fetches the current location and caches it.
 * Uses getLastKnownPositionAsync as a fast fallback.
 */
export const fetchAndCacheLocation = async (): Promise<LocationData | null> => {
    try {
        const hasPermission = await requestLocationPermissions();
        if (!hasPermission) return null;

        // Check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            console.warn('Location services are disabled.');
            return await getCachedLocation(); // Return last cached if available
        }

        let location;
        try {
            // Try to get fast last known position first
            location = await Location.getLastKnownPositionAsync({});

            // If none or too old (e.g. > 10 mins), get fresh
            if (!location || (Date.now() - location.timestamp > 10 * 60 * 1000)) {
                location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
            }
        } catch (e) {
            console.warn('getCurrentPositionAsync failed, trying last known:', e);
            location = await Location.getLastKnownPositionAsync({});
        }

        if (!location) return await getCachedLocation();

        const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
        };


        // Attempt to get reverse geocode (address)
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const addr = reverseGeocode[0];
                locationData.address = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`;
            }
        } catch (e) {
            console.warn('Failed to reverse geocode location:', e);
        }

        await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(locationData));

        // Sync with backend if authenticated
        const token = await getToken();
        if (token) {
            syncLocationWithBackend(locationData);
        }

        return locationData;
    } catch (error) {
        console.error('Error fetching/caching location:', error);
        return null;
    }
};

/**
 * Retrieves the cached location from AsyncStorage.
 */
export const getCachedLocation = async (): Promise<LocationData | null> => {
    try {
        const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Error getting cached location:', error);
        return null;
    }
};
/**
 * Syncs the location data with the backend API.
 */
export const syncLocationWithBackend = async (locationData: LocationData): Promise<void> => {
    try {
        await api.patch('/api/account/location', {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.address,
        });
        console.log('Location synced with backend successfully');
    } catch (error) {
        console.error('Error syncing location with backend:', error);
    }
};
