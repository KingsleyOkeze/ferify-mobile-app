import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from "react-native";

const { width } = Dimensions.get("window");



const slides = [
    {
        id: 0,
        title: "Verify Any Fare",
        subtitle: "Check accurate fare estimates before you ever step out.",
        images: [
            require("../../assets/images/onboarding/handFareCheckImage.png"),
            require("../../assets/images/onboarding/busAndConductorImage.png"),
            require("../../assets/images/onboarding/busConductorWordsImage.png"),
            require("../../assets/images/onboarding/baricadeImage.png"),
        ],
    },
    {
        id: 1,
        title: "Know Before You Move",
        subtitle: "Your route, your stops, your price — all in one glance.",
        images: require("../../assets/images/onboarding/phoneMapImage.png"),
        
    },
    {
        id: 2,
        title: "Earn Rewards",
        subtitle: "Get rewarded for submitting accurate fare. Your contributing help others",
        images: require("../../assets/images/onboarding/rewardImage.png"),
    },
];


const handFareCheckImageStyle = {
    width: 255.28, 
    height: 334.19, 
    resizeMode: 'contain', 
    position: 'fixed', 
    zIndex: 10, 
    top: '97%', 
    left: '17.7%', 
    transform: 'translate(-50%, -50%)'
};

const busAndConductorImageStyle = {
    width: 136.17, 
    height: 142.5, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: '75%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)'
};

const busConductorWordsImageStyle = {
    width: 134.86, 
    height: 112.86, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: '35%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)'
};

const baricadeImageStyle = {
    width: 88.57, 
    height: 23.74, 
    resizeMode: 'contain', 
    position: 'absolute', 
    right: 0, 
    bottom: '3.5%', 
};

export default function OnboardingScreen({ navigation }: any) {
    const [step, setStep] = useState(0);

    const next = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            navigation.replace("SignIn");
        }
    };

    const skip = () => {
        navigation.replace("SignIn");
    };

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.imageArea}>
                {
                    step === 0 ?
                        slides[0].images.map((img: any, index: number) => (
                            <Image 
                                key={index}
                                source={img} 
                                style={
                                    index === 0 ? handFareCheckImageStyle:
                                    index === 1 ? busAndConductorImageStyle :
                                    index === 2 ? busConductorWordsImageStyle: 
                                    index === 3 ? baricadeImageStyle  :
                                    null
                                }
                            />
                        ))
                        :
                    step === 1 ?
                        <Image 
                            source={slides[1].images}
                            style={{
                                width: 296.51, 
                                height: 298.04,
                                position: 'absolute',
                                top: '60%', 
                                left:' 50%', 
                                transform: 'translate(-50%, -50%)', 
                            }}
                        />
                        :
                    step === 2 ?
                        <Image 
                            source={slides[2].images}
                            style={{
                                width: 296.51, 
                                height: 298.04,
                                position: 'absolute',
                                top: '66%', 
                                left:' 50%',
                                transform: 'translate(-33%, -50%)', 
                                zIndex: 10
                            }}
                        />
                        :
                    null
                }

            </View>

            <View style={styles.bottomSheet}>
                <View style={styles.dotsRow}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { backgroundColor: i === step ? "#000" : "#D3D3D3" },
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.title}>{slides[step].title}</Text>
                <Text style={styles.subtitle}>{slides[step].subtitle}</Text>

                <TouchableOpacity style={styles.nextBtn} onPress={next}>
                    <Text style={styles.nextBtnText}>
                        {step === slides.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </TouchableOpacity>

                {step < slides.length - 1 && (
                    <TouchableOpacity onPress={skip} style={styles.skipBtn}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: 'relative'
    },
    imageArea: {
        // flex: 3.5,
        flex: 4,
        // justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: 'green',
    },
   
    bottomSheet: {
        flex: 3,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // backgroundColor: "lightgrey",
        paddingTop: 30,
        paddingHorizontal: 25,
        alignItems: "center",
    },
    dotsRow: {
        flexDirection: "row",
        marginBottom: 25,
        gap: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 12,
        color: "#080808",
    },
    subtitle: {
        fontSize: 16,
        color: "#757575",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    nextBtn: {
        width: 241,
        height: 54,
        backgroundColor: "#080808",
        paddingVertical: 14,
        borderRadius: 100,
        alignItems: "center",
        marginBottom: 16,
    },
    nextBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    skipBtn: {
        paddingVertical: 6,
    },
    skipText: {
        color: "#757575",
        fontSize: 15,
        fontWeight: "700",
    },
});
