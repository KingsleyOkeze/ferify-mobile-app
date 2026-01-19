import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Recommendation {
    name: string;
    place_id: string;
}

interface LocationListProps {
    isSearching: boolean;
    recommendations: Recommendation[];
    onSelect: (item: Recommendation) => void;
}

export default function LocationList({
    isSearching,
    recommendations,
    onSelect,
}: LocationListProps) {
    return (
        <>
            {isSearching && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#000" />
                </View>
            )}

            <ScrollView
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {recommendations.map((item) => (
                    <TouchableOpacity
                        key={item.place_id}
                        style={styles.resultCard}
                        onPress={() => onSelect(item)}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="location-sharp" size={20} color="#000" />
                        </View>

                        <View style={styles.resultDetails}>
                            <Text style={styles.resultTitle}>{item.name}</Text>
                            <Text style={styles.resultAddress}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    resultsList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    resultDetails: {
        flex: 1,
        marginRight: 12,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    resultAddress: {
        fontSize: 14,
        color: '#666',
    },
});