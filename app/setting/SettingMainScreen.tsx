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
import LogoutModal from '@/components/modals/LogoutModal';
import { Alert } from 'react-native';

function SettingMainScreen() {
    const router = useRouter();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const settingsItems = [
        {
            id: 'appearance',
            title: 'App appearance',
            description: 'Dark mode, light mode, system default',
            image: require('../../assets/images/settings-icons/app_appearance_icon.png'),
            disabled: true,
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
                router.push('/setting/NotificationSettingScreen')
            }
        },
        {
            id: 'privacy',
            title: 'Privacy & safety',
            description: 'Control who sees what',
            image: require('../../assets/images/settings-icons/privacy_and_setting_icon.png'),
            onPress: () => {
                router.push('/setting/Privacy&SafetySettingScreen')
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
                                item.disabled && styles.disabledItem
                            ]}
                            onPress={item.onPress}
                            disabled={item.disabled}
                            activeOpacity={item.disabled ? 1 : 0.7}
                        >
                            <View style={styles.itemLeft}>
                                <Image
                                    source={item.image}
                                    style={[styles.itemImage, item.disabled && { opacity: 0.5 }]}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={[
                                        styles.itemTitle,
                                        item.isDestructive && styles.destructiveText,
                                        item.disabled && styles.disabledText
                                    ]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.itemDescription, item.disabled && styles.disabledText]}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                            {!item.disabled && <Ionicons name="chevron-forward" size={16} color="#999" />}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isVisible={isLogoutModalVisible}
                onClose={() => setIsLogoutModalVisible(false)}
            />
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
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        marginLeft: -4,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87
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
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    disabledItem: {
        backgroundColor: '#F9F9F9',
        opacity: 0.8,
    },
    disabledText: {
        color: '#BDBDBD',
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
    modalDescription: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
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
        fontFamily: 'BrittiSemibold',
    },
    confirmLogoutButtonText: {
        color: '#FBFBFB',
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
    },
});

export default SettingMainScreen;
