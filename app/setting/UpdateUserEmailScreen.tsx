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
    Alert,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';

function UpdateUserEmailScreen() {
    const router = useRouter();
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();
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
        showLoader();
        try {
            const response = await api.post('/api/user/account/update-user-email', { newEmail });
            if (response.status === 200) {
                router.push({
                    pathname: './VerifyUpdateUserEmailScreen',
                    params: { email: newEmail }
                });
            }
        } catch (error: any) {
            console.error('Update email error:', error.response?.data || error.message);
            showToast('error', error.response?.data?.error || 'Failed to initiate email update');
        } finally {
            setIsLoading(false);
            hideLoader();
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
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/settings-icons/email_icon.png')}
                            style={styles.emailIcon}
                        />
                    </View>
                    <Text style={styles.screenTitle}>Update your Email</Text>
                    <Text style={styles.descriptionText}>
                        This is the email where you will receive messages, sign in
                        and recover your account.
                    </Text>

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
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    imageContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailIcon: {
        width: 104.22,
        height: 100,
        resizeMode: 'contain',
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'left',
    },
    descriptionText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        lineHeight: 22.4,
        marginBottom: 33,
        textAlign: 'left',
    },
    infoGroup: {
        marginBottom: 30,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        color: '#000',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
        width: '100%',
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        backgroundColor: '#EDEDED',
    },
    inputFocused: {
        borderColor: '#080808',
        backgroundColor: '#EDEDED',
    },
    inputLoading: {
        position: 'absolute',
        right: 16,
    },
    verificationNotice: {
        fontSize: 12,
        lineHeight: 24,
        fontFamily: 'BrittiRegular',
        color: '#393939',
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
        fontFamily: 'BrittiSemibold',
        color: '#fff',
    },
    updateButtonTextDisabled: {
        color: '#999',
    },
});

export default UpdateUserEmailScreen;
