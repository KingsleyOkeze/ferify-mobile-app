import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ModeOfTransportSelect from '@/components/ModeOfTransportSelect';
import LocationInputs from '@/components/LocationInputs';


function FareContributionScreen() {
    return (
        <View style={styles.container}>
            {/* Header with Back */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={20} color="#61656C" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Scrollable content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Fare Contribution</Text>

                <Text style={styles.sectionTitle}>Enter Route</Text>
                <LocationInputs />

                <Text style={styles.sectionTitle}>Select Mode of Transport</Text>
                <ModeOfTransportSelect />

                <Text style={styles.sectionTitle}>How much did you pay for this trip?</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currency}>₦</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>

                <Text style={styles.sectionTitle}>Date/Time</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#080808" />
                    <TextInput
                        style={styles.input}
                        placeholder="Select date/time"
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        height: 50,
        position: 'relative',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        position: 'absolute',
        bottom: 16,
        marginLeft: 16
    },
    backText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#61656C',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginBottom: 10,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,

    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginTop: 16,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        borderColor: '#F2F3F4',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 45,
        backgroundColor: '#FAFAFA',
    },
    currency: {
        fontSize: 18,
        fontWeight: '600',
        color: '#080808',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    sendButton: {
        marginTop: 30,
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    sendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FareContributionScreen;
