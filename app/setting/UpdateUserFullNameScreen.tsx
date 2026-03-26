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
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';

function UpdateUserFullNameScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const currentFullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not set';

    const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        showLoader();
        try {
            const response = await api.put('/api/user/account/update-full-name', {
                firstName: firstName.trim(),
                lastName: lastName.trim()
            });

            if (response.status === 200) {
                // Update global state and cache
                updateUser({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    fullName: `${response.data.firstName} ${response.data.lastName}`
                });

                showToast('success', 'Name updated successfully');
                router.back();
            }
        } catch (error: any) {
            console.error('Update full name error:', error.response?.data || error.message);
            showToast('error', error.response?.data?.error || 'Failed to update name');
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
                <Text style={styles.headerTitle}>Full Name</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.screenTitle}>Update your Full Name</Text>
                    <Text style={styles.descriptionText}>
                        This is the name that will be displayed in your profile.
                    </Text>

                    {/* Current Name Info */}
                    <View style={styles.infoGroup}>
                        <Text style={styles.label}>Current name</Text>
                        <Text style={styles.currentValue}>{currentFullName}</Text>
                    </View>

                    {/* First Name Input */}
                    <View style={styles.inputStack}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.fieldLabel}>First name</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedField === 'firstName' && styles.inputFocused
                                ]}
                                placeholder="Enter first name"
                                placeholderTextColor="#999"
                                value={firstName}
                                onChangeText={setFirstName}
                                onFocus={() => setFocusedField('firstName')}
                                onBlur={() => setFocusedField(null)}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Last Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.fieldLabel}>Last name</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedField === 'lastName' && styles.inputFocused
                                ]}
                                placeholder="Enter last name"
                                placeholderTextColor="#999"
                                value={lastName}
                                onChangeText={setLastName}
                                onFocus={() => setFocusedField('lastName')}
                                onBlur={() => setFocusedField(null)}
                                autoCapitalize="words"
                            />
                        </View>
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
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    label: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        color: '#000',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24
    },
    inputStack: {
        gap: 20,
    },
    inputGroup: {
        width: '100%',
    },
    fieldLabel: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 16,
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
        fontFamily: 'BrittiSemibold',
        color: '#FFFFFF',
    },
    updateButtonTextDisabled: {
        color: '#979797',
    },
});

export default UpdateUserFullNameScreen;
