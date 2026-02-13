import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import TrustAndReputationIcon from '../../assets/images/my-contributions-icons/trust-and-reputation-icons/trust_and_reputation_icon.png';

function TrustAndReputationScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [trustScore, setTrustScore] = useState(0);

    const loadCachedData = async () => {
        try {
            const cached = await AsyncStorage.getItem('user_trust_overview');
            if (cached) {
                const parsed = JSON.parse(cached);
                setTrustScore(parsed.trustScore || 0);
            }
        } catch (e) {
            console.error('Error loading cached trust data:', e);
        }
    };

    const fetchTrustData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/user/contribution/trust');
            if (response.data) {
                setTrustScore(response.data.trustScore);
                await AsyncStorage.setItem('user_trust_overview', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Error fetching trust data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCachedData();
            fetchTrustData();
        }, [])
    );

    const factors = [
        {
            id: 'verified',
            text: 'Contribution verified by others',
            image: require('../../assets/images/my-contributions-icons/trust-and-reputation-icons/contribution_icon.png'),
        },
        {
            id: 'accuracy',
            text: 'Consistent fare accuracy',
            image: require('../../assets/images/my-contributions-icons/trust-and-reputation-icons/contribution_icon.png'),  
        },
        {
            id: 'rejected',
            text: 'Recent rejected updates',
            image: require('../../assets/images/my-contributions-icons/trust-and-reputation-icons/recent_rejected_icon.png'),  
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
                <Text style={styles.headerSubtitle}>Your reliability helps keep Ferify accurate</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTrustData} />}
            >
                {/* Score Section */}
                <View style={styles.scoreContainer}>
                    <View style={styles.scoreIconContainer}>
                        <Image source={TrustAndReputationIcon} style={styles.scoreIcon} />
                    </View>
                    <Text style={styles.scoreLabel}>TRUST SCORE</Text>
                    <Text style={styles.scoreValue}>{trustScore}%</Text>
                    <Text style={styles.scoreDescription}>
                        Based on community verification and{'\n'}consistency of your data.
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
                                    // index === 0 && styles.firstListItem
                                ]}
                            >
                                <Image source={item.image} style={styles.itemIcon} />
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
        backgroundColor: "#FBFBFB",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
        fontFamily: 'BrittiSemibold',
        marginBottom: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    scoreContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 40,
        // borderBottomWidth: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DADADA',
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
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
    scoreIcon: {
        width: 54,
        height: 54,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 12,
    },
    scoreDescription: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        lineHeight: 20
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 16,
    },
    factorsList: {
        // Container for list items
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#F3F3F3',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3',
        borderRadius: 8,
        height: 60,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    // firstListItem: {
    //     borderTopWidth: 1,
    //     borderTopColor: '#F0F0F0',
    // },
    itemIcon: {
        marginRight: 16,
        borderRadius: 50,
        width: 32,
        height: 32
    },
    itemText: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        flex: 1,
    },
});

export default TrustAndReputationScreen;
