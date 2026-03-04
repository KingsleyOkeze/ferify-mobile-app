import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RouteFromAndToProps {
    from: string;
    to: string;
}

export default function RouteFromAndTo({ from, to }: RouteFromAndToProps) {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <Text
                    style={styles.locationText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {from}
                </Text>
                <View style={styles.separatorContainer}><Image
                    source={require('../assets/images/routes-icons/from_to_icon.png')}
                    style={styles.arrowIcon}
                />
                </View>

                <Text
                    style={styles.locationText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {to}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        borderRadius: 30,
        paddingHorizontal: 20,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    locationText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        lineHeight: 24,
        flex: 1,
        flexShrink: 1,
        textAlign: 'center',
    },
    separatorContainer: {
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowIcon: {
        width: 40,
        height: 1
    }
});

