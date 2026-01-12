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

function SavedRoutesScreen() {
    const router = useRouter();

    // Mock state for saved addresses
    const [homeAddress, setHomeAddress] = React.useState('123 Main Street, Lagos'); // Example address
    const [workAddress, setWorkAddress] = React.useState(''); // Empty by default

    const menuItems = [
        {
            id: 'home',
            title: 'Add home',
            address: homeAddress,
            icon: 'home-outline',
            onPress: () => { router.push({ pathname: '/setting/account/AddRouteScreen', params: { type: 'home' } }) },
        },
        {
            id: 'work',
            title: 'Add work',
            address: workAddress,
            icon: 'briefcase-outline',
            onPress: () => { router.push({ pathname: '/setting/account/AddRouteScreen', params: { type: 'work' } }) },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved routes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons name={item.icon as any} size={22} color="#333" style={styles.itemIcon} />
                                <View>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    {item.address ? (
                                        <Text style={styles.itemAddress}>{item.address}</Text>
                                    ) : null}
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
        padding: 4,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
        // paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIcon: {
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    itemAddress: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});

export default SavedRoutesScreen;
