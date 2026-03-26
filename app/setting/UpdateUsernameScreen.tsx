import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';

function UpdateUsernameScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const [currentUsername, setCurrentUsername] = useState(user?.username || 'Not set');
    const [newUsername, setNewUsername] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();

    useEffect(() => {
        if (user?.username) {
            setCurrentUsername(user.username);
        }
    }, [user?.username]);

    const isFormValid = newUsername.trim().length > 0;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        showLoader();
        try {
            const response = await api.put('/api/user/account/update-username', { newUsername: newUsername.trim() });
            if (response.status === 200) {
                // Update global state and storage via AuthContext
                updateUser({ username: response.data.username });

                showToast('success', 'Username updated successfully');
                router.back();
            }
        } catch (error: any) {
            console.error('Update username error:', error);
            showToast('error', error.response?.data?.error || 'Failed to update username');
        } finally {
            hideLoader();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Username</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.screenTitle}>Update your Username</Text>
                    <Text style={styles.descriptionText}>
                        This is the name that will show when you share a fare.
                    </Text>

                    {/* Current Username */}
                    <View style={styles.infoGroup}>
                        <Text style={styles.label}>Current username</Text>
                        <Text style={styles.currentValue}>@{currentUsername}</Text>
                    </View>

                    {/* New Username Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New username</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isInputFocused && styles.inputFocused
                            ]}
                            placeholder="Enter new username"
                            placeholderTextColor="#999"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            !isFormValid && styles.updateButtonDisabled
                        ]}
                        disabled={!isFormValid}
                        onPress={handleUpdate}
                    >
                        <Text style={[
                            styles.updateButtonText,
                            !isFormValid && styles.updateButtonTextDisabled
                        ]}>
                            Update
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    content: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        lineHeight: 19.2,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        lineHeight: 24,
        marginBottom: 24,
    },
    infoGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 16,
    },
    currentValue: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 100,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        backgroundColor: '#F0F0F0',
    },
    inputFocused: {
        borderColor: '#6B6B6B',
        backgroundColor: '#F0F0F0',
    },
    footer: {
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    updateButton: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    updateButtonText: {
        fontSize: 16,
        fontFamily: 'BrittiBold',
        color: '#FFFFFF',
    },
    updateButtonTextDisabled: {
        color: '#979797',
    },
});

export default UpdateUsernameScreen;
