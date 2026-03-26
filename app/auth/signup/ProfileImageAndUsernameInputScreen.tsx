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
    Image,
    Pressable,
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProfileImageAndUsernameInputScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { updateUser } = useAuth();
    const { showToast } = useToast();
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid = username.trim().length > 0;

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
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        try {
            // Update Profile Photo if selected
            if (image) {
                const formData = new FormData();
                const uriParts = image.split('.');
                const fileType = uriParts[uriParts.length - 1];

                // @ts-ignore
                formData.append('profilePhoto', {
                    uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
                    name: `profile_photo.${fileType}`,
                    type: `image/${fileType}`,
                });

                await api.put('/api/user/account/update-profile-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            // Update Profile Details
            const profileResponse = await api.put('/api/user/account/update-profile', {
                firstName: params.firstName,
                lastName: params.lastName,
                username: username.trim(),
            });

            // Save User Data Locally
            if (profileResponse.data.user) {
                updateUser(profileResponse.data.user);
            }

            // Move to Home
            router.replace('/(tabs)/HomeScreen');

        } catch (error: any) {
            console.error("Profile Setup Error:", error.response?.data || error.message);
            showToast('error', "Setup Failed: " + (error.response?.data?.error || "Could not complete your profile setup. Please try again."));
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
                            <Text style={styles.stepText}>Step 3 of 3</Text>
                        </View>
                    </View>

                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Final step!</Text>
                        <Text style={styles.subtitle}>
                            Set up your profile, this is what will show on your profile.
                        </Text>
                    </View>

                    {/* Profile Image Picker */}
                    <View style={styles.imageContainer}>
                        <Pressable onPress={pickImage} style={styles.imageWrapper}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderImage} />
                            )}
                            <View style={styles.editIconContainer}>
                                <Image
                                    source={require("../../../assets/images/onboarding/select_profile_image_icon.png")}
                                    style={styles.cameraIcon}
                                />
                            </View>
                        </Pressable>
                    </View>

                    {/* Form Inputs */}
                    <View style={styles.formContainer}>
                        {/* Username */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={[
                                styles.inputWrapper,
                                focusedField === 'username' && styles.focusedInput
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your username"
                                    placeholderTextColor="#757575"
                                    value={username}
                                    onChangeText={setUsername}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    autoCapitalize="none"
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
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={[
                                    styles.continueButtonText,
                                    !isFormValid && { color: '#979797' }
                                ]}>Continue</Text>
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
        backgroundColor: '#FBFBFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        marginTop: 8,
        marginLeft: -4,
    },
    backButton: {
        marginBottom: 24
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
    },
    title: {
        fontSize: 20,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        lineHeight: 22,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 52,
        marginBottom: 44
    },
    imageWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
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
        backgroundColor: '#F3F3F3',
        borderColor: '#DADADA',
        borderWidth: 1,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 33,
        height: 33,
        backgroundColor: '#fff',
        borderRadius: 16.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cameraIcon: {
        width: 29.05,
        height: 29.13,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#080808',
        fontFamily: 'BrittiRegular',
    },
    focusedInput: {
        borderColor: '#080808',
    },
    continueButton: {
        backgroundColor: '#080808',
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#CECECE',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'BrittiBold',
    },
});
