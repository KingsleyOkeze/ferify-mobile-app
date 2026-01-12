import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

// Dummy user data
const USER_DATA = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    points: 1099,
    memberSince: '2014',
    image: null, // Set to a URL string if available
};

function ProfileLandingScreen() {
    const router = useRouter();

    const menuItems = [
        {
            id: 'saved_route',
            title: 'Saved route',
            icon: 'map-outline',
            onPress: () => { router.push('/setting/account/SavedRoutesScreen') },
        },
        {
            id: 'achievements',
            title: 'Achievements',
            icon: 'trophy-outline',
            onPress: () => { },
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
            onPress: () => { router.push('/setting/SettingMainScreen') },
        },
    ];

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Center View */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        {USER_DATA.image ? (
                            <Image source={{ uri: USER_DATA.image }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitials}>
                                    {getInitials(USER_DATA.firstName, USER_DATA.lastName)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.pointsLabel}>points</Text>
                    <Text style={styles.pointsValue}>{USER_DATA.points}</Text>
                    <Text style={styles.username}>@{USER_DATA.username}</Text>

                    <View style={styles.memberSinceContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#666" style={styles.memberIcon} />
                        <Text style={styles.memberSinceText}>member since {USER_DATA.memberSince}</Text>
                    </View>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons name={item.icon as any} size={22} color="#333" style={styles.itemIcon} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    headerSpacer: {
        width: 32, // To balance the back button
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    pointsLabel: {
        fontSize: 14,
        color: '#666',
        textTransform: 'lowercase',
    },
    pointsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 4,
    },
    username: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
    },
    memberSinceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberIcon: {
        marginRight: 6,
    },
    memberSinceText: {
        fontSize: 13,
        color: '#666',
    },
    menuContainer: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIcon: {
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});

export default ProfileLandingScreen;
