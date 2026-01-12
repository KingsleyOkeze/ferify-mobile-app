import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RouteFromAndToProps {
    from: string;
    to: string;
}

const RouteFromAndTo: React.FC<RouteFromAndToProps> = ({ from, to }) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <Text style={styles.locationText}>{from}</Text>

                <View style={styles.separatorContainer}>
                    <View style={styles.dot} />
                    <View style={styles.line} />
                    <Ionicons name="caret-forward" size={12} color="#fff" style={styles.arrowIcon} />
                </View>

                <Text style={styles.locationText}>{to}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        marginRight: 4,
    },
    line: {
        width: 15,
        height: 1,
        backgroundColor: '#FFFFFF',
        marginRight: 0,
    },
    arrowIcon: {
        marginLeft: -4,
    }
});

export default RouteFromAndTo;
