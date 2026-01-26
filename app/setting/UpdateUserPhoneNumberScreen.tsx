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
    Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

const { width } = Dimensions.get('window');

function UpdateUserPhoneNumberScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Basic phone number validation (e.g., at least 10 digits)
    const isFormValid = phoneNumber.trim().length >= 10 && !isLoading;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
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
            setIsLoading(false);
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

    const KeypadButton = ({ value, onPress, isIcon = false }: { value: string, onPress: () => void, isIcon?: boolean }) => (
        <TouchableOpacity style={styles.keypadButton} onPress={onPress} activeOpacity={0.6}>
            {isIcon ? (
                <Ionicons name="backspace-outline" size={24} color="#000" />
            ) : (
                <Text style={styles.keypadButtonText}>{value}</Text>
            )}
        </TouchableOpacity>
    );

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
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            autoFocus={true}
                            editable={!isLoading}
                        />
                        <View style={styles.statementRow}>
                            <Text style={styles.statementText}>Will be verified via OTP</Text>
                        </View>
                    </View>

                    {/* Update Button - Now right under the text */}
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            !isFormValid && styles.updateButtonDisabled,
                            { marginTop: 24 }
                        ]}
                        disabled={!isFormValid || isLoading}
                        onPress={handleUpdate}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[
                                styles.updateButtonText,
                                !isFormValid && styles.updateButtonTextDisabled
                            ]}>
                                Update
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                {/* Custom Keypad at the bottom */}
                <View style={styles.keypadContainer}>
                    <View style={styles.keypadRow}>
                        <KeypadButton value="1" onPress={() => handleKeyPress('1')} />
                        <KeypadButton value="2" onPress={() => handleKeyPress('2')} />
                        <KeypadButton value="3" onPress={() => handleKeyPress('3')} />
                    </View>
                    <View style={styles.keypadRow}>
                        <KeypadButton value="4" onPress={() => handleKeyPress('4')} />
                        <KeypadButton value="5" onPress={() => handleKeyPress('5')} />
                        <KeypadButton value="6" onPress={() => handleKeyPress('6')} />
                    </View>
                    <View style={styles.keypadRow}>
                        <KeypadButton value="7" onPress={() => handleKeyPress('7')} />
                        <KeypadButton value="8" onPress={() => handleKeyPress('8')} />
                        <KeypadButton value="9" onPress={() => handleKeyPress('9')} />
                    </View>
                    <View style={styles.keypadRow}>
                        <View style={styles.keypadEmpty} />
                        <KeypadButton value="0" onPress={() => handleKeyPress('0')} />
                        <KeypadButton value="del" onPress={handleDelete} isIcon />
                    </View>
                </View>
            </View>
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
        backgroundColor: '#F9F9F9',
    },
    inputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    statementRow: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    statementText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#999',
        fontStyle: 'italic',
    },
    updateButton: {
        height: 56,
        backgroundColor: '#000',
        borderRadius: 28,
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
    keypadContainer: {
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 4,
    },
    keypadButton: {
        width: width / 3,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keypadButtonText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
    },
    keypadEmpty: {
        width: width / 3,
    },
});

export default UpdateUserPhoneNumberScreen;
