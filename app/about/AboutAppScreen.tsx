import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function AboutAppScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Ferify</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#080808" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Center Info */}
                <View style={styles.centerInfo}>
                    <View style={styles.logoPlaceholder}>
                        <Image 
                            source={require('../../assets/images/logo/WHITE-LOGO.png')}
                            style={styles.logo}
                        />
                    </View>
                    <Text style={styles.appName}>Ferify</Text>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                    <Text style={styles.buildText}>Build 2026.02.1</Text>
                </View>

                {/* Explanation Section */}
                <View style={styles.explanationSection}>
                    <Text style={styles.sectionTitle}>What is Ferify</Text>
                    <View style={styles.detailsBox}>
                        <Text style={styles.detailsText}>
                            Ferify is a community-powered transport fare checker
                            for everyday Nigerians. We help you find accurate bus,
                            keke, and okada fares, preventing overcharging and helping 
                            you plan your transport budget with confidence.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    headerButton: {
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    centerInfo: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DADADA",
        paddingVertical: 20,
        height: 213,
        marginHorizontal: 20    
    },
    logoPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 90,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 27.94,
        height: 32,
        fontSize: 40,
        fontWeight: 'bold',
    },
    appName: {
        fontSize: 24,
        fontFamily: 'BrittiBold',
        color: '#080808',
        marginBottom: 20,
        lineHeight: 24
    },
    versionText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 8,
        fontWeight: 400,
        lineHeight: 24
    },
    buildText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        lineHeight: 24
    },
    explanationSection: {
        paddingHorizontal: 20,
        fontSize: 14,
        fontWeight: 400,
        color: '#080808'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 12,
        lineHeight: 19.2
    },
    detailsBox: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 12,
    },
    detailsText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        lineHeight: 24,
        fontWeight: 400,
    },
});

export default AboutAppScreen;
