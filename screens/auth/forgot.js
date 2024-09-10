import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { resetPassword } from '../../firebase/auth'; // Ensure this path is correct

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            ToastAndroid.show('Please enter your email address.', ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        const response = await resetPassword(email);
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
                    <Text style={styles.niceWords}>Enter your email address to reset your password.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#657786"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    <Text style={styles.signInButtonText}>
                        {loading ? 'Sending...' : 'Reset Password'}
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
    signInButton: {
        backgroundColor: '#657786',
        borderRadius: 10,
        padding: 10,
    },
    signInButtonText: {
        fontSize: 17,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default ForgotPasswordScreen;
