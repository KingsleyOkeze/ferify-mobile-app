import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import api, { setToken } from '@/services/api';

// Logo
import LOGO from "@/assets/images/logo/BLACK-LOGO.png";

// Determine redirects for auth
WebBrowser.maybeCompleteAuthSession();

// Placeholder Client IDs - REPLACE THESE WITH YOUR ACTUAL GOOGLE CLOUD CONSOLE IDS
const ANDROID_CLIENT_ID = "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com";
const IOS_CLIENT_ID = "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com";
const WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";

export default function SignUpScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Validation State
    const [isEmailValid, setIsEmailValid] = useState(false);

    // Google Auth Request
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { idToken } = response.authentication || {};

            if (idToken) {
                setIsLoading(true);
                api.post('/api/user/auth/google-login', { idToken })
                    .then(async (res) => {
                        console.log("Google Signup Backend Success:", res.data);
                        if (res.data.accessToken) {
                            await setToken(res.data.accessToken);
                            router.replace('/tabs/HomeScreen');
                        }
                    })
                    .catch((error) => {
                        console.error("Google Backend Error:", error.response?.data || error.message);
                        Alert.alert("Google Sign-Up Failed", "Could not verify with server.");
                    })
                    .finally(() => setIsLoading(false));
            }
        }
    }, [response]);

    // Validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email.trim()));
    }, [email]);

    const isFormValid =
        isEmailValid &&
        password.length >= 6 &&
        password === confirmPassword;

    const handleCreateAccount = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            // Initiate Registration (Email + Password)
            const response = await api.post('/api/user/auth/register/initiate', {
                email: email.trim(),
                password: password
            });

            console.log("Registration Initiated:", response.data);

            // Navigate to Verification
            router.push({
                pathname: "/auth/signup/VerifySignupEmailScreen",
                params: { email: email.trim() }
            });

        } catch (error: any) {
            console.error("Signup Error:", error.response?.data || error.message);
            Alert.alert("Signup Failed", error.response?.data?.error || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                    </View>

                    {/* Step Badge */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepBadge}>
                            <Text style={styles.stepText}>Step 1 of 3</Text>
                        </View>
                    </View>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                    </View>

                    {/* Welcome Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Welcome to Ferify</Text>
                        <Text style={styles.subtitle}>
                            Find real transport fares shared by people around you.
                        </Text>
                    </View>

                    {/* Inputs */}
                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your email address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@gmail.com"
                                    placeholderTextColor="#9a9a9a"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min. 6 characters"
                                    placeholderTextColor="#9a9a9a"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!isLoading}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#666"
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter password"
                                    placeholderTextColor="#9a9a9a"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!isLoading}
                                />
                            </View>
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <Text style={styles.errorText}>Passwords do not match</Text>
                            )}
                        </View>


                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.createButton,
                                (!isFormValid || isLoading) && styles.disabledButton
                            ]}
                            onPress={handleCreateAccount}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.createButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>

                        {/* Or Separator */}
                        <View style={styles.separatorContainer}>
                            <View style={styles.separatorLine} />
                            <Text style={styles.separatorText}>or</Text>
                            <View style={styles.separatorLine} />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={() => promptAsync()}
                            disabled={!request}
                        >
                            <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Sign up with Google</Text>
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By creating an account, you agree to our{" "}
                            <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{" "}
                            <Text style={styles.termsHighlight}>Privacy Policy</Text>.
                        </Text>

                        {/* Sign In Footer */}
                        <TouchableOpacity
                            style={styles.footerLink}
                            onPress={() => router.push("/auth/login/LoginScreen")}
                        >
                            <Text style={styles.footerText}>
                                Have an account? <Text style={styles.footerHighlight}>Sign in here</Text>
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
        backgroundColor: "#fff",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 20,
        marginLeft: -10,
    },
    backButton: {
        padding: 10,
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
    logoContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    logo: {
        width: 80,
        height: 80,
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#080808",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
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
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        textAlign: "right",
    },
    createButton: {
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
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    separatorText: {
        marginHorizontal: 16,
        color: "#9a9a9a",
        fontSize: 14,
    },
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#F5F7F9",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    googleButtonText: {
        color: "#080808",
        fontSize: 16,
        fontWeight: "500",
    },
    termsText: {
        fontSize: 13,
        color: "#9a9a9a",
        textAlign: "center",
        marginTop: 24,
        lineHeight: 18,
    },
    termsHighlight: {
        color: "#080808",
        fontWeight: "500",
    },
    footerLink: {
        marginTop: 32,
        alignItems: "center",
        marginBottom: 20,
    },
    footerText: {
        fontSize: 15,
        color: "#666",
    },
    footerHighlight: {
        color: "#080808",
        fontWeight: "700",
    },
});
