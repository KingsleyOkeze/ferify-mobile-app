import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function AboutHowItWorksScreen() {
    const router = useRouter();

    const steps = [
        {
            id: '1',
            title: 'Search & Discover',
            description: 'Find routes, check estimated fares, and see what others are paying in real-time.',
        },
        {
            id: '2',
            title: 'Contribute Fares',
            description: 'Share your own commute costs to help the community stay updated on price changes.',
        },
        {
            id: '3',
            title: 'Earn & Level Up',
            description: 'Get recognized as a trusted contributor and earn badges for helping others.',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>How it work</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <Text style={styles.pageTitle}>How Ferify work</Text>

                    {steps.map((step) => (
                        <View key={step.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{step.title}</Text>
                            <Text style={styles.cardDescription}>{step.description}</Text>
                        </View>
                    ))}
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginTop: 20,
        marginBottom: 25,
    },
    card: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F3F3',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 20,
    },
});

export default AboutHowItWorksScreen;
