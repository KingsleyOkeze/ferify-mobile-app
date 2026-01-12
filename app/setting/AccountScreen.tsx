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

function MainAccountProfileScreen() {
    const router = useRouter();

    const menuItems = [
        {
            id: 'community',
            title: 'Community & Contributions',
            icon: 'people-outline',
        },
        {
            id: 'account',
            title: 'Accounts & Personal',
            icon: 'person-outline',
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
        },
        {
            id: 'help',
            title: 'Help & Feedback',
            icon: 'help-circle-outline',
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
                        <Text style={styles.avatarText}>KO</Text>
                    </View>

                    <Text style={styles.userName}>Kelvin O</Text>
                    <Text style={styles.userBadge}>Trusted contributor</Text>

                    <TouchableOpacity style={styles.viewProfileButton}>
                        <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem}>
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
        backgroundColor: '#fff',
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
        width: 80,
        height: 80,
        borderRadius: 24, // Rounded border radius as requested
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    userBadge: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        fontWeight: '500',
    },
    viewProfileButton: {
        backgroundColor: '#F2F2F2',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    viewProfileText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#F5F5F5',
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
        fontWeight: '500',
        color: '#000',
    },
});

export default MainAccountProfileScreen;