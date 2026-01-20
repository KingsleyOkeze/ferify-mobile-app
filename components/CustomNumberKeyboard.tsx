import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomNumberKeyboardProps {
    onPress: (digit: string) => void;
    onDelete: () => void;
}

const { width } = Dimensions.get('window');

const CustomNumberKeyboard: React.FC<CustomNumberKeyboardProps> = ({ onPress, onDelete }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

    return (
        <View style={styles.container}>
            {keys.map((key, index) => {
                if (key === '') return <View key={index} style={styles.key} />;

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.key}
                        onPress={() => (key === 'delete' ? onDelete() : onPress(key))}
                        activeOpacity={0.7}
                    >
                        {key === 'delete' ? (
                            <Ionicons name="backspace-outline" size={28} color="#080808" />
                        ) : (
                            <Text style={styles.keyText}>{key}</Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingHorizontal: 0,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    key: {
        width: width / 3,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 28,
        fontWeight: '500',
        color: '#080808',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
});

export default CustomNumberKeyboard;
