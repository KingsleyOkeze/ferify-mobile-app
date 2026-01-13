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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

function UpdateUserEmailScreen() {
    const router = useRouter();
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCurrentEmail = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                if (email) {
                    setCurrentEmail(email);
                } else {
                    setCurrentEmail('Not set');
                }
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };
        fetchCurrentEmail();
    }, []);

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/user/account/update-email/initiate', { newEmail });
            if (response.status === 200) {
                router.push({
                    pathname: '/setting/account/VerifyUpdateUserEmailScreen',
                    params: { email: newEmail }
                });
            }
        } catch (error) {
            console.error('Update email error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = newEmail.trim().length > 0 && newEmail.includes('@') && !isLoading;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Email</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.screenTitle}>Update your email</Text>
                    <Text style={styles.descriptionText}>
                        Changing your email address will require you to verify the new one before it becomes active.
                    </Text>

                    {/* Current Email */}
                    <View style={styles.infoGroup}>
                        <Text style={styles.label}>Current email address</Text>
                        <Text style={styles.currentValue}>{currentEmail}</Text>
                    </View>

                    {/* New Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New email address</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[
                                    styles.input,
                                    isInputFocused && styles.inputFocused,
                                    isLoading && { opacity: 0.5 }
                                ]}
                                placeholder="Enter new email"
                                placeholderTextColor="#999"
                                value={newEmail}
                                onChangeText={setNewEmail}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                editable={!isLoading}
                            />
                            {isLoading && (
                                <View style={styles.inputLoading}>
                                    <Text style={{ fontSize: 12, color: '#666' }}>Sending...</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.verificationNotice}>
                            A verification code will be sent to your email
                        </Text>
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
                            {isLoading ? 'Sending...' : 'Update'}
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 30,
    },
    infoGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#F9F9F9',
    },
    inputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    inputLoading: {
        position: 'absolute',
        right: 16,
    },
    verificationNotice: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 8,
    },
    footer: {
        padding: 20,
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
        fontWeight: 'bold',
        color: '#fff',
    },
    updateButtonTextDisabled: {
        color: '#999',
    },
});

export default UpdateUserEmailScreen;
