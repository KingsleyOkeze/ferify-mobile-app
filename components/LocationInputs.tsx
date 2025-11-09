import React from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';
import routeImage from "../assets/images/routeImage.png";
import fareContributionRouteImage from "../assets/images/fareContributionRouteImage.png"

function LocationInputs () {
    return (
        <View style={styles.container}>
            <Image
                source={routeImage}
                style={styles.icon}
            />
            {/* <Image
                source={fareContributionRouteImage}
                style={styles.icon}
            /> */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="From where?"
                    style={styles.input}
                    placeholderTextColor={"#393939"}
                />
                <TextInput
                    placeholder="To where?"
                    style={styles.input}
                    placeholderTextColor={"#393939"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 10,
        height: 106,
        backgroundColor: "#FFFFFF"
    },
    icon: {
        width: 20,
        height: 77,
        marginRight: 10,
    },
    inputContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    input: {
        borderWidth: 0,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        height: 49,
        backgroundColor: "#F2F3F4",
        fontFamily: "DM Sans",
        fontWeight: 400,
        fontSize: 14

    },
});

export default LocationInputs;
