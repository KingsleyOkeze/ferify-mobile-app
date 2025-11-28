import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PasswordStep() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>Set Password</Text>
            <Text style={styles.subtitle}>Create a secure password to protect your account.</Text>

            <View style={styles.inputRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#9a9a9a"
                    secureTextEntry
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 6,
        color: "#111",
    },
    subtitle: {
        color: "#666",
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 52,
    },
    iconBox: {
        width: 36,
        alignItems: "center",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        marginLeft: 8,
    },
});

