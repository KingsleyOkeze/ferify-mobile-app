import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function YouAreIn() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>You're In 🎉</Text>
            <Text style={styles.subtitle}>Welcome to Ferify — you can now explore fares and share your trips.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 12,
        textAlign: "center",
        color: "#111",
    },
    subtitle: {
        color: "#666",
        textAlign: "center",
        fontSize: 16,
    },
});
