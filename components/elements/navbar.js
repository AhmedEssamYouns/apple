import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FIREBASE_AUTH } from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { fetchCartData, calculateCartTotal } from '../../firebase/cart';

const CustomHeader = ({ }) => {
    const img = FIREBASE_AUTH.currentUser?.photoURL;
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cleanup = fetchCartData(setCartItems, setIsLoading);

        return () => {
            if (cleanup) cleanup(); // Cleanup subscription on unmount
        };
    }, []);

    const cartTotal = calculateCartTotal(cartItems);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                apple<Text style={styles.logo}>store</Text>
            </Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('cart')}>
                    <View style={styles.cartContainer}>
                        <Feather name="shopping-cart" size={30} color={Colors.secondary} />
                        {cartTotal > 0 && (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{cartTotal}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('profile')}>
                    {img ? (
                        <Image source={{ uri: img }} style={styles.profileImage} />
                    ) : (
                        <Feather name="user" size={30} color={Colors.secondary} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    logo: {
        color: Colors.secondary,
    },
    iconsContainer: {
        gap:15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 35,
        width: 35,
        borderRadius: 35,
    },
    cartContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default CustomHeader;