import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // For dot icons
import startToEndImage from "../assets/images/startToEndImage.png";
import startingRouteIcon from "../assets/images/startingRouteIcon.png";
import endingRouteIcon from "../assets/images/endingRouteIcon.png"



type FareItem = {
    id: string;
    updatedAt: string;
    users: number;
    startRoute: string;
    endRoute: string;
    mode: 'bus' | 'okada' | 'keke';
    fareRange: string;
    timeRange: string;
};

// Mock data from DB
const fareData: FareItem[] = [
    {
        id: '1',
        updatedAt: '12 months ago',
        users: 5,
        startRoute: 'Ikeja',
        endRoute: 'Yaba',
        mode: 'bus',
        fareRange: '₦1200 - ₦1800',
        timeRange: '1hr 15min - 1hr 40min',
    },
    {
        id: '2',
        updatedAt: '3 months ago',
        users: 2,
        startRoute: 'CMS',
        endRoute: 'Ajah',
        mode: 'keke',
        fareRange: '₦400 - ₦600',
        timeRange: '45min - 1hr',
    },
];

function FareSummaryScreen() {
    const [activeTab, setActiveTab] = useState<'summary' | 'breakdown'>('summary');

    const renderFareCard = ({ item }: { item: FareItem }) => (
        <View style={styles.card}>
            {/* Updated Time + Users */}
            <View style={styles.cardHeader}>
                <Text style={styles.updatedText}>Updated {item.updatedAt}</Text>
                <View style={styles.userContainer}>
                    <MaterialIcons name="fiber-manual-record" size={8} color="#5599FF" />
                    <Text style={styles.userText}>{item.users} users</Text>
                </View>
            </View>

            <View style={styles.cardMainDetailsBody}>
                {/* Route section */}
                <View style={styles.routeContainer}>
                    <View style={styles.routeRow}>
                        {/* <View style={styles.dot} /> */}
                        <Image
                            source={startingRouteIcon}
                            style={styles.dot}
                        />
                        <Text style={styles.routeText}>{item.startRoute}</Text>
                    </View>

                    <Image
                        source={startToEndImage}
                        style={styles.dottedLine}
                    />

                    <View style={styles.routeRow}>
                        {/* <View style={[styles.dot, { backgroundColor: '#1A73E8' }]} /> */}
                        <Image
                            source={endingRouteIcon}
                            style={styles.dot}
                        />
                        <Text style={styles.routeText}>{item.endRoute}</Text>
                    </View>
                </View>

                {/* Transport mode */}
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Transport Mode</Text>
                    <View style={styles.modeOfTransportRowCenter}>
                        {item.mode === 'bus' && (
                            <Ionicons name="bus-outline" size={18} color="#21A351" />
                        )}
                        {item.mode === 'okada' && (
                            <Ionicons name="bicycle-outline" size={18} color="#1A73E8" />
                        )}
                        {item.mode === 'keke' && (
                            <Ionicons name="car-outline" size={18} color="#1A73E8" />
                        )}
                        <Text style={[styles.modeOfTransportValue, { marginLeft: 5 }]}>{item.mode}</Text>
                    </View>
                </View>

                {/* Fare */}
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Overall Estimated Fare</Text>
                    <Text style={styles.value}>{item.fareRange}</Text>
                </View>

                {/* Time */}
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Overall Estimated Time</Text>
                    <Text style={styles.value}>{item.timeRange}</Text>
                </View>
            </View>
        </View>
    );

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

            {/* Title and Save */}
            <View style={styles.titleRow}>
                <Text style={styles.title}>Fare Summary</Text>
                <TouchableOpacity style={styles.saveButton}>
                    <Ionicons name="heart-outline" size={16} color="#000" />
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* Toggle Section */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        activeTab === 'summary' && styles.toggleActive,
                    ]}
                    onPress={() => setActiveTab('summary')}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            activeTab === 'summary' && styles.toggleTextActive,
                        ]}
                    >
                        Summary
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        activeTab === 'breakdown' && styles.toggleActive,
                    ]}
                    onPress={() => setActiveTab('breakdown')}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            activeTab === 'breakdown' && styles.toggleTextActive,
                        ]}
                    >
                        Breakdown
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Fare List */}
            <FlatList
                data={fareData}
                keyExtractor={(item) => item.id}
                renderItem={renderFareCard}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        height: 50,
        position: 'relative'
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
    },
    backText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#61656C'
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '400',
        color: '#000',
        fontFamily: 'Coolvetica'
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EBEDEF',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: 76,
        height: 34,

    },
    saveText: {
        marginLeft: 4,
        fontWeight: '500',
        fontSize: 14,
        color: '#080808',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
        borderRadius: 8,
        marginVertical: 10,
        padding: 8
    },
    toggleButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 100,
    },
    toggleActive: {
        backgroundColor: '#FFFFFF',
    },
    toggleText: {
        fontSize: 14,
        color: '#555',
    },
    toggleTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
        marginBottom: 18,
        borderRadius: 10,
        // height: 229,
        // padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1.5 },
        shadowRadius: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingLeft: 6,
        paddingRight: 6,
        marginBottom: 10,
        height: 35
    },
    updatedText: {
        fontSize: 12,
        color: '#555',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#5599FF',
        fontWeight: '500',
    },
    cardMainDetailsBody: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        backgroundColor: '#FFFFFF'
    },
    routeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    dot: {
        width: 11.5,
        height: 11.5,
        borderRadius: 1,
        backgroundColor: '#555',
        marginRight: 6,
    },
    routeText: {
        fontSize: 14,
        color: '#000',
    },
    dottedLine: {
        // width: 1,
        // height: 20,
        // borderLeftWidth: 1,
        // borderColor: '#CCC',
        // borderStyle: 'dotted',
        // marginVertical: 4,
        width: 137,
        height: 8,

    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        padding: 12,

    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        color: '#555',
    },
    value: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    modeOfTransportRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 66,
        padding: 4,
        height: 32,
        borderRadius: 50,
        backgroundColor: '#21A35114'

    },
    modeOfTransportValue: {
        color: "#21A351"
    }
});



export default FareSummaryScreen;