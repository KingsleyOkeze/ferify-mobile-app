import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useLoader } from "@/contexts/LoaderContext";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const [firstName, setFirstName] = useState<string>("");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, // Note: use android debug id for dev and android release id for prod.
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

    useEffect(() => {
        if (request) {
            console.log("Login Redirect URI:", request.redirectUri);
        }
    }, [request]);

    useEffect(() => {
        if (response?.type === "success") {
            const { idToken } = response.params;

            if (!idToken) {
                const backupToken = response.authentication?.idToken;
                if (backupToken) {
                    signInWithGoogle(backupToken);
                } else {
                    Alert.alert("Google Sign-In Failed", "No ID token received.");
                }
                return;
            }

            signInWithGoogle(idToken);
        }
    }, [response]);

    const { login } = useAuth();

    const signInWithGoogle = async (idToken: string) => {
        setLoading(true);
        try {
            const res = await api.post("/api/user/auth/google-login", { idToken });
            console.log("Google Login Backend Success:", res.data);

            const { accessToken, refreshToken, user: userData } = res.data;

            if (accessToken && userData) {
                await login(userData, accessToken, refreshToken);
                router.replace("/(tabs)/HomeScreen");
            }
        } catch (error: any) {
            console.error("Google Backend Error:", error.response?.data || error.message);
            Alert.alert("Google Sign-In Failed", "Could not verify with server.");
        } finally {
            setLoading(false);
        }
    };

    // Validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email.trim()));
    }, [email]);

    const handleContinue = async () => {
        if (!isEmailValid) return;

        showLoader();
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
            if (error?.response?.status === 403) {
                // Navigate to Verification
                router.push({
                    pathname: "/auth/signup/VerifySignupEmailScreen",
                    params: {
                        email: error.response.data.email.trim(),
                        autoSend: 'true'
                    }
                });
            }
            console.error("Login initiation error:", error.response?.data || error.message);
            // Alert.alert("Error", error.response?.data?.error || "Failed to start sign in. Please try again.");
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#080808" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.topContent}>
                        {/* Welcome Text */}
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Welcome back{firstName ? `, ${firstName}` : ''}</Text>
                            <Text style={styles.subtitle}>
                                Check fares, confirm routes and move faster.
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Your email address</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    focusedField === 'email' && styles.focusedInput,
                                    email.length > 0 && !isEmailValid ? styles.inputErrorBorder : null
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email here"
                                        placeholderTextColor="#9a9a9a"
                                        value={email}
                                        onChangeText={setEmail}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
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
                                    <Text style={[
                                        styles.signInButtonText,
                                        !isEmailValid && { color: '#979797' }
                                    ]}>Sign in</Text>
                                )}
                            </TouchableOpacity>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                style={styles.forgotPasswordContainer}
                                onPress={() => router.push("/auth/forgot-password/ForgotPasswordScreen")}
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
                                disabled={loading || !request}
                            >
                                <Image source={require("../../../assets/images/onboarding/google_logo.png")} style={styles.googleLogo} />
                                <Text style={styles.googleButtonText}>Sign in with Google</Text>
                            </TouchableOpacity>

                            {/* Terms */}
                            <Text style={styles.termsText}>
                                By signing in, you agree to our{" "}
                                <Text style={styles.termsHighlight}>Terms & Conditions</Text> and acknowledge our{" "}
                                <Text style={styles.termsHighlight}>Privacy Policy</Text>.
                            </Text>

                        </View>
                    </View>

                    {/* Footer - Pushed to bottom */}
                    <View style={styles.footerContainer}>

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
        backgroundColor: '#FBFBFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 10,
        marginLeft: -10,
        paddingHorizontal: 24,
    },
    backButton: {
        padding: 5,
    },
    topContent: {
        flex: 1,
    },
    textContainer: {
        alignItems: "flex-start",
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        fontFamily: "BrittiBold",
        color: "#080808",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 400,
        color: "#393939",
        textAlign: "left",
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
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 100,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: "transparent",
    },
    focusedInput: {
        borderColor: "#080808",
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
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: "#CECECE",
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
        color: "#393939",
        fontSize: 14,
        fontWeight: 400,
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#F0F0F0",
    },
    separatorText: {
        marginHorizontal: 16,
        color: "#757575",
        fontSize: 12,
        fontWeight: 400,
    },
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#F2F3F4",
        height: 56,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDEDED",
    },
    googleLogo: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        color: "#080808",
        fontSize: 16,
        fontWeight: "500",
    },
    termsText: {
        fontSize: 12,
        fontWeight: 600,
        color: "#6B6B6B",
        textAlign: "center",
        marginTop: 24,
        lineHeight: 18,
        width: '90%',
        alignSelf: 'center'
    },
    termsHighlight: {
        color: "#080808",
        fontWeight: 600,
        fontSize: 12,
    },
    footerLink: {
        marginTop: 32,
        alignItems: "center",
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        fontWeight: 400,
        color: "#393939",
    },
    footerHighlight: {
        color: "#080808",
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    footerContainer: {
        marginTop: 20,
        paddingBottom: 10,
    },
});
