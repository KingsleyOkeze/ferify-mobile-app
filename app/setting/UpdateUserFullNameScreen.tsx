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
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { getUserData, setUserData } from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';

function UpdateUserFullNameScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currentFullName, setCurrentFullName] = useState('Not set');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                if (data) {
                    if (data.firstName) setFirstName(data.firstName);
                    if (data.lastName) setLastName(data.lastName);
                    if (data.firstName || data.lastName) {
                        setCurrentFullName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
                    }
                }
            } catch (error) {
                console.error('Error fetching user data for name update:', error);
            }
        };
        fetchUserData();
    }, []);

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
                // Update cache
                const cachedData = await getUserData();
                if (cachedData) {
                    const updatedData = {
                        ...cachedData,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        fullName: `${response.data.firstName} ${response.data.lastName}`
                    };
                    await setUserData(updatedData);
                }

                Alert.alert('Success', 'Name updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (error: any) {
            console.error('Update full name error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update name');
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
                    <Text style={styles.screenTitle}>Update your name</Text>
                    <Text style={styles.descriptionText}>
                        This is the name that will be displayed in your profile and community contributions.
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
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 30,
    },
    infoGroup: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
    },
    inputStack: {
        gap: 20,
    },
    inputGroup: {
        width: '100%',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#000',
        backgroundColor: '#F9F9F9',
    },
    inputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#fff',
    },
    updateButtonTextDisabled: {
        color: '#999',
    },
});

export default UpdateUserFullNameScreen;
