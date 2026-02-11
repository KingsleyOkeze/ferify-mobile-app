import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RouteFromAndToProps {
    from: string;
    to: string;
}

const RouteFromAndTo: React.FC<RouteFromAndToProps> = ({ from, to }) => {
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
        borderRadius: 100,
        paddingHorizontal: 16,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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
        fontSize: 14,
        fontWeight: '600',

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
    }
});

export default RouteFromAndTo;
