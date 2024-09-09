import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '../../firebase/auth';
import { Colors } from '../../constants/colors';

const MenuHome = () => {
    const navigation = useNavigation();

    const handleLinkPress = () => {
        Linking.openURL('https://online-apple-store.web.app/home');
    };

    const handleContact = () => {
        navigation.navigate('contact');
    };

    const handleLogoutPress = () => {
        handleLogout(navigation); // Call handleLogout with navigation prop
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.userInfo}>
                    <Text style={styles.bestSellingTitle}>Account</Text>

                    <TouchableOpacity style={styles.userInfoRow} onPress={() =>
                        navigation.navigate('orders')
                    }>
                        <Text style={styles.label}>Orders</Text>
                        <Text style={styles.info}>Your Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfoRow} onPress={() => navigation.navigate('Favorite')}>
                        <Text style={styles.label}>Favorite</Text>
                        <Text style={styles.info}>Favorite products</Text>
                    </TouchableOpacity>

                    <Text style={styles.bestSellingTitle}>Personal info</Text>
                    <TouchableOpacity style={styles.userInfoRow} onPress={() => navigation.navigate('forgot')} >
                        <Text style={styles.label}>Verify</Text>
                        <Text style={styles.info}>Forgot password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfoRow} onPress={() => navigation.navigate('change')}>
                        <Text style={styles.label}>Password</Text>
                        <Text style={styles.info}>Change password</Text>
                    </TouchableOpacity>
                    <Text style={styles.bestSellingTitle}>Connect</Text>
                    <TouchableOpacity style={styles.userInfoRow} onPress={() => Linking.openURL('https://portfolio-63e50.web.app/')}>
                        <Text style={styles.label}>About us</Text>
                        <Text style={styles.info}>Articles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfoRow} onPress={handleLinkPress}>
                        <Text style={styles.label}>Website</Text>
                        <Text style={styles.info}>Our website</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userInfoRow} onPress={handleContact}>
                        <Text style={styles.label}>Help?</Text>
                        <Text style={styles.info}>Contact us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logButton} onPress={handleLogoutPress} >
                        <Text style={styles.logButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20
    },
    userInfo: {
        borderRadius: 20,
    },
    bestSellingTitle: {
        marginLeft: 10,
        fontSize: 20,
        color: '#657786',
        marginBottom: 7,
        marginTop: 10,
    },
    userInfoRow: {
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#E1E8ED',
        height: 60,
        padding: 10,
        borderRadius: 8,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    label: {
        flex: 1,
        fontSize: 18,
        color: '#A9B3C1',
    },
    info: {
        flex: 2,
        fontSize: 18,
        color: '#657786',
    },
    logButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
        marginTop: 20,
        width: 160,
        marginBottom: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logButtonText: {
        color: '#657786',
        fontSize: 16,
        alignSelf: 'center'
    },
});

export default MenuHome;
