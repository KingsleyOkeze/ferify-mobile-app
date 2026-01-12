
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

const { height } = Dimensions.get('window');

interface TimeOption {
    label: string;
    value: string;
}

interface TimeSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (value: string, label: string) => void;
    options: TimeOption[];
    currentSelection: string;
}

const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({
    visible,
    onClose,
    onSave,
    options,
    currentSelection,
}) => {
    const [slideAnim] = useState(new Animated.Value(height));
    const [tempSelection, setTempSelection] = useState(currentSelection);

    useEffect(() => {
        if (visible) {
            setTempSelection(currentSelection);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            // Reset state or handle closure
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, currentSelection]);

    const handleSave = () => {
        const selectedOption = options.find(o => o.value === tempSelection);
        if (selectedOption) {
            onSave(tempSelection, selectedOption.label);
        }
        handleClose();
    };

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    // Removed early return to allow Modal to manage visibility and animations correctly
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
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <Text style={styles.modalTitle}>Time you took the route</Text>

                        <View style={styles.modalList}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.modalListItem,
                                        index === 0 && styles.modalListItemFirst,
                                        index === options.length - 1 && styles.modalListItemLast,
                                    ]}
                                    onPress={() => setTempSelection(option.value)}
                                >
                                    <Text style={styles.modalListItemText}>{option.label}</Text>
                                    <View style={styles.radioButton}>
                                        {tempSelection === option.value && (
                                            <View style={styles.radioButtonInner} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, !tempSelection && styles.saveButtonDisabled]}
                                onPress={handleSave}
                                disabled={!tempSelection}
                            >
                                <Text style={[styles.saveButtonText, !tempSelection && styles.saveButtonTextDisabled]}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    modalList: {
        marginBottom: 24,
    },
    modalListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalListItemFirst: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    modalListItemLast: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalListItemText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    saveButtonTextDisabled: {
        color: '#999',
    },
});

export default TimeSelectionModal;
