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

function AboutMainScreen() {
    const router = useRouter();

    const aboutItems = [
        {
            id: 'what',
            title: 'What is Ferify',
            onPress: () => { router.push('./AboutAppScreen') }, // Placeholder for navigation
        },
        {
            id: 'how',
            title: 'How it work',
            onPress: () => { router.push('./AboutHowItWorksScreen') }, // Placeholder for navigation
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons 
                        name="arrow-back" 
                        size={14} 
                        color="#080808" 
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Ferify</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Options List */}
                <View style={styles.listContainer}>
                    {aboutItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.listItem,
                                // index === 0 && styles.firstListItem
                            ]}
                            onPress={item.onPress}
                        >
                            <Text style={styles.itemTitle}>{item.title}</Text>

                            {/* Arrow without tail: Chevron Forward */}
                            <Ionicons name="chevron-forward" size={16} color="#080808" />
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
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontFamily: 'Britti Sans Trial',
        fontSize: 24, 
        fontWeight: 600,
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        // paddingHorizontal: 20, 
        backgroundColor: '#DADADA',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        color: '#080808',
        height: 64,
    },
    // firstListItem: {
    //     borderTopWidth: 1,
    //     borderTopColor: '#DADADA',
    // },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});

export default AboutMainScreen;
