import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { handleSignIn } from "../../firebase/auth";
import { Colors } from "../../constants/colors";
import CustomText from "../../components/elements/Customtext";

const SignInScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleSignUp = () => {
        navigation.navigate('signUP');
    };

    const handleSignInPress = () => {
        if (email === "admin" && password === "admin") {
            // Navigate to AdminPage
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'admin' }],
                })
            );
        } else {
            // Use your existing sign-in logic
            handleSignIn(email, password, navigation);
        }
    };
    return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <CustomText style={styles.welcomeText}>Welcome back!</CustomText>
                    <CustomText style={styles.niceWords}>Sign in to continue</CustomText>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your email"
                        placeholderTextColor={Colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                    />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor={Colors.textSecondary}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
                <Text style={styles.signUpLink} onPress={handleSignUp}>
                    Don't have an account?<Text style={{ color: "grey" }}> Sign Up</Text>!
                </Text>
                <Text style={styles.signUpLink} onPress={() => navigation.navigate('Forgot Password')}>
                    Forgot <Text style={{ color: "grey" }}>Password?</Text>
                </Text>
                <View>
                    <View style={styles.auther}>
                        <CustomText style={styles.font}>made by</CustomText>
                        <CustomText style={styles.font2}>ahmed essam</CustomText>
                    </View>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: '36%',
        flex: 1,
        padding: 40,
        backgroundColor:Colors.background
    },
    welcomeContainer: {
        marginBottom: 30,
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 24,
        alignSelf: 'center',
        color: Colors.secondary,
        marginBottom: 10,
    },
    niceWords: {
        fontSize: 16,
        alignSelf: 'center',
        color: Colors.secondary,
    },
    font: {
        color: Colors.textPrimary,
    },
    font2: {
        color: Colors.textPrimary,
        fontSize:25,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        color: Colors.secondary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#111',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 10,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },
    signInButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    signInButtonText: {
        fontSize: 17,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    signUpLink: {
        fontSize: 14,
        color: Colors.secondary,
        marginTop: 20,
        alignSelf: 'center',
    },
    auther: {
        alignSelf: 'center',
        color: Colors.secondary,
        paddingTop: '20%',
        fontSize: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: Colors.secondary,
    },
});

export default SignInScreen;
