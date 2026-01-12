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

function SettingMainScreen() {
    const router = useRouter();

    const settingsItems = [
        {
            id: 'appearance',
            title: 'App appearance',
            description: 'Dark mode, light mode, system default',
            icon: 'moon-outline',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your notification preferences',
            icon: 'notifications-outline',
        },
        {
            id: 'privacy',
            title: 'Privacy & safety',
            description: 'Control who sees what',
            icon: 'lock-closed-outline',
        },
        {
            id: 'logout',
            title: 'Logout',
            description: 'Sign out of your account',
            icon: 'log-out-outline',
            isDestructive: true,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Settings List */}
                <View style={styles.listContainer}>
                    {settingsItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.listItem,
                                index === 0 && styles.firstListItem // Border top for first item
                            ]}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={24}
                                    color={item.isDestructive ? 'red' : '#333'}
                                    style={styles.itemIcon}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={[
                                        styles.itemTitle,
                                        item.isDestructive && styles.destructiveText
                                    ]}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        // paddingHorizontal: 20, // Optional: keeping it flush or padded
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
    destructiveText: {
        color: 'red',
    },
});

export default SettingMainScreen;
