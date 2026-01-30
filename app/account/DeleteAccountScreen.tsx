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
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api, { logout } from '../../services/api';
import { useLoader } from '@/contexts/LoaderContext';

export default function DeleteAccountScreen() {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const handleDeleteAccount = async () => {
        showLoader();
        try {
            await api.delete('/api/user/account/delete-account');
            setIsModalVisible(false);
            // Logout and clear tokens locally, then navigate to login
            await logout(false);
            router.replace('/auth/login/LoginScreen');
        } catch (error: any) {
            console.error('Failed to delete account:', error);
            const errorMessage = error.response?.data?.error || 'Could not delete account. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            hideLoader();
        }
    };

    const deleteItems = [
        "your profile and username",
        "contribution history (fares, routes, reports)",
        "points, bades and achievements"
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Delete account</Text>
                    <Text style={styles.subtitle}>
                        We're sorry to see you go 😢 Deleting your Ferify account will permanently remove your profile activity.
                    </Text>
                </View>

                {/* List Section */}
                <View style={styles.listSection}>
                    <Text style={styles.listTitle}>What will be deleted</Text>
                    <View style={styles.listContainer}>
                        {deleteItems.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.listItem,
                                    index === 0 && styles.firstListItem,
                                    styles.itemBorderBottom
                                ]}
                            >
                                <View style={[styles.radioButton, { backgroundColor: '#080808' }]}>
                                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                </View>
                                <Text style={styles.listItemText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* What Stays Section */}
                <View style={styles.whatStaysSection}>
                    <Text style={styles.whatStaysTitle}>What stays</Text>
                    <View style={styles.whatStaysContent}>
                        <Text style={styles.whatStaysDescription}>
                            Annoymous, aggregated route data may still be used to improve transport estimates for others.
                        </Text>
                    </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.deleteButtonText}>Delete account</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)}
                >
                    <Pressable style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <View style={styles.modalIconContainer}>
                            <Image source={require('@/assets/images/account-and-personal-icons/delete_account_icon.png')} style={styles.deleteIcon} />
                        </View>

                        <Text style={styles.modalTitle}>Delete account?</Text>

                        <Text style={styles.modalDescription}>
                            Are you sure you want to delete your account? This action is permanent and cannot be reversed.
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmDeleteButton]}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={styles.confirmDeleteButtonText}>Delete account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelModalButtonText}>Don't delete</Text>
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
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 8,
        paddingBottom: 40,
    },
    titleSection: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#080808',
        marginBottom: 12,
        paddingHorizontal: 24,
    },
    subtitle: {
        fontSize: 16,
        color: '#393939',
        lineHeight: 24,
        paddingHorizontal: 24,
    },
    listSection: {
        marginBottom: 32,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#080808',
        marginBottom: 20,
        paddingHorizontal: 24,
    },
    listContainer: {
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 61,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    firstListItem: {
        borderTopWidth: 1.5,
        borderTopColor: '#DADADA',
    },
    itemBorderBottom: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#DADADA',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#080808',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    listItemText: {
        fontSize: 16,
        color: '#080808',
        fontWeight: '500',
        flex: 1,
    },
    whatStaysSection: {
        marginTop: 8,
        marginBottom: 40,
    },
    whatStaysTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#080808',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    whatStaysContent: {
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#DADADA',
        backgroundColor: '#FFFFFF',
        height: 82,
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    whatStaysDescription: {
        fontSize: 14,
        color: '#080808',
        fontWeight: 400,
        lineHeight: 22,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 24,
    },
    deleteButtonText: {
        color: '#FBFBFB',
        fontSize: 16,
        fontWeight: 600,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FBFBFB',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
        alignItems: 'center',
        height: 347
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 2.5,
        marginBottom: 30,
    },
    modalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    deleteIcon: {
        width: 85.49,
        height: 64,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#080808',
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 14,
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
        // marginBottom: 20
    },
    cancelModalButton: {
        backgroundColor: '#F0F0F0',
        height: 50
    },
    confirmDeleteButton: {
        backgroundColor: '#EF4444',
        height: 50
    },
    cancelModalButtonText: {
        color: '#212121',
        fontSize: 16,
        fontWeight: 600,
    },
    confirmDeleteButtonText: {
        color: '#FBFBFB',
        fontSize: 16,
        fontWeight: 600,
    },
});
