import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function SettingMainScreen() {
    const router = useRouter();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const settingsItems = [
        {
            id: 'appearance',
            title: 'App appearance',
            description: 'Dark mode, light mode, system default',
            icon: 'moon-outline',
            onPress: () => {
                // Future implementation
            }
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your notification preferences',
            icon: 'notifications-outline',
            onPress: () => {
                // Future implementation
            }
        },
        {
            id: 'privacy',
            title: 'Privacy & safety',
            description: 'Control who sees what',
            icon: 'lock-closed-outline',
            onPress: () => {
                // Future implementation
            }
        },
        {
            id: 'logout',
            title: 'Logout',
            description: 'Sign out of your account',
            icon: 'log-out-outline',
            isDestructive: true,
            onPress: () => setIsLogoutModalVisible(true)
        },
    ];

    const handleLogout = () => {
        setIsLogoutModalVisible(false);
        // Add actual logout logic here (e.g., clear tokens)
        router.replace('/auth/login/LoginScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Settings List */}
                <View style={styles.listContainer}>
                    {settingsItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.listItem,
                                index === 0 && styles.firstListItem // Border top for first item
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={24}
                                    color={item.isDestructive ? 'red' : '#333'}
                                    style={styles.itemIcon}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={[
                                        styles.itemTitle,
                                        item.isDestructive && styles.destructiveText
                                    ]}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isLogoutModalVisible}
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsLogoutModalVisible(false)}
                >
                    <Pressable style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalDescription}>
                            Are you sure you want to logout? You'll need to sign in again to access your account.
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmLogoutButton]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmLogoutButtonText}>yes i do</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setIsLogoutModalVisible(false)}
                            >
                                <Text style={styles.cancelModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        // paddingHorizontal: 20, // Optional: keeping it flush or padded
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
    destructiveText: {
        color: 'red',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    modalButtonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelModalButton: {
        backgroundColor: '#F2F2F2',
    },
    confirmLogoutButton: {
        backgroundColor: '#FF3B30', // Red background as requested
    },
    cancelModalButtonText: {
        color: '#080808',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmLogoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default SettingMainScreen;
