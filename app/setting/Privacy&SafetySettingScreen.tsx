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

function PrivacyAndSafetySettingScreen() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState('public'); // 'public' | 'private'
    const [tempSelection, setTempSelection] = useState('public');

    const openModal = () => {
        setTempSelection(profileVisibility);
        setModalVisible(true);
    };

    const saveSelection = () => {
        setProfileVisibility(tempSelection);
        setModalVisible(false);
    };

    const settingsItems = [
        {
            id: 'profile',
            title: 'Profile visibility',
            description: 'Manage who can see your profile info',
            onPress: openModal,
        },
        {
            id: 'contribution',
            title: 'Contribution visibility',
            description: 'Control visibility of your contributions',
            onPress: () => { },
        },
        {
            id: 'location',
            title: 'Location data',
            description: 'Manage your location usage',
            onPress: () => { },
        },
    ];

    const visibilityOptions = [
        { id: 'public', label: 'Public' },
        { id: 'private', label: 'Private' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Safety</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Settings List */}
                <View style={styles.listContainer}>
                    {settingsItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.listItem} onPress={item.onPress}>
                            <View style={styles.textContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                            </View>
                            {/* Arrow without tail: Chevron Forward */}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Profile Visibility Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Profile visibility</Text>

                        <View style={styles.optionsContainer}>
                            {visibilityOptions.map((option, index) => {
                                const isSelected = tempSelection === option.id;
                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionItem,
                                            index === 0 && styles.firstOptionItem
                                        ]}
                                        onPress={() => setTempSelection(option.id)}
                                    >
                                        <Text style={styles.optionLabel}>{option.label}</Text>

                                        {/* Custom Checkmark Radio */}
                                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={14} color="#fff" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.footerButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.footerButton, styles.saveButton]}
                                onPress={saveSelection}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        // paddingHorizontal: 20, 
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 24,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 24,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstOptionItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    optionLabel: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    footerButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    saveButton: {
        backgroundColor: '#000',
    },
    cancelButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default PrivacyAndSafetySettingScreen;
