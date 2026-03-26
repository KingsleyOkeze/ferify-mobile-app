import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    Platform,
    Linking
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { STORAGE_KEYS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';

const STORAGE_KEY = STORAGE_KEYS.HAS_SEEN_NOTIF_PROMPT;

interface NotificationPermissionModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function NotificationPermissionModal({ visible, onClose }: NotificationPermissionModalProps) {

    const handleEnable = async () => {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            handleClose();
            return;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                // Determine if we should guide to settings (optional, keeping simple for now)
                // alert('Failed to get push token for push notification!');
            }

            // Mark as seen regardless of outcome so we don't nag
            await cacheHelper.setRaw(STORAGE_KEY, 'true');
            onClose();

        } catch (error) {
            console.error('Error requesting permissions:', error);
            onClose();
        }
    };

    const handleClose = async () => {
        await cacheHelper.setRaw(STORAGE_KEY, 'true');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>Enable Push Notification</Text>

                        <View style={styles.descriptionContainer}>
                            <Text style={[styles.descriptionText, { width: '100%' }]}>
                                Notification help you know when fares changes 
                            </Text>
                            <Text style={[styles.descriptionText, { width: '90%', alignSelf: 'center' }]}>
                                and when other commuters update prices
                            </Text>
                            <Text style={[styles.descriptionText, { width: '100%' }]}>
                                around you. Together we keep Ferify accurate
                            </Text>                        
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.notNowButton} onPress={handleClose}>
                                <Text style={styles.notNowText}>Not now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.enableButton} onPress={handleEnable}>
                                <Text style={styles.enableText}>Enable</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#0A0A0A99',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FBFBFB',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 17,
        paddingTop: 16,
        width: '100%',
        minHeight: 304,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    closeButton: {
        padding: 4,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'BrittiBold',
        fontWeight: '700',
        color: '#080808',
        marginBottom: 20,
        alignItems: 'center',
    },
    descriptionContainer: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#666666',
        marginBottom: 38,
        width: '100%',
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#666666',
        lineHeight: 22,
        textAlign: 'center'
    },
    buttonGroup: {
        flexDirection: 'row',
        width: '100%',
        gap: 16,
    },
    notNowButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notNowText: {
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        color: '#080808',
    },
    enableButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#080808',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enableText: {
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        color: '#FBFBFB',
    },
});
