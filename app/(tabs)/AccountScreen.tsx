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
import { useAuth } from '@/contexts/AuthContext';

function MainAccountProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const getInitials = (fullName?: string) => {
        if (!fullName) return "??";
        const parts = fullName.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return fullName.substring(0, 2).toUpperCase();
    };

    const menuItems = [
        {
            id: 'community',
            title: 'Community & Contributions',
            icon: 'people-outline',
            onPress: () => { router.push('/contribution/MyContributionOverviewScreen') },
        },
        {
            id: 'account',
            title: 'Accounts & Personal',
            icon: 'person-outline',
            onPress: () => { router.push('../account/AccountAndPersonalMainScreen') },
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
            onPress: () => { router.push('/setting/SettingMainScreen') },
        },
        {
            id: 'help',
            title: 'Help & Feedback',
            icon: 'help-circle-outline',
            onPress: () => { router.push('/help/HelpAndFeedbackScreen') },
        },
        {
            id: 'about',
            title: 'About Ferify',
            icon: 'information-circle-outline',
            onPress: () => { router.push('../about/AboutMainScreen') },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Close Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getInitials(user?.fullName || user?.firstName)}</Text>
                    </View>

                    <Text style={styles.userName}>{user?.fullName || user?.firstName || 'User'}</Text>
                    <Text style={styles.userHandle}>@{user?.username || 'user'}</Text>
                    <Text style={styles.userBadge}>Member</Text>

                    <TouchableOpacity
                        style={styles.viewProfileButton}
                        onPress={() => router.push('/account/ProfileLandingScreen')}
                    >
                        <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={22} color="#333" style={styles.menuIcon} />
                                <Text style={styles.menuTitle}>{item.title}</Text>
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
        backgroundColor: '#FBFBFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 55.13,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    userName: {
        fontSize: 20,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000000',
        marginBottom: 5,
    },
    userHandle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 9,
    },
    userBadge: {
        fontSize: 15,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#646464',
        marginBottom: 16,
    },
    viewProfileButton: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    viewProfileText: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    menuContainer: {
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 12,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#000',
    },
});

export default MainAccountProfileScreen;