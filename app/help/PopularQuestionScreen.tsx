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

function PopularQuestionScreen() {
    const router = useRouter();

    const questions = [
        {
            id: '1',
            title: 'How do I report fares?',
            subtitle: 'Get started',
            answer: 'To report a fare, simply search for your route or select one from the Home screen. Once you\'re on the Route details, tap the "Share Fare" button and enter the amount you paid. This helps others know the current market price!',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
        {
            id: '2',
            title: 'Why are some routes missing?',
            subtitle: 'Routes',
            answer: 'Our database relies on commuter contributions. If you can\'t find a specific route, you can be the first to add it! Just use the "Share Fare" feature and enter the new route details to make it available for everyone else.',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
        {
            id: '3',
            title: 'How do I earn points?',
            subtitle: 'Points & rewards',
            answer: 'You earn points (Ferify Points) for every fare you report and for every existing fare you verify. As your points grow, you\'ll unlock exclusive badges and move up the community leaderboards!',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Popular question</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.listContainer}>
                    {questions.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.listItem}
                            onPress={() => item.onPress(item)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4,
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        lineHeight: 24
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        flex: 1, // Ensure text takes available space
        marginRight: 16,
        lineHeight: 24
    },
    itemSubtitle: {
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24,
        fontSize: 14
    }
});

export default PopularQuestionScreen;
