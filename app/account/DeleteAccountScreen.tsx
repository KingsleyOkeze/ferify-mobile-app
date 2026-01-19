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

export default function DeleteAccountScreen() {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);

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
                        Deleting your account is permanent and cannot be undone. All your data will be removed.
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
                                <View style={styles.radioButton}>
                                    <View style={styles.radioButtonInner} />
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
                            Public contributions that don't reveal your identity, like fare reports and route suggestions, may remain visible but will be anonymized.
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
                            <Ionicons name="trash-outline" size={40} color="#FF3B30" />
                        </View>

                        <Text style={styles.modalDescription}>
                            Are you sure you want to delete your account? This action is permanent and cannot be reversed.
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelModalButtonText}>Don't delete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmDeleteButton]}
                                onPress={() => {
                                    // Handle actual deletion logic here
                                    setIsModalVisible(false);
                                    router.replace('/auth/login/LoginScreen');
                                }}
                            >
                                <Text style={styles.confirmDeleteButtonText}>Delete account</Text>
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
        paddingHorizontal: 24,
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
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        lineHeight: 24,
    },
    listSection: {
        marginBottom: 32,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#080808',
        marginBottom: 20,
    },
    listContainer: {
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
    },
    firstListItem: {
        borderTopWidth: 1.5,
        borderTopColor: '#F2F2F2',
    },
    itemBorderBottom: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#F2F2F2',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#080808',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#080808',
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
    },
    whatStaysContent: {
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#F2F2F2',
        paddingVertical: 20,
    },
    whatStaysDescription: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 22,
    },
    deleteButton: {
        backgroundColor: '#F2F2F2',
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
        alignItems: 'center',
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
    confirmDeleteButton: {
        backgroundColor: '#080808',
    },
    cancelModalButtonText: {
        color: '#080808',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmDeleteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
