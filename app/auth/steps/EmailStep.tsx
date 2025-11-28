import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EmailStep() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>Enter your email</Text>

            <View style={styles.inputRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="example@gmail.com"
                    placeholderTextColor="#9a9a9a"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
        fontWeight: "500",
        marginBottom: 12,
        color: "#080808",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EBEDEF",
        borderRadius: 100,
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
