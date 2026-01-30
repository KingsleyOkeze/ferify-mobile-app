import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface LocationInputsProps {
    fromLocation: string;
    toLocation: string;
    fromFocused: boolean;
    toFocused: boolean;
    fromResult: boolean;
    onFromChange: (text: string) => void;
    onToChange: (text: string) => void;
    onFromFocus: () => void;
    onToFocus: () => void;
    onFromBlur: () => void;
    onToBlur: () => void;
    toInputRef: React.RefObject<TextInput | null>;
}

export default function LocationInputs({
    fromLocation,
    toLocation,
    fromFocused,
    toFocused,
    fromResult,
    onFromChange,
    onToChange,
    onFromFocus,
    onToFocus,
    onFromBlur,
    onToBlur,
    toInputRef,
}: LocationInputsProps) {
    return (
        <View style={styles.inputsSection}>
            <View style={styles.locationContainer}>
                {/* From Input */}
                <TextInput
                    style={[styles.locationInput, fromFocused && styles.locationInputFocused]}
                    placeholder="From where"
                    placeholderTextColor="#999"
                    value={fromLocation}
                    onChangeText={onFromChange}
                    onFocus={onFromFocus}
                    onBlur={onFromBlur}
                />

                {/* To Input + Connector Arrow */}
                <View style={styles.toInputWrapper}>
                    <TextInput
                        ref={toInputRef}
                        style={[
                            styles.locationInput,
                            styles.toLocationInput,
                            toFocused && styles.locationInputFocused,
                            !fromResult && styles.disabledInput,
                        ]}
                        placeholder="To where"
                        placeholderTextColor="#999"
                        value={toLocation}
                        editable={fromResult}
                        onChangeText={onToChange}
                        onFocus={() => {
                            if (!fromResult) {
                                Alert.alert("Information", "Please select a starting point first.");
                                return;
                            }
                            onToFocus();
                        }}
                        onBlur={onToBlur}
                    />

                    <View
                        style={[
                            styles.connectorArrow,
                            !fromResult && { backgroundColor: '#999' },
                        ]}
                    >
                        <Ionicons name="arrow-down" size={18} color="#fff" />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputsSection: {
    },
    locationContainer: {
        position: 'relative',
        paddingHorizontal: 20,
        backgroundColor: 'red'
    },
    locationInput: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 100,
    },
    locationInputFocused: {
        borderColor: '#000',
    },
    toInputWrapper: {
        position: 'relative',
    },
    toLocationInput: {
        marginBottom: 0,
    },
    disabledInput: {
        opacity: 0.5,
    },
    connectorArrow: {
        position: 'absolute',
        right: 12,
        top: '-5%',
        marginTop: -16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});