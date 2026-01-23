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

function AccountAndPersonalMainScreen() {
    const router = useRouter();

    const menuItems = [
        {
            id: 'details',
            title: 'Account details',
            description: 'Update name, email, phone',
            image: require('../../assets/images/account-and-personal-icons/account_details_icon.png'),
            onPress: () => { router.push('/account/AccountDetailsScreen') },
        },
        {
            id: 'transport',
            title: 'Transport preference',
            description: 'Manage saved routes and modes',
            image: require('../../assets/images/account-and-personal-icons/transport_preferences_icon.png'),
            onPress: () => { router.push('/account/TransportPreferenceScreen') },
        },
        {
            id: 'privacy',
            title: 'Data & privacy',
            description: 'Control data usage and visibility',
            image: require('../../assets/images/account-and-personal-icons/data_and_privacy_icon.png'),
            onPress: () => { router.push('/account/DataAndPrivacyScreen') },
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Password and authentication',
            image: require('../../assets/images/account-and-personal-icons/account_security_icon.png'),
            onPress: () => { router.push('/account/AccountSecurityScreen') },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account & personal</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                // index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            {/* Arrow without tail: Chevron Forward */}
                            <Ionicons name="chevron-forward" size={16} color="#999" />
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
        paddingTop: 4,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
        // paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    // firstMenuItem: {
    // },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemImage: {
        marginRight: 16,
        width: 36,
        height: 36,
        borderRadius: 56.25
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        color: '#757575',
    },
});

export default AccountAndPersonalMainScreen;
