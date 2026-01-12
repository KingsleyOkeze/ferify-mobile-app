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

function TrustAndReputationScreen() {
    const router = useRouter();

    const factors = [
        {
            id: 'verified',
            text: 'Contribution verified by other',
            icon: 'checkmark-circle-outline',
            color: '#2E7D32', // Green
        },
        {
            id: 'accuracy',
            text: 'Consistent fare accuracy',
            icon: 'location-outline',
            color: '#1565C0', // Blue
        },
        {
            id: 'rejected',
            text: 'Recent rejected updated',
            icon: 'close-circle-outline',
            color: '#C62828', // Red
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trust & Reputation</Text>
                <Text style={styles.headerSubtitle}>See your standing in the community</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Score Section */}
                <View style={styles.scoreContainer}>
                    <View style={styles.scoreIconContainer}>
                        <Ionicons name="medal-outline" size={40} color="#FBC02D" />
                    </View>
                    <Text style={styles.scoreLabel}>Trust score</Text>
                    <Text style={styles.scoreValue}>24%</Text>
                    <Text style={styles.scoreDescription}>
                        Your trust score helps others know how{'\n'}reliable your contributions are.
                    </Text>
                </View>

                {/* Factors List */}
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>What affect your trust</Text>

                    <View style={styles.factorsList}>
                        {factors.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.listItem,
                                    index === 0 && styles.firstListItem
                                ]}
                            >
                                <Ionicons name={item.icon as any} size={24} color={item.color} style={styles.itemIcon} />
                                <Text style={styles.itemText}>{item.text}</Text>
                            </View>
                        ))}
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    scoreContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 30,
    },
    scoreIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF9C4', // Light Yellow bg for medal
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    scoreDescription: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    factorsList: {
        // Container for list items
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemIcon: {
        marginRight: 16,
    },
    itemText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
});

export default TrustAndReputationScreen;
