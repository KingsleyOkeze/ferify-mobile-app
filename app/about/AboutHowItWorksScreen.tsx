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
            title: 'Search your route',
            description: "Enter where you're going from and to.",
        },
        {
            id: '2',
            title: 'See real fares',
            description: 'View community verified fare ranges.',
        },
        {
            id: '3',
            title: 'Contribute & earn',
            description: 'Confirm fares & earn points.',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>How it works</Text>
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
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    contentContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 24,
        lineHeight: 19.2
    },
    card: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F3F3F3',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 2,
        lineHeight: 24
    },
    cardDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24,
    },
});

export default AboutHowItWorksScreen;
