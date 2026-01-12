
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RewardsModalProps {
    visible: boolean;
    onClose: () => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.rewardsModalOverlay}>
                <View style={styles.rewardsModalContent}>
                    {/* Top Handle */}
                    <View style={styles.rewardsModalHandle} />

                    {/* Content */}
                    <View style={styles.rewardsContentContainer}>
                        {/* Green Check Badge */}
                        <View style={styles.successBadgeContainer}>
                            <View style={styles.successBadge}>
                                <Ionicons name="checkmark" size={40} color="#fff" />
                            </View>
                        </View>

                        <Text style={styles.rewardsTitle}>You just earned 10 points!</Text>
                        <Text style={styles.rewardsMessage}>
                            Keep contributing accurate fare information to earn more rewards and help your community travel smarter.
                        </Text>
                    </View>

                    {/* Bottom Buttons */}
                    <View style={styles.rewardsButtons}>
                        <TouchableOpacity
                            style={styles.rewardsBackButton}
                            onPress={onClose}
                        >
                            <Text style={styles.rewardsBackButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rewardsViewButton}
                            onPress={onClose}
                        >
                            <Text style={styles.rewardsViewButtonText}>View Fare</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    rewardsModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardsModalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '90%',
        maxWidth: 400,
        paddingTop: 16,
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    rewardsModalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    rewardsContentContainer: {
        alignItems: 'center',
        paddingVertical: 20,
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
    rewardsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
    },
    rewardsMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    rewardsButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    rewardsBackButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    rewardsBackButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    rewardsViewButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    rewardsViewButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default RewardsModal;
