import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LastNameStep() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>Last Name</Text>

            <View style={styles.inputRow}>
                <View style={styles.iconBox}>
                    <Ionicons name="person-outline" size={20} color="#666" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    placeholderTextColor="#9a9a9a"
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
        marginBottom: 12,
        color: "#111",
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
