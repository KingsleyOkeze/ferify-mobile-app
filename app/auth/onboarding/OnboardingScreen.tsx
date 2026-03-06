import { useState, useEffect } from "react";
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
        title: "Step out ready and prepared, every single day.",
        title1: "Step out ready and",
        title2: "prepared, every",
        title3: "single day.",
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
        title: "Share the fare, earn points, and help the next person.",
        title1: "Share the fare, earn",
        title2: "points, and help the",
        title3: "next person.",
        title1Width: '95%',
        title2Width: '95%',
        title3Width: '85%',
        subtitle: "Your small update makes transport easier for thousands of others",
        images: require("../../../assets/images/onboarding/rewardImage.png"),
    },
];


const handFareCheckImageStyle: any = {
    width: 228.82,
    height: 299.54,
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: 10,
    top: '95%',
    left: '17.7%',
    transform: [{ translateX: -127 }, { translateY: -147 }]
};

const busAndConductorImageStyle: any = {
    width: 110.18,
    height: 115.3,
    resizeMode: 'contain',
    position: 'absolute',
    top: '75%',
    left: '61%',
    transform: [{ translateX: -68 }, { translateY: -51 }]
};

const busConductorWordsImageStyle: any = {
    width: 122.91,
    height: 102.86,
    resizeMode: 'contain',
    position: 'absolute',
    top: '36%',
    left: '57%',
    transform: [{ translateX: -67 }, { translateY: -56 }]
};

const baricadeImageStyle: any = {
    width: 88.57,
    height: 23.74,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: '2%',
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

    // Automatic carousel progression
    useEffect(() => {
        // const timer = setInterval(() => {
        //     setStep(prev => (prev + 1) % slides.length);
        // }, 5000); // 5 seconds per slide
        // return () => clearInterval(timer);
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            {/* Skip button removed */}
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
                            width: 224.9,
                            height: 258.48,
                            position: "absolute",
                            top: "70%",
                            right: "-25%",
                            transform: [{ translateX: -98 }, { translateY: -149 }],
                            zIndex: 10,
                        }}
                    />
                ) : null}
            </View>

            {/* Standalone Content Sections */}
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

            <View style={styles.titleContainer}>
                <Text
                    style={styles.title}>
                    {slides[step].title}
                </Text>
            </View>

            <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>
                    {slides[step].subtitle}
                </Text>
            </View>

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
                    <Text style={styles.loginBtnText}>Log in</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
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
        flex: 1,
        maxHeight: '45%',
    },
    dotsRow: {
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 24,
        gap: 10,
        // backgroundColor: 'purple'
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
    titleContainer: {
        marginBottom: 20,
        alignSelf: 'center',
        maxWidth: 217,
        // height: 87,
        // backgroundColor: 'green'
    },
    title: {
        fontFamily: "BrittiBold",
        fontSize: 24,
        maxWidth: '100%',
        lineHeight: 30,
        textAlign: "center",
        color: "#080808",
    },

    subtitleContainer: {
        alignSelf: 'center',
        // width: '85%',
        marginBottom: 72, // Space between subtitle and buttons
        // backgroundColor: 'red',
        // minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 283,
    },
    subtitle: {
        fontFamily: "BrittiRegular",
        fontSize: 16,
        // width: '95%',
        color: "#757575",
        textAlign: "center",
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: "row",
        width: width - 32,
        alignSelf: 'center',
        gap: 12,
        marginBottom: 40,
        // backgroundColor: 'yellow'
    },
    btn: {
        flex: 1,
        height: 50,
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
        fontFamily: "BrittiBold",
    },
    getStartedBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
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
        fontFamily: "BrittiBold",
    },
});
