import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Steps
import FirstNameStep from "./steps/FirstNameStep";
import LastNameStep from "./steps/LastNameStep";
import EmailStep from "./steps/EmailStep";
import VerifyEmailStep from "./steps/VerifyEmailStep";
import PasswordStep from "./steps/PasswordStep";
import YouAreIn from "./steps/YouAreIn";

export default function SignUpScreen() {
    const [step, setStep] = useState<number>(0);

    const renderStep = () => {
        switch (step) {
            case 0:
                return <FirstNameStep />;
            case 1:
                return <LastNameStep />;
            case 2:
                return <EmailStep />;
            case 3:
                return <VerifyEmailStep />;
            case 4:
                return <PasswordStep />;
            case 5:
                return <YouAreIn />;
            default:
                return <FirstNameStep />;
        }
    };

    const buttonText = ["Next", "Next", "Next", "Verify", "Create Account", "Continue"];

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <View style={styles.header}>
            {
                // step !== 0 && 
                step !== 5 && (
                <TouchableOpacity
                    onPress={() => setStep((s) => Math.max(0, s - 1))}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={20} color="#61656C" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            )}
            </View>

            {/* Body */}
            <View style={styles.body}>{renderStep()}</View>

            {/* Footer button (hidden on final YouAreIn screen) */}
            {step !== 5 && (
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => setStep((s) => Math.min(5, s + 1))}
                >
                    <Text style={styles.footerButtonText}>{buttonText[step]}</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        height: 50,
        position: 'relative',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 71,
        height: 36,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        position: 'absolute',
        bottom: 1,
        left: 16
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#61656C",
        fontWeight: 600
    },
   
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    footerButton: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: "#080808",
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: "center",
    },
    footerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
