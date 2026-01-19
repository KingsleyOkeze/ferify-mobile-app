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

export default function PersonalInfoScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');

    const isFormValid = phoneNumber.trim().length >= 10;

    const handleContinue = () => {
        if (isFormValid) {
            router.push({
                pathname: '/auth/signup/ProfileSetupScreen',
                params: { phoneNumber }
            });
        }
    };

    const handleSkip = () => {
        router.push('/auth/signup/ProfileSetupScreen');
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#080808" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Step Badge */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepText}>Step 2 of 3</Text>
                        </View>
                    </View>

                    {/* Titles */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Add your phone number</Text>
                        <Text style={styles.subtitle}>
                            This helps us keep your account secure. We won't share it with anyone.
                        </Text>
                    </View>

                    {/* Inputs */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#9a9a9a"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Continue Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !isFormValid && styles.disabledButton
                            ]}
                            onPress={handleContinue}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: -10,
    },
    backButton: {
        padding: 10,
    },
    skipText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    stepContainer: {
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    stepBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F9F9F9',
    },
    stepText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#080808',
    },
    textContainer: {
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
    formContainer: {
        flex: 1,
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
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7F9",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: "transparent",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#080808",
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 20,
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
