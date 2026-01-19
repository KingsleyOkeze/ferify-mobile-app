import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';

export default function ProfileSetupScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form Fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleContinue = async () => {
        // Basic Validation
        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
            Alert.alert('Missing Fields', 'Please fill in your name and username.');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Update Profile Text Data
            await api.put('/api/user/account/update-profile', {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username: username.trim(),
                phoneNumber: phoneNumber.trim() || undefined
            });

            // 2. Upload Image if selected
            if (image) {
                const formData = new FormData();
                const filename = image.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                formData.append('profilePhoto', {
                    uri: image,
                    name: filename,
                    type: type,
                } as any);

                await api.put('/api/user/account/update-profile-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-type' },
                });
            }

            router.replace('/tabs/HomeScreen');

        } catch (error: any) {
            console.error('Profile setup error:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update profile. Please try again.');
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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        {/* No Back button needed as this is the start of authenticated session */}
                        <View style={{ width: 24 }} />
                        <TouchableOpacity onPress={handleContinue} disabled={isLoading}>
                            <Text style={styles.skipText}>Skip (Test only)</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Complete your profile</Text>
                        <Text style={styles.subtitle}>
                            Add your details so friends can recognize you.
                        </Text>
                    </View>

                    {/* Profile Image Picker */}
                    <View style={styles.imageContainer}>
                        <Pressable onPress={pickImage} style={styles.imageWrapper}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Ionicons name="camera" size={32} color="#666" />
                                </View>
                            )}
                            <View style={styles.editIconContainer}>
                                <Ionicons name="pencil" size={14} color="#fff" />
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.formContainer}>
                        {/* First Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter first name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Last Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter last name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Username */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="@username"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Phone Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number (Optional)</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+123456789"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    editable={!isLoading}
                                />
                            </View>
                        </View>


                        <TouchableOpacity
                            style={[
                                styles.button,
                                isLoading && styles.disabledButton
                            ]}
                            onPress={handleContinue}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Saving...' : 'Explore Ferify'}
                            </Text>
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
    },
    skipText: {
        fontSize: 16,
        color: '#666',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24,
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
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F7F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#080808',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
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
    button: {
        backgroundColor: "#080808",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: "#E0E0E0",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
