import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert, ActivityIndicator } from 'react-native';

import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLoader } from '@/contexts/LoaderContext';
import LogoutModal from '@/components/modals/LogoutModal';

// Fallback user data
const DEFAULT_USER_DATA = {
    firstName: '',
    lastName: '',
    fullName: 'Set your name',
    username: 'username',
    email: 'email@example.com',
    phone: 'Add phone number',
    location: 'Set location',
    profilePhoto: null,
};

const DEFAULT_AVATAR_COLORS = [
    '#2E7D32', // Green
    '#1565C0', // Blue
    '#C62828', // Red
    '#6A1B9A', // Purple
    '#EF6C00', // Orange
    '#00838F', // Cyan
];

function AccountDetailsScreen() {
    const router = useRouter();
    const { user, logout, refreshUser, updateUser } = useAuth();

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    React.useEffect(() => {
        // Refresh when entering screen to ensure data is fresh
        refreshUser();
    }, []);

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
        setShowAvatarModal(false);
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery access is required to pick photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
        setShowAvatarModal(false);
    };

    const uploadImage = async (uri: string) => {
        showLoader();
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : `image/jpeg`;

            // @ts-ignore - FormData expects a different structure than web in React Native
            formData.append('profilePhoto', { uri, name: filename, type });

            const response = await api.put('/api/user/account/update-profile-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.profilePhoto) {
                updateUser({ profilePhoto: response.data.profilePhoto });
                Alert.alert('Success', 'Profile photo updated successfully');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
            hideLoader();
        }
    };

    const handleSelectColor = async (color: string) => {
        showLoader();
        try {
            const response = await api.put('/api/user/account/update-profile', {
                profilePhoto: null, // Clear photo
                avatarColor: color  // Custom field
            });

            if (response.status === 200) {
                updateUser({ profilePhoto: null, avatarColor: color });
            }
        } catch (error) {
            console.error('Error updating avatar color:', error);
        } finally {
            hideLoader();
            setShowColorPicker(false);
        }
    };

    const personalInfoItems = [
        { id: 'name', title: 'Full name', value: user?.fullName || 'Set your name', onPress: () => router.push('../setting/UpdateUserFullNameScreen') },
        { id: 'username', title: 'Username', value: user?.username ? `@${user.username}` : 'Set username', onPress: () => router.push('../setting/UpdateUsernameScreen') },
        { id: 'phone', title: 'Phone number', value: user?.phone || 'Add phone number', onPress: () => router.push('../setting/UpdateUserPhoneNumberScreen') },
        { id: 'email', title: 'Email address', value: user?.email || 'Set email', onPress: () => router.push('../setting/UpdateUserEmailScreen') },
        { id: 'location', title: 'Location', value: user?.location || 'Set location', onPress: () => { } },
    ];

    const getInitials = (first?: string, last?: string) => {
        if (!first && !last) return "??";
        return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account details</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Personal Info</Text>

                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        {user?.profilePhoto ? (
                            <Image source={{ uri: user?.profilePhoto }} style={styles.avatarImage} />
                        ) : (
                            <View style={[
                                styles.avatarPlaceholder,
                                // @ts-ignore
                                user?.avatarColor && { backgroundColor: user?.avatarColor }
                            ]}>
                                <Text style={styles.avatarInitials}>
                                    {getInitials(user?.firstName, user?.lastName)}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.editIconContainer}
                            onPress={() => setShowAvatarModal(true)}
                        >
                            <Ionicons name="pencil" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Personal Info List */}
                <View style={styles.listContainer}>
                    {personalInfoItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.listItem,
                                index === 0 && styles.firstListItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemValue}>{item.value}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Footer Statement */}
                <Text style={styles.footerStatement}>
                    Your location helps us show you relevant transport data.
                </Text>

                <View style={styles.actionListContainer}>
                    <TouchableOpacity
                        style={[styles.listItem, styles.firstListItem]}
                        onPress={() => setIsLogoutModalVisible(true)}
                    >
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.actionText}>Log out</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => { router.push('./DeleteAccountScreen') }}
                    >
                        <View style={styles.itemTextContainer}>
                            <Text style={[styles.actionText, styles.deleteText]}>Delete account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Avatar Modal */}
            <Modal
                visible={showAvatarModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAvatarModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowAvatarModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <TouchableOpacity style={styles.modalOption} onPress={() => { setShowAvatarModal(false); setShowColorPicker(true); }}>
                            <Text style={styles.modalOptionText}>Choose your avatar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
                            <Text style={styles.modalOptionText}>Take photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handlePickImage}>
                            <Text style={styles.modalOptionText}>Choose existing photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalOption, styles.cancelOption]}
                            onPress={() => setShowAvatarModal(false)}
                        >
                            <Text style={[styles.modalOptionText, styles.cancelText]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Avatar Color Picker Modal */}
            <Modal
                visible={showColorPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowColorPicker(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowColorPicker(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Choose avatar color</Text>

                        <View style={styles.colorGrid}>
                            {DEFAULT_AVATAR_COLORS.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[styles.colorOption, { backgroundColor: color }]}
                                    onPress={() => handleSelectColor(color)}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.modalOption, styles.cancelOption]}
                            onPress={() => setShowColorPicker(false)}
                        >
                            <Text style={[styles.modalOptionText, styles.cancelText]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#EAECF1',
    },
    headerButton: {
        // padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginTop: 24,
        marginLeft: 20,
        marginBottom: 24,
        lineHeight: 19.2
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 72,
        height: 72,
        borderRadius: 100,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 100,
        backgroundColor: '#F0F0F0', // Light grey placeholder
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 30,
        fontFamily: 'BrittiSemibold',
        fontWeight: 600,
        color: '#333',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2E7D32', // Green
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    listContainer: {
        // paddingHorizontal: 20,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    itemTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 24,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        // marginBottom: 2,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24
    },
    footerStatement: {
        fontSize: 12,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        textAlign: 'right',
        marginRight: 20,
        marginTop: 8,
        marginBottom: 30,
    },
    actionListContainer: {
        marginBottom: 40,
    },
    actionText: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000',
    },
    deleteText: {
        color: '#E53935', // Red
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'flex-end',
    },
    centeredModalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 10,
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
        fontWeight: 600,
    },
    cancelModalButton: {
        backgroundColor: '#F5F5F5',
        fontFamily: 'BrittiSemibold',
    },
    cancelModalButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalOption: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        alignItems: 'center',
        height: 72,
        justifyContent: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'BrittiSemibold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#080808'
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 20,
        gap: 15
    },
    colorOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#DADADA',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#080808',
        fontWeight: 600,
    },
    cancelOption: {
        marginTop: 10,
        borderBottomWidth: 0,
    },
    cancelText: {
        color: '#E53935',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AccountDetailsScreen;
