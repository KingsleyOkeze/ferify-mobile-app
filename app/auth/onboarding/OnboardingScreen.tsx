import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { fetchAndCacheLocation } from "@/services/locationService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from "@/constants/storage";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: 0,
        title1: "Step out ready and",
        title2: "prepared, every",
        title3: "single day",
        title1Width: '85%',
        title2Width: '75%',
        title3Width: '65%',
        subtitle: "Get fare estimate for every stop your route, so you're never stranded.",
        images: [
            require("../../../assets/images/onboarding/handFareCheckImage.png"),
            require("../../../assets/images/onboarding/busAndConductorImage.png"),
            require("../../../assets/images/onboarding/busConductorWordsImage.png"),
            require("../../../assets/images/onboarding/baricadeImage.png"),
        ],
    },
    {
        id: 1,
        title1: "Share the fare, earn",
        title2: "points, and help the",
        title3: "next person",
        title1Width: '95%',
        title2Width: '95%',
        title3Width: '85%',
        subtitle: "Your small update makes transport easier for thousands of others",
        images: require("../../../assets/images/onboarding/rewardImage.png"),
    },
];


const handFareCheckImageStyle: any = {
    width: 255.28,
    height: 334.19,
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: 10,
    top: '97%',
    left: '17.7%',
    transform: [{ translateX: -127 }, { translateY: -167 }]
};

const busAndConductorImageStyle: any = {
    width: 136.17,
    height: 142.5,
    resizeMode: 'contain',
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: [{ translateX: -68 }, { translateY: -71 }]
};

const busConductorWordsImageStyle: any = {
    width: 134.86,
    height: 112.86,
    resizeMode: 'contain',
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -67 }, { translateY: -56 }]
};

const baricadeImageStyle: any = {
    width: 88.57,
    height: 23.74,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: '3.5%',
};

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const next = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        }
    };

    const skip = async () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
            router.push("/auth/signup/SignupScreen");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Right Skip Button */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={skip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageArea}>
                {step === 0 ? (
                    (slides[0].images as any[]).map((img: any, index: number) => (
                        <Image
                            key={index}
                            source={img}
                            style={
                                (index === 0 ? handFareCheckImageStyle :
                                    index === 1 ? busAndConductorImageStyle :
                                        index === 2 ? busConductorWordsImageStyle :
                                            index === 3 ? baricadeImageStyle :
                                                null) as any
                            }
                        />
                    ))
                ) : step === 1 ? (
                    <Image
                        source={slides[1].images as any}
                        style={{
                            width: 296.51,
                            height: 298.04,
                            position: "absolute",
                            top: "66%",
                            left: " 50%",
                            transform: [{ translateX: -98 }, { translateY: -149 }],
                            zIndex: 10,
                        }}
                    />
                ) : null}
            </View>

            <View style={styles.bottomSheet}>
                <View style={styles.dotsRow}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === step ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
                <Text style={[styles.title, { width: (slides[step] as any).title1Width }]}>
                    {slides[step].title1}
                </Text>
                <Text style={[styles.title, { width: (slides[step] as any).title2Width }]}>
                    {slides[step].title2}
                </Text>
                <Text style={[styles.title, { width: (slides[step] as any).title3Width }]}>
                    {slides[step].title3}
                </Text>
                <Text style={styles.subtitle}>
                    {slides[step].subtitle}
                </Text>

                {/* Bottom Buttons Row */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.btn, styles.loginBtn]}
                        onPress={async () => {
                            console.log('Login clicked - triggering location fetch');
                            fetchAndCacheLocation(); // Non-blocking
                            await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
                            router.push("/auth/login/LoginScreen");
                        }}
                    >
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.getStartedBtn]}
                        onPress={async () => {
                            console.log('Get Started clicked - triggering location fetch');
                            fetchAndCacheLocation(); // Non-blocking
                            await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
                            router.push("/auth/signup/SignupScreen");
                        }}
                    >
                        <Text style={styles.getStartedBtnText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        // backgroundColor: 'red'
        position: 'relative'
    },
    topHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingTop: 20,
        zIndex: 10,
    },
    imageArea: {
        flex: 4,
    },
    bottomSheet: {
        flex: 3,
        paddingTop: 30,
        paddingHorizontal: 25,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    dotsRow: {
        flexDirection: "row",
        marginBottom: 25,
        gap: 10,
    },
    dot: {
        height: 6,
        borderRadius: 100,
    },
    activeDot: {
        width: 21,
        backgroundColor: "#080808",
    },
    inactiveDot: {
        width: 6,
        backgroundColor: "#D9D9D9",
    },
    title: {
        fontFamily: "BrittiBold",
        fontSize: 24,
        fontWeight: 700,
        textAlign: "center",
        color: "#080808",
    },
    subtitle: {
        fontFamily: "BrittiRegular",
        fontSize: 16,
        fontWeight: 400,
        width: '95%',
        color: "#757575",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 40,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
        paddingVertical: 10,
        // backgroundColor: 'green',
        position: 'absolute',
        bottom: 0
    },
    btn: {
        flex: 1,
        height: 56,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    loginBtn: {
        backgroundColor: "#F2F2F2",
    },
    getStartedBtn: {
        backgroundColor: "#080808",
    },
    loginBtnText: {
        color: "#080808",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "BrittiBold",
    },
    getStartedBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "BrittiBold",
    },
    skipBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    skipText: {
        color: "#757575",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "BrittiBold",
    },
});
