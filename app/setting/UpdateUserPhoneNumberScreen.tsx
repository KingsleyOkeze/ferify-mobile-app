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
    Dimensions,
    Keyboard
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import CustomNumberKeyboard from '@/components/CustomNumberKeyboard';

function UpdateUserPhoneNumberScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    // Basic phone number validation (e.g., at least 10 digits)
    const isFormValid = phoneNumber.trim().length >= 10;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        showLoader();
        try {
            const response = await api.put('/api/user/account/update-phone', { phoneNumber: phoneNumber.trim() });

            if (response.status === 200) {
                await AsyncStorage.setItem('phoneNumber', phoneNumber.trim());
                Alert.alert('Success', 'Phone number updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (error: any) {
            console.error('Update phone error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update phone number');
        } finally {
            hideLoader();
        }
    };

    const handleKeyPress = (val: string) => {
        if (phoneNumber.length < 15) {
            setPhoneNumber(prev => prev + val);
        }
    };

    const handleDelete = () => {
        setPhoneNumber(prev => prev.slice(0, -1));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Phone number</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={styles.formContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.screenTitle}>Update your number</Text>
                    <Text style={styles.descriptionText}>
                        Keep your contact details up to date for account security and communication.
                    </Text>

                    {/* Phone Number Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone number</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isInputFocused && styles.inputFocused
                            ]}
                            placeholder="e.g. 08123456789"
                            placeholderTextColor="#999"
                            value={phoneNumber}
                            showSoftInputOnFocus={false} // Custom keypad
                            onFocus={() => {
                                setIsInputFocused(true);
                            }}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        <View style={styles.statementRow}>
                            <Text style={styles.statementText}>Please insert valid number.</Text>
                        </View>
                    </View>

                    {/* Update Button - Now right under the text */}
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            !isFormValid && styles.updateButtonDisabled,
                            { marginTop: 24 }
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
                </ScrollView>
            </View>

            {/* Custom Keypad at the bottom */}
            <CustomNumberKeyboard onPress={handleKeyPress} onDelete={handleDelete} />
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
        paddingTop: 10,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        // padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    content: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
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
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#000',
        backgroundColor: '#F0F0F0',
    },
    inputFocused: {
        borderColor: '#6B6B6B',
        backgroundColor: '#F0F0F0',
    },
    statementRow: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    statementText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        fontStyle: 'italic',
    },
    updateButton: {
        height: 56,
        backgroundColor: '#080808',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonDisabled: {
        backgroundColor: '#CECECE',
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#fff',
    },
    updateButtonTextDisabled: {
        color: '#979797',
    },
});

export default UpdateUserPhoneNumberScreen;
