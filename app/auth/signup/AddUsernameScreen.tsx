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
    ActivityIndicator,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';

// Logo
import LOGO from "@/assets/images/logo/BLACK-LOGO.png";

export default function AddUsernameScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid = username.trim().length >= 3 && !isLoading;

    const handleContinue = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            // This endpoint would typically check if username is available/update it
            const response = await api.put('/api/user/account/update-username', {
                newUsername: username.trim()
            });
            console.log("Username updated:", response.data);
            router.replace('/tabs/HomeScreen');
        } catch (error: any) {
            console.error('Add username error:', error.response?.data || error.message);
            // Handle error (e.g., username taken)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#080808" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Titles */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Add username</Text>
                        <Text style={styles.subtitle}>
                            This is how you'll be identified on Ferify. You can change this later in settings.
                        </Text>
                    </View>

                    {/* Logo */}
                    <Image
                        source={LOGO}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View style={[
                            styles.inputWrapper,
                            isInputFocused && styles.inputFocused
                        ]}>
                            <Text style={styles.atSymbol}>@</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="choose_username"
                                placeholderTextColor="#9a9a9a"
                                value={username}
                                onChangeText={setUsername}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                            />
                        </View>
                        <Text style={styles.helperText}>Must be at least 3 characters.</Text>
                    </View>

                    {/* Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !isFormValid && styles.disabledButton
                            ]}
                            onPress={handleContinue}
                            disabled={!isFormValid}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    textContainer: {
        marginBottom: 32,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#080808",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F5F7F9",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: '#080808',
        backgroundColor: '#fff',
    },
    atSymbol: {
        fontSize: 16,
        color: '#9a9a9a',
        marginRight: 4,
        fontWeight: '500',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#080808',
    },
    helperText: {
        fontSize: 12,
        color: '#9a9a9a',
        marginTop: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        marginTop: 'auto',
        paddingTop: 40,
    },
    continueButton: {
        backgroundColor: "#080808",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#E0E0E0",
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
