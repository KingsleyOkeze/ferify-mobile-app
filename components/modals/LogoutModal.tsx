import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function LogoutModal({ isVisible, onClose }: LogoutModalProps) {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        onClose();
        await logout();
        router.replace('/auth/login/LoginScreen');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.centeredModalOverlay}
                onPress={onClose}
            >
                <Pressable style={styles.centeredModalContent}>
                    <Text style={styles.confirmModalTitle}>Confirm Logout</Text>
                    <Text style={styles.confirmModalDescription}>
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                    </Text>

                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmLogoutButton]}
                            onPress={handleLogout}
                        >
                            <Text style={styles.confirmLogoutButtonText}>Yes I Do</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelModalButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelModalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredModalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredModalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
        width: '85%',
        maxWidth: 400,
    },
    confirmModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 12,
    },
    confirmModalDescription: {
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
    confirmLogoutButton: {
        backgroundColor: '#E53935',
    },
    confirmLogoutButtonText: {
        color: '#FBFBFB',
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
    },
    cancelModalButton: {
        backgroundColor: '#F5F5F5',
    },
    cancelModalButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});

