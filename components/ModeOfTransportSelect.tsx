import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import okadaImage from '../assets/images/transportation-icons/okadaImage.png';
import kekeImage from '../assets/images/transportation-icons/kekeImage.png';
import busImage from '../assets/images/transportation-icons/busImage.png';

interface ModeOfTransportSelectProps {
    selectedMode?: string | null;
    onSelect?: (mode: string | null) => void;
}

function ModeOfTransportSelect({ selectedMode, onSelect }: ModeOfTransportSelectProps) {
    const transportModes = [
        { id: 'bus', name: 'Bus', image: busImage },
        { id: 'keke', name: 'Keke', image: kekeImage },
        { id: 'bike', name: 'Okada', image: okadaImage },
    ];

    return (
        <View style={styles.container}>
            {transportModes.map((mode) => (
                <TouchableOpacity
                    key={mode.id}
                    style={[
                        styles.card,
                        selectedMode === mode.id && styles.cardSelected // Apply border if selected
                    ]}
                    onPress={() => {
                        if (onSelect) {
                            onSelect(selectedMode === mode.id ? null : mode.id);
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <Image source={mode.image} style={styles.image} />
                    <Text style={styles.text}>{mode.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '31.5%',
        height: 107.84,
        borderWidth: 1,
        borderColor: 'transparent', // Default transparent border
        paddingVertical: 12,
    },
    cardSelected: {
        borderColor: '#080808', // Black border when selected
    },
    image: {
        width: 50.17,
        height: 44,
        borderRadius: 8,
    },
    text: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'BrittiRegular',
    },
});

export default ModeOfTransportSelect;
