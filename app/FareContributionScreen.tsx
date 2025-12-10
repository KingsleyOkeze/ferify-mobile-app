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
































// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     Image,
//     SafeAreaView,
//     Dimensions,
// } from "react-native";
// import { Ionicons, Feather } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// export default function FareContributionPage() {
//     const [fare, setFare] = useState("");
//     const [selectedTime, setSelectedTime] = useState("");

//     const fareOptions = ["200", "300", "400", "500", "700", "1000"];

//     const timeOptions = [
//         { label: "Morning", range: "6am – 12pm" },
//         { label: "Afternoon", range: "12pm – 4pm" },
//         { label: "Evening", range: "4pm – 7pm" },
//         { label: "Night", range: "7pm – 11pm" },
//     ];

//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView contentContainerStyle={styles.body}>

//                 {/* TITLE */}
//                 <Text style={styles.pageTitle}>Fare Contribution</Text>

//                 {/* REWARD BANNER */}
//                 <View style={styles.rewardBanner}>
//                     <Ionicons name="trophy" size={26} color="#0E5F00" />
//                     <Text style={styles.rewardText}>
//                         Submit accurate fare information and earn 20 points
//                     </Text>
//                 </View>

//                 {/* ROUTE INPUT AREA */}
//                 <View style={styles.routeArea}>
//                     <Image
//                         source={{ uri: "https://picsum.photos/150/150" }}
//                         style={styles.routeImg}
//                     />

//                     <View style={styles.routeInputs}>
//                         <TextInput
//                             placeholder="From (e.g., Ojuelegba)"
//                             style={styles.routeInput}
//                         />
//                         <TextInput
//                             placeholder="To (e.g., CMS)"
//                             style={styles.routeInput}
//                         />
//                     </View>
//                 </View>

//                 {/* FARE INPUT */}
//                 <Text style={styles.sectionTitle}>How much did you pay?</Text>

//                 <View style={styles.fareInputWrap}>
//                     <Text style={styles.naira}>₦</Text>
//                     <TextInput
//                         placeholder="Enter fare amount"
//                         keyboardType="numeric"
//                         style={styles.fareInput}
//                         value={fare}
//                         onChangeText={setFare}
//                     />
//                 </View>

//                 {/* QUICK FARE SELECT */}
//                 <View style={styles.fareOptionsWrap}>
//                     {fareOptions.map((amt) => (
//                         <TouchableOpacity
//                             key={amt}
//                             style={styles.fareChip}
//                             onPress={() => setFare(amt)}
//                         >
//                             <Text style={styles.fareChipText}>₦{amt}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* TIME OF ROUTE */}
//                 <Text style={styles.sectionTitle}>When did you take this route?</Text>

//                 <View style={styles.timeGrid}>
//                     {timeOptions.map((t) => (
//                         <TouchableOpacity
//                             key={t.label}
//                             style={[
//                                 styles.timeCard,
//                                 selectedTime === t.label && styles.timeCardActive,
//                             ]}
//                             onPress={() => setSelectedTime(t.label)}
//                         >
//                             <Text style={styles.timeLabel}>{t.label}</Text>

//                             <View style={styles.timeRow}>
//                                 <Feather
//                                     name="clock"
//                                     size={16}
//                                     color={selectedTime === t.label ? "#fff" : "#555"}
//                                 />
//                                 <Text
//                                     style={[
//                                         styles.timeRange,
//                                         selectedTime === t.label && { color: "#fff" },
//                                     ]}
//                                 >
//                                     {t.range}
//                                 </Text>
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Spacing so content doesn't hide behind fixed bottom */}
//                 <View style={{ height: 120 }} />

//             </ScrollView>

//             {/* FIXED BOTTOM */}
//             <View style={styles.bottomFixed}>
//                 <TouchableOpacity style={styles.submitBtn}>
//                     <Text style={styles.submitText}>Submit Fare</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.subNote}>
//                     Thank you for helping keep fares accurate!
//                 </Text>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#fff" },

//     body: {
//         paddingHorizontal: 20,
//         paddingTop: 20,
//     },

//     pageTitle: {
//         fontSize: 22,
//         fontWeight: "700",
//         marginBottom: 15,
//         color: "#111",
//     },

//     rewardBanner: {
//         flexDirection: "row",
//         backgroundColor: "#E6F7E5",
//         padding: 12,
//         borderRadius: 12,
//         alignItems: "center",
//         marginBottom: 20,
//         gap: 10,
//     },

//     rewardText: {
//         flex: 1,
//         color: "#0E5F00",
//         fontSize: 14,
//         fontWeight: "500",
//     },

//     routeArea: {
//         flexDirection: "row",
//         backgroundColor: "#fafafa",
//         padding: 12,
//         borderRadius: 14,
//         marginBottom: 25,
//         alignItems: "center",
//     },

//     routeImg: {
//         width: 90,
//         height: 90,
//         borderRadius: 10,
//         marginRight: 15,
//     },

//     routeInputs: { flex: 1 },

//     routeInput: {
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#ddd",
//         padding: 12,
//         borderRadius: 10,
//         marginBottom: 8,
//         fontSize: 14,
//     },

//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: "600",
//         marginBottom: 10,
//         color: "#111",
//     },

//     fareInputWrap: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         backgroundColor: "#fff",
//         marginBottom: 15,
//     },

//     naira: {
//         fontSize: 22,
//         fontWeight: "700",
//         marginRight: 8,
//     },

//     fareInput: {
//         flex: 1,
//         fontSize: 16,
//         paddingVertical: 6,
//     },

//     fareOptionsWrap: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 10,
//         marginBottom: 25,
//     },

//     fareChip: {
//         paddingVertical: 10,
//         paddingHorizontal: 18,
//         backgroundColor: "#f2f2f2",
//         borderRadius: 8,
//     },

//     fareChipText: {
//         fontSize: 14,
//         fontWeight: "500",
//     },

//     timeGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between",
//         gap: 15,
//         marginTop: 10,
//     },

//     timeCard: {
//         width: "47%",
//         padding: 15,
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 12,
//         backgroundColor: "#fff",
//     },

//     timeCardActive: {
//         backgroundColor: "#111",
//         borderColor: "#111",
//     },

//     timeLabel: {
//         fontSize: 15,
//         fontWeight: "600",
//         marginBottom: 6,
//         color: "#111",
//     },

//     timeRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 6,
//     },

//     timeRange: {
//         fontSize: 13,
//         color: "#555",
//     },

//     bottomFixed: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         padding: 20,
//         backgroundColor: "#fff",
//         borderTopWidth: 1,
//         borderColor: "#eee",
//     },

//     submitBtn: {
//         backgroundColor: "#000",
//         paddingVertical: 16,
//         alignItems: "center",
//         borderRadius: 12,
//         marginBottom: 6,
//     },

//     submitText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },

//     subNote: {
//         textAlign: "center",
//         fontSize: 13,
//         color: "#555",
//     },
// });
