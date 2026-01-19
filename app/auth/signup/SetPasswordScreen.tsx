import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import api, { setToken } from "@/services/api";

export default function SetPasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSetPassword = async () => {
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await api.post("/api/user/auth/register/complete", {
                email: email,
                confirmPassword: password
            });

            console.log("Account created:", response.data);

            if (response.data.accessToken) {
                await setToken(response.data.accessToken);
                // Navigate to Profile Setup or Home (PersonalInfoScreen)
                router.replace("/auth/signup/PersonalInfoScreen");
            } else {
                Alert.alert("Success", "Account created, please sign in.");
                router.replace("/auth/login/LoginScreen");
            }

        } catch (error: any) {
            console.error("Set Password Error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "Failed to set password. Please try again.");
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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#080808" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Set your password</Text>
                        <Text style={styles.subtitle}>
                            Create a secure password for your account associated with {email}.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.inputWrapper, error && styles.inputError]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor="#9a9a9a"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!isLoading}
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
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={[styles.inputWrapper, error && styles.inputError]}>
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
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                (isLoading || password.length < 8) && styles.disabledButton
                            ]}
                            onPress={handleSetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Complete Registration</Text>
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
        backgroundColor: "#fff",
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    header: {
        marginBottom: 20,
        marginLeft: -10,
    },
    backButton: {
        padding: 10,
    },
    textContainer: {
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
    inputError: {
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
        marginLeft: 4,
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
