import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '../../context/useTheme';

const ActionAlert = ({
    visible,
    title,
    message,
    icon = 'images',
    onClose,
    buttons = []
}) => {
    const { theme } = useTheme();

    if (!visible) return null;

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
                            backgroundColor: theme.primary + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            <Ionicons name={icon} size={36} color={theme.primary} />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 10 }}>{title}</Text>
                        <Text style={{ fontSize: 16, color: theme.textSecondary, textAlign: 'center', lineHeight: 24 }}>{message}</Text>
                    </View>

                    <View style={{ gap: 12 }}>
                        {buttons.map((btn, index) => {
                            const isCancel = btn.style === 'cancel';
                            // Use primary color for actions, transparent for cancel
                            const btnBg = isCancel ? 'transparent' : theme.primary;
                            const btnTextColor = isCancel ? theme.textSecondary : '#FFFFFF';

                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={btn.onPress}
                                    style={{
                                        width: '100%',
                                        paddingVertical: 14,
                                        borderRadius: 12,
                                        backgroundColor: btnBg,
                                        borderWidth: isCancel ? 1 : 0,
                                        borderColor: theme.border,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: isCancel ? 'transparent' : theme.primary,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: isCancel ? 0 : 0.3,
                                        shadowRadius: 8,
                                        elevation: isCancel ? 0 : 4
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: btnTextColor }}>{btn.text}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ActionAlert;
