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

export default function FullNameInputScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    const handleContinue = () => {
        if (isFormValid) {
            router.push({
                pathname: '/auth/signup/ProfileImageAndUsernameInputScreen',
                params: { firstName: firstName.trim(), lastName: lastName.trim() }
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#080808" />
                        </TouchableOpacity>
                    </View>

                    {/* Step Badge */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepText}>Step 2 of 3</Text>
                        </View>
                    </View>

                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>You're almost done!</Text>
                        <Text style={styles.subtitle}>
                            Finish setting up your profile, this will only take a minute.
                        </Text>
                    </View>

                    {/* Form Inputs */}
                    <View style={styles.formContainer}>
                        {/* First Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your first name</Text>
                            <View style={[
                                styles.inputWrapper,
                                focusedField === 'firstName' && styles.focusedInput
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g John"
                                    placeholderTextColor="#757575"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    onFocus={() => setFocusedField('firstName')}
                                    onBlur={() => setFocusedField(null)}
                                    autoFocus
                                />
                            </View>
                        </View>

                        {/* Last Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your last name</Text>
                            <View style={[
                                styles.inputWrapper,
                                focusedField === 'lastName' && styles.focusedInput
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g Doe"
                                    placeholderTextColor="#757575"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    onFocus={() => setFocusedField('lastName')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                !isFormValid && styles.disabledButton
                            ]}
                            onPress={handleContinue}
                            disabled={!isFormValid}
                        >
                            <Text style={[
                                styles.continueButtonText,
                                !isFormValid && { color: '#979797' }
                            ]}>Continue</Text>
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
        backgroundColor: '#FBFBFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        // paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 24,
        marginLeft: -10,
    },
    backButton: {
        padding: 8,
    },
    stepContainer: {
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    stepBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#DADADA',
        backgroundColor: 'transparent',
        width: 96,
        height: 33,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    textContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 20,
        color: '#080808',
        marginBottom: 8,
        fontFamily: "BrittiBold",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#393939',
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        color: '#080808',
        marginBottom: 8,
        marginLeft: 4,
        fontFamily: 'BrittiRegular'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#080808',
        fontFamily: 'BrittiRegular'
    },
    focusedInput: {
        borderColor: '#080808',
        backgroundColor: '#F0F0F0',
    },
    continueButton: {
        backgroundColor: '#080808',
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#CECECE',
    },
    continueButtonText: {
        color: '#FBFBFB',
        fontSize: 16,
        fontFamily: 'BrittiBold'
    },
});
