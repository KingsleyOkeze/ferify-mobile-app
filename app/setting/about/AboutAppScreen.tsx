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

function AboutAppScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Ferify</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Center Info */}
                <View style={styles.centerInfo}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>F</Text>
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
                            Ferify is a community-driven platform that helps daily commuters
                            find reliable transport fares and route information.
                            By sharing and verifying fares, we make commuting transparent
                            and predictable for everyone.
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    centerInfo: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    versionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    buildText: {
        fontSize: 14,
        color: '#999',
    },
    explanationSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    detailsBox: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 20,
    },
    detailsText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
    },
});

export default AboutAppScreen;
