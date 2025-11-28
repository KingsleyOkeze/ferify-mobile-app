import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FirstNameStep() {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#777" />
                <TextInput 
                    placeholder="Enter first name" 
                    style={styles.input} 
                    placeholderTextColor={"#7E848E"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 83,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 10,
        color: "#080808"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        height: 48
    }
});
