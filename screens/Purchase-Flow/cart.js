import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { calculateCartTotal, getProductsForCart, updateCartItems, removeAllItemsFromCart, removeItemFromCart } from '../../firebase/cart'; // Import new function
import { Colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigation = useNavigation()
    // Fetch products and cart items
    useEffect(() => {
        const unsubscribe = getProductsForCart(setProducts, setCartItems);
        return () => {
            unsubscribe();
        };
    }, []);

    const incrementQuantity = (itemId) => {
        const product = products.find(p => p.name === itemId);
        if (!product) return;

        const updatedCartItems = cartItems.map(item => {
            if (item.name === itemId && item.quantity < 10 && item.quantity < product.quantity) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        updateCartItems(updatedCartItems);
    };

    const decrementQuantity = (itemId) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        updateCartItems(updatedCartItems);
    };

    // Remove individual item from the cart
    const handleRemoveItem = (itemId) => {
        removeItemFromCart(itemId, setCartItems); // Use the new function
    };

    const handleRemoveAllItems = () => {
        removeAllItemsFromCart(setCartItems);
    };

    const totalItems = calculateCartTotal(cartItems);

    const totalPrice = cartItems.reduce((acc, item) => {
        let itemTotal = item.quantity * item.price;
        if (item.quantity >= 2) {
            itemTotal *= 0.9;
        }
        return acc + itemTotal;
    }, 0);

    return (
        <View style={styles.container}>
            <AlertNotificationRoot>
                <ScrollView contentContainerStyle={styles.scrollview}>
                    <Text style={styles.noitems}>You have <Text style={{ color: Colors.primary }}>{totalItems}</Text> products in your cart.</Text>

                    {cartItems.length === 0 ? (
                        <Text style={styles.noitems}>Your cart is empty</Text>
                    ) : (
                        cartItems.map(item => (
                            <View key={item.id} style={styles.item}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.details}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.price}>${item.price}</Text>

                                </View>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => decrementQuantity(item.id)}>
                                        <Feather name="minus" size={18} color={Colors.secondary} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{item.quantity}</Text>
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => incrementQuantity(item.name)}>
                                        <Feather name="plus" size={18} color={Colors.secondary} />
                                    </TouchableOpacity>
                                </View>
                                {/* Remove item icon */}
                                <TouchableOpacity style={{ padding: 10, position: 'absolute', bottom: 0, left: -5 }} onPress={() => handleRemoveItem(item.id)}>
                                    <MaterialCommunityIcons name="trash-can" size={24} color={Colors.secondary} />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </ScrollView>

                {cartItems.length > 0 && (
                    <>
                        <TouchableOpacity style={styles.removeallButton} onPress={handleRemoveAllItems}>
                            <Text style={styles.removeallButtonText}>Remove all items from cart</Text>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.total}>Total price: ${totalPrice}</Text>
                            <TouchableOpacity style={styles.checkoutButton} onPress={() =>navigation.navigate('checkout')}>
                                <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </AlertNotificationRoot>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: Colors.background,
    },
    scrollview: {
        flexGrow: 1,
    },
    noitems: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
        color: Colors.textSecondary,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
        elevation: 1,
    },
    image: {
        width: '35%',
        height: '100%',
        resizeMode: 'stretch',
    },
    details: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.cardBackground,
    },
    title: {
        fontSize: 15,
        marginBottom: 10,
        color: Colors.textPrimary,
    },
    price: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.primary,
    },
    checkoutButton: {
        marginTop: 15,
        backgroundColor: Colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'center',
    },
    checkoutButtonText: {
        color: Colors.background,
        fontSize: 20,
        textAlign: 'center',
    },
    removeallButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 9999,
        paddingVertical: 10,
        width: '70%',
        alignSelf: 'center',
        marginVertical: 20,
    },
    removeallButtonText: {
        color: Colors.background,
        alignSelf: 'center',
        fontSize: 13,
    },
    footer: {
        width: 200,
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        paddingVertical: 10,
        alignItems: 'center',
    },
    total: {
        fontSize: 20,
        marginBottom: 10,
        color: Colors.textPrimary,
    },
    quantityControls: {
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: 20,
        right: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 20,
        marginHorizontal: 10,
        color: Colors.primary,
    },
});

export default CartScreen;
