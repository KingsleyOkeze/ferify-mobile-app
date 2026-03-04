import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

function SplashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    source={require("../../../assets/images/logo/WHITE-LOGO.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.bottomContainer}>
                <Image
                    source={require("../../../assets/images/logo/ferify-text-logo-white-text.png")}
                    style={styles.logoText}
                    resizeMode="contain"
                />
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
        width: 74.5,
        height: 88,
    },
    bottomContainer: {
        paddingBottom: 50,
        alignItems: "center",
    },
    logoText: {
        width: 74.55,
        height: 29.66,
    },
});

export default SplashScreen;
