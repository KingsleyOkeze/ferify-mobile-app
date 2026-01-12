import React, { useState } from 'react';
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

// Dummy user data
const USER_DATA = {
    email: 'john.doe@example.com',
};

function UpdateUserEmailScreen() {
    const router = useRouter();
    const [newEmail, setNewEmail] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const isFormValid = newEmail.trim().length > 0 && newEmail.includes('@');

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
                        <Text style={styles.currentValue}>{USER_DATA.email}</Text>
                    </View>

                    {/* New Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New email address</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isInputFocused && styles.inputFocused
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
                        />
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
                        onPress={() => router.push('/setting/account/VerifyUpdateUserEmail')}
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
