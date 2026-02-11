import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLoader } from '@/contexts/LoaderContext';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
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
    View
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();


export default function SignUpScreen() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false); // Kept for Google initialization if needed, but primary actions will use GlobalLoader

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Validation State
    const [isEmailValid, setIsEmailValid] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, // Note: use android debug id for dev and android release id for prod.
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });

    useEffect(() => {
        if (request) {
            console.log("Signup Redirect URI:", request.redirectUri);
        }
    }, [request]);

    // Handle Google Sign-In response
    useEffect(() => {
        if (response?.type === "success") {
            const { idToken } = response.params;

            if (!idToken) {
                console.error("No ID token found in response params!", response);
                // Fallback to authentication object if params doesn't have it
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

    const signInWithGoogle = async (idToken: string) => {
        try {
            showLoader();
            setIsLoading(true);
            const res = await api.post("/api/user/auth/google-login", { idToken });

            // Save the JWT access token
            if (!res.data?.accessToken) {
                throw new Error("No access token from server");
            }

            const userData = res.data.user || { id: res.data.userId, email: res.data.email };
            await login(userData, res.data.accessToken, res.data.refreshToken);
            router.replace("/(tabs)/HomeScreen");

        } catch (err: any) {
            console.error("Backend Google Login Error:", err);
            Alert.alert("Login Failed", err.response?.data?.error || "An error occurred.");
        } finally {
            hideLoader();
            setIsLoading(false);
        }
    };


    // Google Sign-In
    // const signInWithGoogle = async () => {
    //     setIsLoading(true);
    //     // try {
    //     //     await GoogleSignin.hasPlayServices();
    //     //     const userInfo = await GoogleSignin.signIn();
    //     //     const idToken = userInfo.data?.idToken;

    //     //     if (idToken) {
    //     //         api.post('/api/user/auth/google-login', { idToken })
    //     //             .then(async (res) => {
    //     //                 console.log("Google Signup Backend Success:", res.data);
    //     //                 if (res.data.accessToken) {
    //     //                     await setToken(res.data.accessToken);
    //     //                     router.replace('/(tabs)/HomeScreen');
    //     //                 }
    //     //             })
    //     //             .catch((error) => {
    //     //                 console.error("Google Backend Error:", error, error.response?.data || error.message);
    //     //                 Alert.alert("Google Sign-Up Failed", "Could not verify with server.");
    //     //             })
    //     //             .finally(() => setIsLoading(false));
    //     //     } else {
    //     //         Alert.alert("Error", "No ID token received from Google");
    //     //         setIsLoading(false);
    //     //     }
    //     // } catch (error: any) {
    //     //     console.error("Google Sign-In Error", error);
    //     //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     //         // user cancelled the login flow
    //     //     } else if (error.code === statusCodes.IN_PROGRESS) {
    //     //         // operation (e.g. sign in) is in progress already
    //     //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     //         // play services not available or outdated
    //     //         Alert.alert("Error", "Google Play Services not available");
    //     //     } else {
    //     //         // some other error happened
    //     //         Alert.alert("Error", "An unexpected error occurred during Google Sign-In");
    //     //     }
    //     //     setIsLoading(false);
    //     // }
    // };

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
            Alert.alert("Signup Failed", error.response?.data?.error || "An error occurred. Please try again.");
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
                                    editable={!isLoading}
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
                            <Text style={styles.separatorText}>or</Text>
                            <View style={styles.separatorLine} />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={() => promptAsync()}
                            disabled={isLoading}
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
        fontSize: 12,
        fontFamily: "BrittiRegular",
        fontWeight: 400,
        color: '#080808',
    },
    textContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: "#080808",
        marginBottom: 8,
        alignSelf: "flex-start",
        fontFamily: "BrittiBold",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "BrittiRegular",
        color: "#393939",
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 400,
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
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: "transparent",
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: 400,
        fontFamily: "BrittiRegular",
        color: "#080808",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        fontFamily: "BrittiRegular",
        marginTop: 4,
        textAlign: "right",
    },
    createButton: {
        backgroundColor: "#080808",
        height: 50,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: "#CECECE",
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "BrittiBold",
    },
    separatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
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
        fontWeight: 400,
        fontFamily: "BrittiRegular",
    },
    termsText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "BrittiRegular",
        color: "#6B6B6B",
        textAlign: "center",
        marginTop: 24,
        lineHeight: 18,
    },
    termsHighlight: {
        color: "#080808",
        fontWeight: 600,
    },
    footerLink: {
        marginTop: 32,
        alignItems: "center",
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "BrittiRegular",
        color: "#393939",
    },
    footerHighlight: {
        color: "#080808",
        fontWeight: 400,
        textDecorationLine: "underline",
    },
});
