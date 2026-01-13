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
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

function UpdateUsernameScreen() {
    const router = useRouter();
    const [currentUsername, setCurrentUsername] = useState('Not set');
    const [newUsername, setNewUsername] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                if (username) setCurrentUsername(username);
            } catch (error) {
                console.error('Error fetching username from storage:', error);
            }
        };
        fetchUserData();
    }, []);

    const isFormValid = newUsername.trim().length > 0 && !isLoading;

    const handleUpdate = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            const response = await api.put('/api/user/account/update-username', { newUsername: newUsername.trim() });
            if (response.status === 200) {
                // Update local storage
                await AsyncStorage.setItem('username', response.data.username);

                Alert.alert('Success', 'Username updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (error) {
            console.error('Update username error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Username</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.screenTitle}>Update your username</Text>
                    <Text style={styles.descriptionText}>
                        Choose a unique username that others can use to find you on the platform.
                    </Text>

                    {/* Current Username */}
                    <View style={styles.infoGroup}>
                        <Text style={styles.label}>Current username</Text>
                        <Text style={styles.currentValue}>@{currentUsername}</Text>
                    </View>

                    {/* New Username Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New username</Text>
                        <TextInput
                            style={[
                                styles.input,
                                isInputFocused && styles.inputFocused
                            ]}
                            placeholder="Enter new username"
                            placeholderTextColor="#999"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
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

export default UpdateUsernameScreen;
