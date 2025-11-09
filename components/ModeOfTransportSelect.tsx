import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import okadaImage from '../assets/images/okadaImage.png';
import kekeImage from '../assets/images/kekeImage.png';
import busImage from '../assets/images/busImage.png'; // You can change if bus has a unique image

function ModeOfTransportSelect() {
    const transportModes = [
        { id: 1, name: 'Bus', image: busImage },
        { id: 2, name: 'Keke', image: kekeImage },
        { id: 3, name: 'Okada', image: okadaImage },
    ];

    return (
        <View style={styles.container}>
            {transportModes.map((mode) => (
                <View key={mode.id} style={styles.card}>
                    <Image source={mode.image} style={styles.image} />
                    <Text style={styles.text}>{mode.name}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 16,
        backgroundColor: '#FFFFFF',
    },
    card: {
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 18,
        // padding: 10,
        // elevation: 1, // Android shadow
        // shadowColor: '#000', // iOS shadow
        // shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: 108,
        height: 129
    },
    image: {
        width: '100%',
        height: 86,
        borderRadius: 8,
    },
    text: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ModeOfTransportSelect;
