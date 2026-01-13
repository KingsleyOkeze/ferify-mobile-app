import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SplashScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Ferify</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000", 
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default SplashScreen;
