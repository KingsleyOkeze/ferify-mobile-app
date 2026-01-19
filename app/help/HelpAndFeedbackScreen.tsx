import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function HelpCenterScreen() {
    const router = useRouter();

    const helpItems = [
        {
            id: 'contact',
            title: 'Contact Support',
            description: 'support@ferify.com',
            image: require('../../assets/images/help-icons/customer_support_icon.png'),
            hasArrow: false,
            onPress: () => { /* Handle email intent? */ }
        },
        {
            id: 'feedback',
            title: 'Share your thought',
            description: null,
            image: require('../../assets/images/help-icons/share_your_thought_icon.png'),
            hasArrow: true,
            onPress: () => router.push('./SubmitFeedbackScreen')
        },
        {
            id: 'faq',
            title: 'Popular question',
            description: null,
            image: require('../../assets/images/help-icons/popular_questions_icon.png'),
            hasArrow: true,
            onPress: () => router.push('./PopularQuestionScreen')
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Feedback</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.listContainer}>
                    {helpItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.listItem}
                            onPress={item.onPress}
                            disabled={!item.hasArrow && !item.onPress}
                        >
                            <View style={styles.listItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Image source={item.image} style={styles.icon}/>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    {item.description && (
                                        <Text style={styles.itemDescription}>{item.description}</Text>
                                    )}
                                </View>
                            </View>

                            {item.hasArrow && (
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            )}
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
        paddingBottom: 30, // Space below title
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16, // Space between back arrow and title
    },
    headerTitle: {
        fontSize: 28, // Prominent title
        fontWeight: '700',
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
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        width: 36,
        height: 36,
    },
    textContainer: {
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#080808',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default HelpCenterScreen;
