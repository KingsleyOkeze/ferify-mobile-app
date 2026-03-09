import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import * as Application from 'expo-application';
import { getAndroidClientId, getWebClientId, getIosClientId } from "../../../utils/googleAuth";


WebBrowser.maybeCompleteAuthSession();


export default function SignUpScreen() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const { login } = useAuth();
    const { showToast } = useToast();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Validation State
    const [isEmailValid, setIsEmailValid] = useState(false);


    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: getWebClientId(),
        androidClientId: getAndroidClientId(), // Note: use android debug id for dev and android release id for prod.
        iosClientId: getIosClientId(),
        redirectUri: makeRedirectUri({
            // native: `${Application.applicationId}:/oauth2redirect`,
            native: "com.ferify.app://",
        }),
    });

    useEffect(() => {
        if (request) {
            console.log("Signup Redirect URI:", request.redirectUri);
        }
    }, [request]);

    // Handle Google Sign-In response
    useEffect(() => {
        if (response?.type === "success") {
            // Show loader immediately so the user never sees the signup screen
            // flash while the app transitions back from the OAuth browser.
            showLoader();

            const { idToken } = response.params;

            if (!idToken) {
                console.error("No ID token found in response params!", response);
                // Fallback to authentication object if params doesn't have it
                const backupToken = response.authentication?.idToken;
                if (backupToken) {
                    signInWithGoogle(backupToken);
                } else {
                    hideLoader();
                    showToast('error', "Google Sign-In Failed: No ID token received.");
                }
                return;
            }

            signInWithGoogle(idToken);
        }
    }, [response]);

    const signInWithGoogle = async (idToken: string) => {
        try {
            // Loader is already showing from the response useEffect
            const res = await api.post("/api/user/auth/google-login", { idToken });

            if (res.status === 200) {
                const { accessToken, refreshToken, user, isNewUser } = res.data;

                // Update Auth Context
                await login(user, accessToken, refreshToken);

                if (isNewUser) {
                    // If they are new, take them to onboarding screen
                    router.replace("/auth/onboarding/OnboardingScreen");
                } else {
                    // If they already existed, go straight home
                    router.replace("/(tabs)/HomeScreen");
                }
            }

        } catch (err: any) {
            console.error("Backend Google Login Error:", err);
            showToast('error', "Login Failed: " + (err.response?.data?.error || "An error occurred."));
        } finally {
            hideLoader();
        }
    };

    // Validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email.trim()));
    }, [email]);

    const isFormValid =
        isEmailValid &&
        password.length >= 8;

    const handleCreateAccount = async () => {
        if (!isFormValid) return;

        showLoader();
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
            console.error('error sigining up', error)
            console.error("Signup Error:", error.response?.data || error.message);
            showToast('error', "Signup Failed: " + (error.response?.data?.error || "An error occurred. Please try again."));
        } finally {
            hideLoader();
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
                            <View style={[
                                styles.inputWrapper,
                                focusedField === 'email' && { borderColor: '#080808' }
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter email here"
                                    placeholderTextColor="#757575"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[
                                styles.inputWrapper,
                                focusedField === 'password' && { borderColor: '#080808' },
                                (password.length > 0 && password.length < 8) && { borderColor: '#EF4444' }
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor="#757575"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#6B6B6B"
                                    // style={{ marginRight: 2 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {password.length > 0 && password.length < 8 && (
                                <Text style={styles.errorText}>Password must be at least 8 characters</Text>
                            )}
                        </View>
                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.createButton,
                                (!isFormValid) && styles.disabledButton
                            ]}
                            onPress={handleCreateAccount}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.createButtonText}>Continue</Text>
                        </TouchableOpacity>

                        {/* Or Separator */}
                        <View style={styles.separatorContainer}>
                            <View style={styles.separatorLine} />
                            <Text style={styles.separatorText}>OR</Text>
                            <View style={styles.separatorLine} />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={() => promptAsync()}
                        >
                            <Image source={require("../../../assets/images/onboarding/google_logo.png")} style={styles.googleLogo} />
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
        backgroundColor: '#FBFBFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        // paddingTop: 10,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 24,
        marginLeft: -4,
    },
    backButton: {
        paddingTop: 8,
    },
    stepContainer: {
        marginBottom: 24,
        alignItems: 'flex-start',
        width: 96,
        height: 33,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#DADADA',
    },
    stepBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        fontSize: 14,
        fontFamily: "BrittiRegular",
        fontWeight: 400,
        color: '#080808',
    },
    textContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        color: "#080808",
        marginBottom: 4,
        alignSelf: "flex-start",
        fontFamily: "BrittiBold",
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "BrittiRegular",
        color: "#393939",
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontFamily: "BrittiRegular",
        color: "#080808",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 100,
        paddingHorizontal: 8,
        height: 56,
        borderWidth: 1,
        borderColor: "transparent",
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: "BrittiRegular",
        color: "#080808",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        fontFamily: "BrittiRegular",
        marginTop: 8,
        textAlign: "right",
    },
    createButton: {
        backgroundColor: "#080808",
        height: 50,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 10,
    },
    disabledButton: {
        backgroundColor: "#CECECE",
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "BrittiBold",
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    separatorText: {
        marginHorizontal: 16,
        color: "#757575",
        fontSize: 14,
    },
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#F5F7F9",
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    googleLogo: {
        marginRight: 10,
        height: 18,
        width: 18
    },
    googleButtonText: {
        color: "#080808",
        fontSize: 16,
        fontFamily: "BrittiRegular",
    },
    termsText: {
        fontSize: 12,
        fontFamily: "BrittiRegular",
        color: "#6B6B6B",
        textAlign: "center",
        marginTop: 12,
        lineHeight: 18,
    },
    termsHighlight: {
        color: "#080808",
        fontWeight: 600,
        fontFamily: "BrittiRegular",
    },
    footerLink: {
        marginTop: 24,
        alignItems: "center",
        marginBottom: 20,
        fontFamily: 'BrittiRegular'
    },
    footerText: {
        fontSize: 14,
        fontFamily: "BrittiRegular",
        color: "#393939",
    },
    footerHighlight: {
        color: "#080808",
        fontFamily: "BrittiBold",
        textDecorationLine: "underline",
    },
});
