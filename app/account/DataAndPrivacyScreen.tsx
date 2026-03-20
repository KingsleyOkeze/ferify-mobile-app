import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { useLoader } from '@/contexts/LoaderContext';
import * as FileSystem from 'expo-file-system';

function DataAndPrivacyScreen() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const [exportStatus, setExportStatus] = useState<'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'expired'>('idle');
    const [jobId, setJobId] = useState<string | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    useFocusEffect(
        useCallback(() => {
            checkExistingExport();
        }, [])
    );

    const checkExistingExport = async () => {
        try {
            setIsCheckingStatus(true);
            const storedJobId = await AsyncStorage.getItem('data_export_job_id');
            if (storedJobId) {
                const response = await api.get(`/api/user/account/data-export/status/${storedJobId}`);
                setJobId(storedJobId);
                setExportStatus(response.data.status);
            }
        } catch (error: any) {
            if (error.response?.status === 410) {
                setExportStatus('expired');
                await AsyncStorage.removeItem('data_export_job_id');
            }
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const handleDownloadPress = async () => {
        if (exportStatus === 'completed' && jobId) {
            await downloadExport();
        } else if (exportStatus === 'idle' || exportStatus === 'expired' || exportStatus === 'failed') {
            await requestExport();
        } else if (exportStatus === 'pending' || exportStatus === 'processing') {
            Alert.alert(
                "Export in Progress",
                "Your data export is being prepared. Please check back in a few minutes.",
                [{ text: "OK" }]
            );
        }
    };

    const requestExport = async () => {
        try {
            showLoader();
            const response = await api.post('/api/user/account/data-export/request');

            const newJobId = response.data.jobId;
            setJobId(newJobId);
            setExportStatus('pending');

            await AsyncStorage.setItem('data_export_job_id', newJobId);

            Alert.alert(
                "Export Requested",
                "We're preparing your data. This may take a few minutes. Please check back shortly.",
                [{ text: "OK" }]
            );

            pollExportStatus(newJobId);

        } catch (error: any) {
            if (error.response?.status === 429) {
                Alert.alert(
                    "Rate Limit Exceeded",
                    error.response?.data?.message || "You can request a data export once every 24 hours."
                );

                if (error.response?.data?.existingJobId) {
                    setJobId(error.response.data.existingJobId);
                    checkExistingExport();
                }
            } else {
                Alert.alert("Error", "Failed to request data export. Please try again.");
            }
        } finally {
            hideLoader();
        }
    };

    const pollExportStatus = async (jobIdToCheck: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/api/user/account/data-export/status/${jobIdToCheck}`);
                setExportStatus(response.data.status);

                if (response.data.status === 'completed') {
                    clearInterval(interval);
                    Alert.alert(
                        "Export Ready",
                        "Your data export is ready to download!",
                        [{ text: "OK" }]
                    );
                } else if (response.data.status === 'failed') {
                    clearInterval(interval);
                }
            } catch (error) {
                clearInterval(interval);
            }
        }, 5000);

        setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
    };

    const downloadExport = async () => {
        if (!jobId) return;

        try {
            showLoader();

            const downloadUrl = `${api.defaults.baseURL}/api/user/account/data-export/download/${jobId}`;
            const fileUri = FileSystem.documentDirectory + `my_ferify_data_${Date.now()}.json`;

            const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri, {
                headers: {
                    'Authorization': (api.defaults.headers.common['Authorization'] as string) || ''
                }
            });

            hideLoader();

            if (downloadResult.status === 200) {
                Alert.alert(
                    "Downloaded",
                    `Your data has been saved to your device.\n\nFile: ${fileUri}`,
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert("Download Failed", "Failed to download your data export.");
            }

        } catch (error) {
            console.error('Download error:', error);
            hideLoader();
            Alert.alert("Error", "Failed to download export. Please try again.");
        }
    };

    const getDownloadDescription = () => {
        if (isCheckingStatus) return 'Checking status...';

        switch (exportStatus) {
            case 'pending':
            case 'processing':
                return 'Export in progress...';
            case 'completed':
                return 'Ready to download';
            case 'failed':
                return 'Export failed - Tap to retry';
            case 'expired':
                return 'Export expired - Tap to request new';
            default:
                return 'Get a copy of your data';
        }
    };

    const menuItems = [
        {
            id: 'visibility',
            title: 'Contribution visibility',
            description: 'Manage who can see your contribution',
            image: require('@/assets/images/data-and-privacy-icons/contribution_visibility_icon.png'),
            onPress: () => { router.push('../setting/ContributionVisibilitySettingScreen') },
        },
        {
            id: 'download',
            title: 'Download your data',
            description: getDownloadDescription(),
            image: require('@/assets/images/data-and-privacy-icons/download_your_data_icon.png'),
            onPress: handleDownloadPress,
            showIndicator: exportStatus === 'pending' || exportStatus === 'processing' || isCheckingStatus,
            showCheckmark: exportStatus === 'completed'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Data & privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Image source={item.image} style={styles.itemIcon} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    {item.description && (
                                        <Text style={styles.itemDescription}>{item.description}</Text>
                                    )}
                                </View>
                            </View>
                            {/* Show loading indicator, checkmark, or arrow */}
                            {item.showIndicator ? (
                                <ActivityIndicator size="small" color="#080808" />
                            ) : item.showCheckmark ? (
                                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            ) : (
                                <Ionicons name="chevron-forward" size={16} color="#080808" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Info Section */}
                {exportStatus !== 'idle' && (
                    <View style={styles.infoSection}>
                        <Ionicons name="information-circle-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            {exportStatus === 'completed'
                                ? 'Your export includes profile, contributions, saved routes, rewards, and feedback.'
                                : exportStatus === 'pending' || exportStatus === 'processing'
                                    ? 'We\'re preparing your data. This usually takes a few minutes.'
                                    : 'You can request a data export once every 24 hours.'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
        marginLeft: -4
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
        // paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
        height: 36,
        width: 36,
        borderRadius: 56.25
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
    infoSection: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'BrittiRegular',
        color: '#666',
        lineHeight: 18,
    },
});

export default DataAndPrivacyScreen;
