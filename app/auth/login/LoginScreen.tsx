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
    ActivityIndicator,
    Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import api, { setToken } from "@/services/api";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

// Logo
import LOGO from "@/assets/images/logo/BLACK-LOGO.png";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [loading, setLoading] = useState(false);

    // Google Auth Request
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
        iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
        webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { idToken } = response.authentication || {};

            if (idToken) {
                setLoading(true);
                api.post('/api/user/auth/google-login', { idToken })
                    .then(async (res) => {
                        console.log("Google Login Backend Success:", res.data);
                        if (res.data.accessToken) {
                            await setToken(res.data.accessToken);
                            // Wait, I updated api.ts to export setToken, but LoginScreen imports default api. 
                            // I need to update import or use api.setToken if I attached it? 
                            // In VerifyLoginScreen I imported { setToken }. I should do same here.
                            router.replace('/tabs/HomeScreen');
                        }
                    })
                    .catch((error) => {
                        console.error("Google Backend Error:", error.response?.data || error.message);
                        Alert.alert("Google Sign-In Failed", "Could not verify with server.");
                    })
                    .finally(() => setLoading(false));
            } else {
                Alert.alert("Error", "No ID token received from Google");
            }
        }
    }, [response]);

    // Validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email.trim()));
    }, [email]);

    const handleContinue = async () => {
        if (!isEmailValid) return;

        setLoading(true);
        try {
            // This would typically initiate the login process (e.g., check email, then move to verification or password)
            // For now, we'll follow a flow similar to signup where we might send an OTP or ask for password next
            const response = await api.post("/api/user/auth/login/initiate", {
                email: email.trim()
            });
            console.log("Login initiated:", response.data);

            // Navigate to verification screen
            router.push({
                pathname: "/auth/login/VerifyLoginScreen",
                params: { email: email.trim() }
            });
        } catch (error: any) {
            console.error("Login initiation error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "Failed to start sign in. Please try again.");
        } finally {
            setLoading(false);
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
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                    </View>

                    {/* Welcome Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>
                            Sign in to your account to continue sharing and finding real fares.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your email address</Text>
                            <View style={[
                                styles.inputWrapper,
                                email.length > 0 && !isEmailValid ? styles.inputErrorBorder : null
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@gmail.com"
                                    placeholderTextColor="#9a9a9a"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[
                                styles.signInButton,
                                !isEmailValid && styles.disabledButton
                            ]}
                            onPress={handleContinue}
                            disabled={!isEmailValid || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signInButtonText}>Sign in</Text>
                            )}
                        </TouchableOpacity>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={styles.forgotPasswordContainer}
                            onPress={() => router.push("/auth/ForgotPasswordScreen")}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
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
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text style={styles.termsText}>
                            By signing in, you agree to our{" "}
                            <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{" "}
                            <Text style={styles.termsHighlight}>Privacy Policy</Text>.
                        </Text>

                        {/* Sign Up Footer */}
                        <TouchableOpacity
                            style={styles.footerLink}
                            onPress={() => router.push("/auth/signup/SignupScreen")}
                        >
                            <Text style={styles.footerText}>
                                New to Ferify? <Text style={styles.footerHighlight}>Create an account</Text>
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
        paddingTop: 40,
        paddingBottom: 20,
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
    inputErrorBorder: {
        borderColor: "#FF3B30",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#080808",
    },
    eyeIcon: {
        padding: 4,
    },
    signInButton: {
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
    signInButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginTop: 12,
    },
    forgotPasswordText: {
        color: "#080808",
        fontSize: 14,
        fontWeight: "500",
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
