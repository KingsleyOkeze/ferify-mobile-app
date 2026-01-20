import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

function SplashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Logo in the middle */}
            <View style={styles.centerContainer}>
                <Image
                    source={require("../../../assets/images/logo/WHITE-LOGO.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* Text at the bottom */}
            <View style={styles.bottomContainer}>
                <Text style={styles.logoText}>ferify</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoImage: {
        width: 120,
        height: 120,
    },
    bottomContainer: {
        paddingBottom: 50,
        alignItems: "center",
    },
    logoText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 1.5,
        textTransform: "lowercase",
    },
});

export default SplashScreen;
