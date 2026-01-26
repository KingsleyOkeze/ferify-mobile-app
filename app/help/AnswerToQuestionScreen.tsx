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
import { useRouter, useLocalSearchParams } from 'expo-router';

function AnswerToQuestionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { title, answer } = params;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonLeft}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Popular question</Text>

                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButtonRight}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Question Title */}
                <Text style={styles.questionTitle}>
                    {title || "Question Title"}
                </Text>

                {/* Answer Box */}
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>
                        {answer || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB', // White/Off-white background for screen
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content (Title)
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        position: 'relative', // For absolute positioning of buttons
    },
    headerButtonLeft: {
        position: 'absolute',
        left: 20,
        top: 10,
        padding: 4,
        zIndex: 1,
    },
    headerButtonRight: {
        position: 'absolute',
        right: 20,
        top: 10,
        padding: 4,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    scrollContent: {
        padding: 24,
    },
    questionTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 24,
        lineHeight: 32,
    },
    answerContainer: {
        backgroundColor: '#F3F3F3', // Light grey type background as requested
        borderRadius: 8,
        padding: 12,
    },
    answerText: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#333',
        lineHeight: 24,
    },
});

export default AnswerToQuestionScreen;
