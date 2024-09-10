import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { ChangePassword } from '../../firebase/auth'; // Make sure this function is correctly implemented

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            ToastAndroid.show('Please enter both current and new passwords.', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        const response = await ChangePassword(currentPassword, newPassword);
        setLoading(false);

        if (response.success) {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        } else {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.niceWords}>Enter your current password and a new password to update your password.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your current password"
                        placeholderTextColor="#657786"
                        secureTextEntry={!showPassword}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your new password"
                        placeholderTextColor="#657786"
                        secureTextEntry={!showPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <TouchableOpacity style={styles.togglePasswordButton} onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.togglePasswordText}>
                        {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Text style={styles.signInButtonText}>
                        {loading ? 'Changing...' : 'Change Password'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8FA',
        paddingHorizontal: 40,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    welcomeContainer: {
        marginBottom: 30,
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 24,
        color: '#657786',
        marginBottom: 10,
    },
    niceWords: {
        fontSize: 16,
        color: '#657786',
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        color: '#657786',
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#111',
    },
    togglePasswordButton: {
        marginTop: 10,
        alignSelf: 'center',
    },
    togglePasswordText: {
        fontSize: 14,
        color: '#657786',
    },
    signInButton: {
        backgroundColor: '#657786',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    signInButtonText: {
        fontSize: 17,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default ChangePasswordScreen;
