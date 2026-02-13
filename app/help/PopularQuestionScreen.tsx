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
            title: 'How do I reset my password?',
            answer: 'To reset your password, go to the login screen and tap on "Forgot Password". Follow the instructions sent to your email to create a new password.',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
        {
            id: '2',
            title: 'How to change email address?',
            answer: 'You can change your email address in the Account Settings. Go to Settings > Account > Email and follow the verification steps.',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
        {
            id: '3',
            title: 'Is my payment information safe?',
            answer: 'Yes, we use industry-standard encryption to protect your payment information. We do not store your full credit card details on our servers.',
            onPress: (item: any) => router.push({ pathname: '/help/AnswerToQuestionScreen', params: { title: item.title, answer: item.answer } })
        },
        {
            id: '4',
            title: 'Cannot connect to server',
            answer: 'Please check your internet connection. If the problem persists, try restarting the app or contact support if you continue to experience issues.',
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
                            <Text style={styles.itemTitle}>{item.title}</Text>
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
        paddingBottom: 30,
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
    },
});

export default PopularQuestionScreen;
