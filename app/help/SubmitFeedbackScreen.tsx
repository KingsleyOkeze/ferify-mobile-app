import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';

function SubmitFeedbackScreen() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            showToast('general', 'Please fill in both subject and message.');
            return;
        }

        showLoader();
        try {
            const response = await api.post('/api/user/account/feedback', {
                subject: subject.trim(),
                message: message.trim()
            });

            const remainingSubmissions = response.data.remainingSubmissions;
            const quotaMessage = remainingSubmissions > 0
                ? `\n\nYou have ${remainingSubmissions} feedback submission${remainingSubmissions === 1 ? '' : 's'} remaining today.`
                : "\n\nYou've used all your feedback submissions for today.";

            showToast('success', 'Your feedback has been sent successfully!' + quotaMessage);
            router.back();
        } catch (error: any) {
            console.error(error);

            // Handle rate limiting
            if (error.response?.status === 429) {
                showToast('error', error.response?.data?.message || "You've reached your daily feedback limit. Please try again in 24 hours.");
            } else {
                const errorMessage = error.response?.data?.error || "Failed to send feedback. Please try again.";
                showToast('error', errorMessage);
            }
        } finally {
            hideLoader();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Feedback</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.description}>
                        We value your feedback. Let us know what you think or report a problem.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Subject</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Bug report, Feature request"
                            placeholderTextColor="#999"
                            value={subject}
                            onChangeText={setSubject}
                            maxLength={200}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your issue or suggestion..."
                            placeholderTextColor="#999"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            textAlignVertical="top"
                            maxLength={2000}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit Feedback</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        // paddingBottom: 8,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    description: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        marginBottom: 32,
        lineHeight: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12, // Consistent padding
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        lineHeight: 24,
    },
    textArea: {
        height: 150,
        paddingTop: 14,
    },
    submitButton: {
        backgroundColor: '#080808',
        borderRadius: 100, // Pill shape
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.2,
        // shadowRadius: 8,
        // elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#666',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
    },
});

export default SubmitFeedbackScreen;
