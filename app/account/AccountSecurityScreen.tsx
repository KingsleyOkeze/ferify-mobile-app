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

function AccountSecurityScreen() {
    const router = useRouter();

    const menuItems = [
        {
            id: 'password',
            title: 'Change password',
            image: require('../../assets/images/settings-icons/change_password_icon.png'),
            onPress: () => { router.push('../setting/PasswordResetScreen') },
        },
        {
            id: 'devices',
            title: 'Devices',
            image: require('../../assets/images/settings-icons/device_icon.png'),
            onPress: () => { },
            disabled: true,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem,
                            ]}
                            onPress={item.onPress}
                            disabled={item.disabled}
                            activeOpacity={item.disabled ? 1 : 0.7}
                        >
                            <View style={styles.itemLeft}>
                                <Image source={item.image} style={styles.itemIcon} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </View>
                            {/* Arrow without tail: Chevron Forward */}
                            <Ionicons name="chevron-forward" size={20} color="#080808" />
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
        paddingTop: 8,
        paddingBottom: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 72.29
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
        width: 34.29,
        height: 34.29
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});

export default AccountSecurityScreen;
