
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height } = Dimensions.get('window');

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    onClaimReward: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    onClaimReward,
}) => {
    const [slideAnim] = useState(new Animated.Value(height));

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    // Removed early return
    // if (!visible) return null;

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
                    <TouchableOpacity activeOpacity={1}>
                        {/* Green Check Badge */}
                        <View style={styles.successBadgeContainer}>
                            <View style={styles.successBadge}>
                                <Ionicons name="checkmark" size={40} color="#fff" />
                            </View>
                        </View>

                        <Text style={styles.successTitle}>Thanks! Your fare has been submitted.</Text>
                        <Text style={styles.successSubtitle}>Your update helped others move better.</Text>

                        <TouchableOpacity
                            style={styles.claimRewardButton}
                            onPress={onClaimReward}
                        >
                            <Text style={styles.claimRewardButtonText}>Claim Reward</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingBottom: 32,
        paddingHorizontal: 20,
        maxHeight: height * 0.7,
    },
    successModalContent: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    successBadgeContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    successBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderStyle: 'solid',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    successSubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    claimRewardButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 48,
        alignItems: 'center',
    },
    claimRewardButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default SuccessModal;
