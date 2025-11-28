import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function VerifyEmailStep() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
                We just sent a 5-digit code to your email. Enter it below to verify.
            </Text>

            <View style={styles.otpRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <TextInput
                        key={i}
                        style={styles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        textContentType="oneTimeCode"
                    />
                ))}
            </View>

            <View style={styles.resendRow}>
                <TouchableOpacity>
                    <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111",
        marginBottom: 8,
    },
    subtitle: {
        color: "#61656C",
        marginBottom: 20,
        lineHeight: 20,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    otpBox: {
        width: 52,
        height: 52,
        borderRadius: 10,
        backgroundColor: "#F6F6F6",
        textAlign: "center",
        fontSize: 18,
        color: "#000",
    },
    resendRow: {
        marginTop: 12,
        alignItems: "flex-end",
    },
    resendText: {
        color: "#080808",
        fontWeight: "600",
    },
});
