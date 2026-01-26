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
            description: 'Manage your frequently used routes',
            image: require('../../assets/images/profile-icons/saved_routes_icon.png'),
            onPress: () => { router.push('./SavedRoutesScreen') },
        },
        {
            id: 'achievements',
            title: 'Achievements',
            description: 'Badges and milestones earned',
            image: require('../../assets/images/profile-icons/achievements_icon.png'),
            onPress: () => { router.push('../achievement/AchievementsScreen') },
        },
        {
            id: 'settings',
            title: 'Settings',
            description: 'App preferences and account settings',
            image: require('../../assets/images/profile-icons/settings_icon.png'),
            onPress: () => { router.push('../setting/SettingMainScreen') },
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
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
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
                                // index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#999" />
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
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        paddingTop: 10,
        paddingBottom: 3
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatarImage: {
        width: 52,
        height: 52,
        borderRadius: 39.81,
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 39.81,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 30,
        fontFamily: 'BrittiSemibold',
        fontWeight: 'bold',
        color: '#333',
    },
    pointsLabel: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        textTransform: 'lowercase',
    },
    pointsValue: {
        fontSize: 28,
        fontWeight: 700,
        fontFamily: 'BrittiBold',
        color: '#080808',
        marginVertical: 4,
    },
    username: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 8,
    },
    memberSinceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberIcon: {
        marginRight: 6,
    },
    memberSinceText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
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
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA'
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemImage: {
        marginRight: 16,
        width: 36,
        height: 36,
        borderRadius: 56.25
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
});

export default ProfileLandingScreen;
