import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const LocationList = () => {
    const listData = [
        { id: 1, name: 'Add Home', icon: 'home-outline', bgColor: '#21A351' },
        { id: 2, name: 'Add Work', icon: 'briefcase-outline', bgColor: '#21A351' },
        { id: 3, name: 'Saved Routes', icon: 'bookmark-outline', bgColor: '#21A351' },
    ];

    return (
        <View style={styles.container}>
            {listData.map((item) => (
                <View key={item.id} style={styles.listItem}>
                    <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                        <Ionicons name={item.icon} size={20} color="#fff" />
                    </View>
                    <Text style={styles.text}>{item.name}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        backgroundColor: "#FFFFFF",
        height: 151
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: '#eee',
        // height: 37
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: 600,
        color: '#080808',
    },
});

export default LocationList;
