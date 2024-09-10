import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { checkUsernameAvailability, signUpUser } from '../../firebase/auth';
import CustomText from '../../components/elements/Customtext';

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpPress = async () => {
        if (!name || !email || !password || !confirmPassword || !username) {
            ToastAndroid.show('Please fill out all the fields before signing up', ToastAndroid.SHORT);
            return;
        }

        if (!/^[a-zA-Z\s]*$/.test(name)) {
            ToastAndroid.show('Please enter a valid name with only letters and spaces', ToastAndroid.SHORT);
            return;
        }

        if (new Date(birthday).getFullYear() > 2005) {
            ToastAndroid.show('Please select a valid birth date, user should be over 18 years old', ToastAndroid.SHORT);
            return;
        }

        if (password !== confirmPassword) {
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
            return;
        }

        const containsLetterAndNumber = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!containsLetterAndNumber.test(password)) {
            ToastAndroid.show('Password should contain letters and numbers and at least 6 digits', ToastAndroid.SHORT);
            return;
        }

        if (!/^[a-zA-Z_]+$/.test(username) && !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d_]{5,}$/.test(username)) {
            ToastAndroid.show('Username can only contain letters, numbers, or underscore (_) with at least 5 characters', ToastAndroid.SHORT);
            return;
        }

        setIsLoading(true);
        if (!(await checkUsernameAvailability(username)).available) {
            ToastAndroid.show(`Username is already taken. Try a different username.`, ToastAndroid.SHORT);
            setIsLoading(false);
            return;
        }
    
        const result = await signUpUser(email, password, name, username); // Updated function name
    
        setIsLoading(false);
        if (result.success) {
            ToastAndroid.show('Email verification sent! Verify to sign in', ToastAndroid.SHORT);
            navigation.navigate('signIN');
            setName('');
            setBirthday('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } else {
            if (result.error.code === 'auth/email-already-in-use') {
                ToastAndroid.show('This email is already in use', ToastAndroid.SHORT);
            } else if (result.error.code === 'auth/invalid-email') {
                ToastAndroid.show('Invalid email address', ToastAndroid.SHORT);
            } else if (result.error.code === 'auth/weak-password') {
                ToastAndroid.show('Password should be at least 6 characters long', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('An unknown error occurred', ToastAndroid.SHORT);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={{
                        padding: 10,
                        width: 70,
                        alignItems: 'center',
                        borderRadius: 10,
                        bottom: 20,
                        right: 10,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name='arrow-left' color={'#657786'} size={30} />
                </TouchableOpacity>
                <View style={styles.welcomeContainer}>
                    <CustomText style={{ olor: '#1DA1F2' }}>Sign up to continue</CustomText>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Full Name"
                        value={name}
                        onChangeText={setName}
                        maxLength={16}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>User Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={text => setUsername(text.replace(/\s/g, ''))}
                        maxLength={16}
                    />
                </View>
                <Text style={styles.note}>Username should be unique without spaces.</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.note}>At least <Text style={{ color: "grey", fontWeight: 'bold', fontSize: 13 }}>6</Text> digits containing letters and numbers.</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirm your password"
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="grey" />
                ) : (
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignUpPress}>
                        <Text style={styles.signInButtonText}>Create new account</Text>
                    </TouchableOpacity>
                )}

            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.signUpLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8FA',
        padding: 10,
    },
    welcomeContainer: {
        marginBottom: 7,
        alignSelf: 'center',
    },
    note: {
        fontSize: 12,
        color: '#657786',
        alignSelf: 'center'
    },
    inputContainer: {
        marginBottom: 10,
    },
    googleContainer: {
        paddingTop: 5,
    },
    inputLabel: {
        fontSize: 16,
        color: '#657786',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: '#657786',
        alignSelf: 'center',
        marginBottom: 5,
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
        backgroundColor: '#657786',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    signInButtonText: {
        fontSize: 17,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    signUpLink: {
        fontSize: 14,
        color: '#657786',
        marginTop: 10,
        alignSelf: 'center',
        paddingBottom: 10,
    },
    google: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        padding: 10,
    },
    socialIcon: {
        marginBottom: '24%',
        backgroundColor: '#E1E8ED',
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        marginLeft: 6
    },
    auther: {
        alignSelf: 'center',
        marginBottom: "50%",
        color: '#657786',
        fontSize: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#657786',
    },
});

export default SignUpScreen;

