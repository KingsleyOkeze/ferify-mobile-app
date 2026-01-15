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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Logo
import LOGO from "@/assets/images/logo/BLACK-LOGO.png";

// Steps (Internal or separate)
// For now, I'll keep the multi-step logic but redesign the first screen completely
// We will need to transition to other steps like Name, Verify OTP, etc.

export default function SignUpScreen() {
    const router = useRouter();
    const [step, setStep] = useState<number>(0);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);

    // Validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email.trim()));
    }, [email]);

    useEffect(() => {
        if (password.length > 0 && password.length < 8) {
            setPasswordError("Min. 8 characters");
        } else {
            setPasswordError("");
        }
    }, [password]);

    const isFirstStepValid = isEmailValid && password.length >= 8;

    const handleCreateAccount = () => {
        if (isFirstStepValid) {
            // Move to next step (Names)
            setStep(1);
        }
    };

    if (step === 0) {
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
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Choose a password</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    passwordError ? styles.inputErrorBorder : null
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Min. 8 characters"
                                        placeholderTextColor="#9a9a9a"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {passwordError ? (
                                    <Text style={styles.errorText}>{passwordError}</Text>
                                ) : null}
                            </View>

                            {/* Create Account Button */}
                            <TouchableOpacity
                                style={[
                                    styles.createButton,
                                    !isFirstStepValid && styles.disabledButton
                                ]}
                                onPress={handleCreateAccount}
                                disabled={!isFirstStepValid}
                            >
                                <Text style={styles.createButtonText}>Create account</Text>
                            </TouchableOpacity>

                            {/* Forgot Password */}
                            <TouchableOpacity style={styles.forgotPasswordContainer}>
                                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                            </TouchableOpacity>

                            {/* Or Separator */}
                            <View style={styles.separatorContainer}>
                                <View style={styles.separatorLine} />
                                <Text style={styles.separatorText}>or</Text>
                                <View style={styles.separatorLine} />
                            </View>

                            {/* Google Button */}
                            <TouchableOpacity style={styles.googleButton}>
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

    // Default return for other steps (to be updated)
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => setStep(0)}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={20} color="#61656C" />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Step {step} placeholder</Text>
                <TouchableOpacity onPress={() => setStep(0)}>
                    <Text style={{ color: "blue", marginTop: 20 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#61656C",
        fontWeight: "600"
    },
});
