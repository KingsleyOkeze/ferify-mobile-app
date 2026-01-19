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
    Image
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
            image: require('../../assets/images/settings-icons/app_appearance_icon.png'),
            onPress: () => {
                // Future implementation
            }
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your notification preferences',
            image: require('../../assets/images/settings-icons/notification_icon.png'),
            onPress: () => {
                router.push('./NotificationSettingScreen')
            }
        },
        {
            id: 'privacy',
            title: 'Privacy & safety',
            description: 'Control who sees what',
            image: require('../../assets/images/settings-icons/privacy_and_setting_icon.png'),
            onPress: () => {
                router.push('./Privacy&SafetySettingScreen')
            }
        },

        {
            id: 'logout',
            title: 'Logout',
            description: 'Sign out of your account',
            image: require('../../assets/images/settings-icons/logout_icon.png'),
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
                                // index === 0 && styles.firstListItem // Border top for first item
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Image
                                    source={item.image}
                                    style={styles.itemImage}
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
                        {/* <Text style={styles.modalTitle}>Confirm Logout</Text> */}
                        <Text style={styles.modalDescription}>
                            Are you sure you want to logout?
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmLogoutButton]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmLogoutButtonText}>Yes I do</Text>
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
        backgroundColor: '#FBFBFB',
        padding: 4,
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
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        // paddingHorizontal: 20, // Optional: keeping it flush or padded
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
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
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        color: '#757575',
    },
    destructiveText: {
        color: 'red',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FBFBFB',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
        width: '80%',
        maxWidth: 256,
    },
    // modalTitle: {
    //     fontSize: 16,
    //     fontWeight: 400,
    //     color: '#080808',
    //     marginBottom: 12,
    // },
    modalDescription: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
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
        backgroundColor: '#F0F0F0',
        width: 98,
        height: 45
    },
    confirmLogoutButton: {
        backgroundColor: '#EF4444',
        width: 98,
        height: 45
    },
    cancelModalButtonText: {
        color: '#080808',
        fontSize: 14,
        fontWeight: 600,
    },
    confirmLogoutButtonText: {
        color: '#FBFBFB',
        fontSize: 14,
        fontWeight: 600,
    },
});

export default SettingMainScreen;
