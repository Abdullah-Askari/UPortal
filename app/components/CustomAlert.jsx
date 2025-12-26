import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '../../context/useTheme';

const CustomAlert = ({
    visible,
    title,
    message,
    type = 'info',
    onClose,
    confirmText = 'OK',
    onConfirm,
    showCancel = false,
    cancelText = 'Cancel'
}) => {
    const { theme } = useTheme();

    if (!visible) return null;

    const getIconName = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            case 'info': return 'information-circle';
            default: return 'information-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return theme.success;
            case 'error': return theme.error;
            case 'warning': return theme.warning;
            case 'info': return theme.info;
            default: return theme.primary;
        }
    };

    const Color = getColor();

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Animated.View
                    entering={ZoomIn.duration(300).springify()}
                    exiting={ZoomOut.duration(200)}
                    style={{
                        width: '100%',
                        maxWidth: 400,
                        backgroundColor: theme.surface,
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        elevation: 10
                    }}
                >
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: Color + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            <Ionicons name={getIconName()} size={36} color={Color} />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 10 }}>{title}</Text>
                        <Text style={{ fontSize: 16, color: theme.textSecondary, textAlign: 'center', lineHeight: 24 }}>{message}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {showCancel && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onClose}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: theme.border,
                                    alignItems: 'center',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.textSecondary }}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                if (onConfirm) onConfirm();
                                else onClose();
                            }}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                borderRadius: 12,
                                backgroundColor: Color,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: Color,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 4
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
