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

// Dummy user data
const USER_DATA = {
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+234 801 222 3333',
    location: 'Lagos, Nigeria',
    image: null,
};

function AccountDetailsScreen() {
    const router = useRouter();
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        setIsLogoutModalVisible(false);
        // Add actual logout logic here (e.g., clearing tokens)
        router.replace('/auth/login/LoginScreen');
    };

    const personalInfoItems = [
        { id: 'username', title: 'Username', value: `@${USER_DATA.username}`, onPress: () => router.push('../setting/UpdateUsernameScreen') },
        { id: 'name', title: 'Full name', value: USER_DATA.fullName, onPress: () => router.push('../setting/UpdateUserFullNameScreen') },
        { id: 'phone', title: 'Phone number', value: USER_DATA.phone, onPress: () => router.push('../setting/UpdateUserPhoneNumberScreen') },
        { id: 'email', title: 'Email address', value: USER_DATA.email, onPress: () => router.push('../setting/UpdateUserEmailScreen') },
        { id: 'location', title: 'Location', value: USER_DATA.location, onPress: () => { } },
    ];

    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`;
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
                        {USER_DATA.image ? (
                            <Image source={{ uri: USER_DATA.image }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitials}>
                                    {getInitials(USER_DATA.firstName, USER_DATA.lastName)}
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
                        onPress={() => { router.push('./DeleteAccountScreen')}}
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

                        <TouchableOpacity style={styles.modalOption} onPress={() => setShowAvatarModal(false)}>
                            <Text style={styles.modalOptionText}>Choose your avatar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => setShowAvatarModal(false)}>
                            <Text style={styles.modalOptionText}>Take photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => setShowAvatarModal(false)}>
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

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isLogoutModalVisible}
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <Pressable
                    style={styles.centeredModalOverlay}
                    onPress={() => setIsLogoutModalVisible(false)}
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
        backgroundColor: '#FBFBFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 400,
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
        marginTop: 15,
        marginLeft: 20,
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
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
        fontWeight: 'bold',
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
        borderBottomColor: '#E3E3E3',
        height: 87
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#E3E3E3',
    },
    itemTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 4,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 400,
        color: '#757575',
    },
    footerStatement: {
        fontSize: 12,
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
        fontWeight: '600',
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
    confirmLogoutButton: {
        backgroundColor: '#E53935',
    },
    confirmLogoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelModalButton: {
        backgroundColor: '#F5F5F5',
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
        height: 72
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
