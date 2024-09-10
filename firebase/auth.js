// services/authService.js
import { Alert, ToastAndroid } from "react-native";
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
    sendEmailVerification, sendPasswordResetEmail, updatePassword,
    reauthenticateWithCredential, EmailAuthProvider
} from "firebase/auth";
import { FIREBASE_AUTH, db } from "./config";
import { CommonActions } from "@react-navigation/native";
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';


export const checkUsernameAvailability = async (username) => {
    try {
        const usernameSnapshot = await getDocs(collection(db, 'users'));
        const existingUsernames = usernameSnapshot.docs.map((doc) => doc.data().name);

        if (existingUsernames.includes(username)) {
            let suggestionNumber = 2;
            let newUsername = `${username}${suggestionNumber}`;

            while (existingUsernames.includes(newUsername)) {
                suggestionNumber++;
                newUsername = `${username}${suggestionNumber}`;
            }

            return { available: false, suggestion: newUsername };
        }
        return { available: true };
    } catch (error) {
        console.error('Error checking username availability:', error);
        throw error;
    }
};
export const signUpUser = async (email, password, name, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        await updateProfile(userCredential.user, {
            displayName: name,
            photoURL: 'https://th.bing.com/th/id/R.222d79e7bde6db5bb2a2ce526504ddac?rik=mBNCmkbm1VHRfg&pid=ImgRaw&r=0',
        });

        await sendEmailVerification(userCredential.user);

        await setDoc(doc(db, 'users', email), {
            name: username,
            email: email,
            fullname: name,
            password: password,
            Address: 'none',
            Phone: 'none',
            balance: 0
        });

        return { success: true };
    } catch (error) {
        return { success: false, error }; // Return error object
    }
};


export const ChangePassword = async (currentPassword, newPassword) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        try {
            // Reauthenticate user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);
            return { success: true, message: 'Password updated successfully!' };
        } catch (error) {
            console.error(error);
            const errorCode = error.code;
            let errorMessage = '';
            if (errorCode === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect.';
            } else {
                errorMessage = 'Error updating password.';
            }
            return { success: false, message: errorMessage };
        }
    } else {
        return { success: false, message: 'No user is signed in.' };
    }
};
// Sign in user and change password
export const UpdatePassword = async (email, currentPassword, newPassword) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, currentPassword);
        const user = userCredential.user;

        if (!user.emailVerified) {
            await sendEmailVerification(user);
            throw new Error('Please verify your email before signing in.');
        }

        const currentUser = FIREBASE_AUTH.currentUser;

        await updatePassword(currentUser, newPassword);
        return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
        let errorMessage = '';
        if (error.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'Wrong email address.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email!';
        } else if (error.code === 'auth/missing-password') {
            errorMessage = 'Enter a password!';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Wrong password.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many requests, try again after 30 seconds.';
        } else {
            errorMessage = 'Sign-in failed.';
        }
        return { success: false, message: errorMessage };
    }
};

export const handleSignIn = async (email, password, navigation) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            Alert.alert(
                "Warning",
                "Please verify your email before signing in",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Resend Email Verification",
                        onPress: () => sendEmailVerification(user),
                    },
                ],
                { cancelable: false }
            );
            return;
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                })
            );
        }
    } catch (error) {
        console.error("Sign-in failed", error);
        const errorCode = error.code;
        let errorMessage = "";
        if (errorCode === "auth/user-not-found") {
            errorMessage = "Wrong email address";
        } else if (errorCode === "auth/invalid-email") {
            errorMessage = "Invalid email!";
        } else if (errorCode === "auth/missing-password") {
            errorMessage = "Enter a password!";
        } else if (errorCode === "auth/wrong-password") {
            errorMessage = "Incorrect email or password";
        } else if (errorCode === "auth/too-many-requests") {
            errorMessage = "Too many requests, try again after 30 seconds";
        } else {
            errorMessage = "Sign-in failed";
        }

        Alert.alert("Error", errorMessage, [{ text: "OK" }], { cancelable: false });
    }
};





export const handleSignUp = async (email, password, name, navigation) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        navigation.navigate('signIN')
        await sendEmailVerification(userCredential.user);


    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert('This email is already in use');
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Invalid email address');
        } else if (error.code === 'auth/weak-password') {
            Alert.alert('Password should be at least 6 characters long');
        }
    }
};




export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        console.error(error);
        const errorCode = error.code;
        let errorMessage = '';
        if (errorCode === 'auth/user-not-found') {
            errorMessage = 'User not found with this email.';
        } else {
            errorMessage = 'Error sending password reset email';
        }
        return { success: false, message: errorMessage };
    }
};

export const handleLogout = async (navigation) => {
    try {
        await FIREBASE_AUTH.signOut();

        // Reset the navigation state to navigate to 'signIN'
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'signIN' }],
            })
        );

        ToastAndroid.show(`signed out`, ToastAndroid.SHORT);


    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out');
    }
};