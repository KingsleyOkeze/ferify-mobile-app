
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

export default function TimeSelectionModal({
    visible,
    onClose,
    onSave,
    options,
    currentSelection,
}: TimeSelectionModalProps) {
    const slideAnim = React.useRef(new Animated.Value(height)).current;
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
            // Ensure it's off-screen when not visible
            slideAnim.setValue(height);
        }
    }, [visible, currentSelection, slideAnim]);

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
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingBottom: 32,
        paddingHorizontal: 20,
        maxHeight: height * 0.7,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 600,
        color: '#000000',
        marginBottom: 24,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    modalList: {
        marginBottom: 24,
    },
    modalListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 60
    },
    modalListItemFirst: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    modalListItemLast: {
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    modalListItemText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'BrittiRegular',
        fontWeight: 400,
        flex: 1,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 41.67,
        borderWidth: 1.67,
        borderColor: '#9C9C9C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 13.33,
        height: 13.33,
        borderRadius: 6,
        backgroundColor: '#080808',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        height: 50,
        borderRadius: 100,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'BrittiRegular',
        color: '#212121',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#080808',
        borderRadius: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#CECECE',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FBFBFB',
        fontFamily: 'BrittiRegular',
    },
    saveButtonTextDisabled: {
        color: '#979797',
    },
});

