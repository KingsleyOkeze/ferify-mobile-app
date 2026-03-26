
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    onClaimReward: () => void;
}

export default function SuccessModal({
    visible,
    onClose,
}: SuccessModalProps) {
    const router = useRouter();
    const slideAnim = React.useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            slideAnim.setValue(height);
        }
    }, [visible, slideAnim]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                onClose();
            }
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={handleClose}
            >
                <Animated.View
                    style={[
                        styles.modalContent,
                        styles.successModalContent,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalInner}>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <Ionicons name="close" size={24} color="#080808" />
                        </TouchableOpacity>

                        {/* Point Earned Section */}
                        <View style={styles.scoreContainer}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('@/assets/images/modal-icons/point_earned_icon.png')}
                                    style={styles.pointIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.pointsText}>+1</Text>
                        </View>

                        <Text style={styles.successTitle}>Thanks! You've just earned 1 point.</Text>
                        <Text style={styles.successSubtitle}>Your update helped others move better.</Text>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                handleClose();
                                router.replace('/(tabs)/HomeScreen');
                            }}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FBFBFB',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        minHeight: 335,
        paddingHorizontal: 20,
        maxHeight: height * 0.7,
    },
    successModalContent: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    modalInner: {
        width: '100%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: -15,
        right: 0,
        zIndex: 10,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 24,
        gap: 8,
    },
    iconWrapper: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointIcon: {
        width: 64,
        height: 52,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: 600,
        color: '#080808',
        fontFamily: 'BrittiSemibold',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 600,
        color: '#080808',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
        width: '100%',
        fontFamily: 'BrittiSemibold',
    },
    successSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#616161',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        fontFamily: 'BrittiRegular',
    },
    backButton: {
        backgroundColor: '#080808',
        borderRadius: 100,
        alignItems: 'center',
        width: 165.5,
        height: 48,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'BrittiSemibold',
    },
});

