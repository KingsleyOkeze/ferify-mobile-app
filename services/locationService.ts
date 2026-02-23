import * as Location from 'expo-location';
import api, { getToken } from './api';
import { STORAGE_KEYS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';

const LOCATION_CACHE_KEY = STORAGE_KEYS.CURRENT_LOCATION;

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
 * Gets the current location permission status without prompting the user.
 */
export const getLocationPermissionStatus = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
    try {
        const { status } = await Location.getForegroundPermissionsAsync();
        return status;
    } catch (error) {
        console.error('Error getting location permission status:', error);
        return 'undetermined';
    }
};

/**
 * Fetches the current location and caches it.
 * Uses getLastKnownPositionAsync as a fast fallback.
 */
export const fetchAndCacheLocation = async (maxAge = 10 * 60 * 1000): Promise<LocationData | null> => {
    try {
        const hasPermission = await requestLocationPermissions();
        if (!hasPermission) return null;

        // Check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            console.log('Location services are disabled.');
            return await getCachedLocation(); // Return last cached if available
        }

        let location;
        try {
            // Try to get fast last known position first
            location = await Location.getLastKnownPositionAsync({});

            // If none or too old (based on maxAge), get fresh
            if (!location || (Date.now() - location.timestamp > maxAge)) {
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

        await cacheHelper.set(LOCATION_CACHE_KEY, locationData);

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
        return await cacheHelper.get<LocationData>(LOCATION_CACHE_KEY, Infinity); // TTL handled at call site or not at all here
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
        // Check privacy settings before syncing
        const cachedSettings = await cacheHelper.get<{ shareLocationData: boolean }>(STORAGE_KEYS.PRIVACY_SETTINGS, Infinity);
        if (cachedSettings) {
            if (cachedSettings.shareLocationData === false) {
                console.log('Location sync skipped due to privacy settings (shareLocationData is false)');
                return;
            }
        }

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
