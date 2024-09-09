import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { placeOrder, applyDiscount as applyDiscountCode } from '../../firebase/cheackout';
import { fetchCartData } from '../../firebase/cart';
import { getUserData } from '../../firebase/userData';

const CheckoutPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        getUserData(setUserData, null, setAddress, setPhone);

        const unsubscribe = fetchCartData(setCartItems, setLoading);

        return () => {
            unsubscribe(); // Cleanup on component unmount
        };
    }, []);

    useEffect(() => {
        const shippingCost = 20; // Fixed shipping cost
        const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Sum of item prices * quantities

        const subtotal = itemsTotal + shippingCost; // Subtotal = Items Total + Shipping Cost

        let calculatedTotal = subtotal;

        if (discountApplied) {
            const discountAmount = calculatedTotal * amount;
            calculatedTotal -= discountAmount;
        }

        setTotal(calculatedTotal);
    }, [cartItems, discountApplied, amount]);

    const removeDiscount = () => {
        setDiscountApplied(false);
        setDiscountCode('');
        const shippingCost = 20; // Fixed shipping cost
        const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Sum of item prices * quantities
        const calculatedTotal = itemsTotal + shippingCost;
        setTotal(calculatedTotal); // Recalculate total without discount
    };

    const applyDiscount = async () => {
        await applyDiscountCode({
            discountCode,
            subtotal: total, // Pass the calculated subtotal value
            shipping: 20,  // Fixed shipping cost
            discountApplied,
            setTotal,
            setDiscountApplied,
            setAmount,
            setDiscountCode,
        });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            await placeOrder({
                cartItems,
                subtotal: total - 20, // Pass the total minus shipping cost
                shipping: 20,  // Fixed shipping cost
                total,
                userData,
                address,
                phone,
                paymentMethod,
                discountApplied,
                discountCode,
                amount,
                products: [], // If you have a way to get products, include them here
                setLoading,
                setCartItems,
                navigation,
            });
        } catch (error) {
            ToastAndroid.show('Error placing order', ToastAndroid.SHORT);
        }
    };

    const itemElements = cartItems.map((item) => {
        const discountedPrice = item.quantity > 1 ? item.price * 0.9 : item.price;
        return (
            <View style={styles.item} key={item.id}>
                {item.quantity > 1 && <Text style={styles.note}>10% discount</Text>}
                <View style={styles.itemContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>quantity: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                    ${(discountedPrice * item.quantity).toFixed(2)}
                </Text>
            </View>
        );
    });

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Order Receipt</Text>
                <View style={styles.itemsContainer}>{itemElements}</View>
                <View style={styles.summaryContainer}>
                    <View style={styles.subtotalContainer}>
                        <Text style={styles.subtotalText}>Subtotal:</Text>
                        <Text style={styles.subtotal}>${(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</Text>
                    </View>
                    <View style={styles.shippingContainer}>
                        <Text style={styles.shippingText}>Shipping:</Text>
                        <Text style={styles.shipping}>${20}</Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total:</Text>
                        <Text style={styles.total}>${total.toFixed(2)}</Text>
                    </View>
                    {discountApplied && (
                        <View>
                            <Text style={styles.discountText}>
                                Code '<Text style={styles.discountCode}>{discountCode}</Text>' applied with <Text style={styles.discountAmount}>{amount * 100}%</Text> discount
                            </Text>
                            <TouchableOpacity style={styles.removeDiscountButton} onPress={removeDiscount}>
                                <Text style={styles.removeDiscountText}>Remove Discount</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {confirmed ? (
                    <View style={styles.confirmationContainer}>
                        <Text style={styles.infoTitle}>Your Information</Text>
                        <Text style={styles.infoText}>Address: {address}</Text>
                        <Text style={styles.infoText}>Phone Number: {phone}</Text>
                        <TouchableOpacity onPress={() => { setConfirmed(false); }}>
                            <Text style={styles.changeInfoText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.confirmationInputContainer}>
                        <Text style={styles.infoTitle}>Confirm Your Information</Text>
                        <TextInput
                            style={styles.infoInput}
                            placeholder="Enter your Address"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            textAlignVertical="top"
                        />
                        <TextInput
                            style={styles.infoInput}
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.confirmButton} onPress={() => setConfirmed(true)}>
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.discountContainer}>
                    <TextInput
                        style={styles.discountCodeInput}
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChangeText={setDiscountCode}
                    />
                    <TouchableOpacity style={styles.applyDiscountButton} onPress={applyDiscount}>
                        <Text style={styles.applyDiscountButtonText}>Apply Discount</Text>
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#1DA1F2" style={styles.loadingIndicator} />
                ) : (
                    confirmed && (
                        <View style={styles.placeOrderContainer}>
                            <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                                <Text style={styles.placeOrderButtonText}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#F5F8FA',
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemsContainer: {
        marginBottom: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    note: {
        color: '#FF0000',
        fontSize: 12,
        marginBottom: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#657786',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryContainer: {
        marginBottom: 20,
    },
    subtotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    subtotalText: {
        fontSize: 16,
    },
    subtotal: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    shippingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    shippingText: {
        fontSize: 16,
    },
    shipping: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalText: {
        fontSize: 16,
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    discountText: {
        fontSize: 16,
        marginTop: 10,
    },
    discountCode: {
        fontWeight: 'bold',
    },
    discountAmount: {
        color: '#FF0000',
    },
    removeDiscountButton: {
        marginTop: 5,
        backgroundColor: '#E1E8ED',
        padding: 10,
        borderRadius: 5,
    },
    removeDiscountText: {
        color: '#1DA1F2',
        textAlign: 'center',
    },
    confirmationContainer: {
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16,
        marginVertical: 5,
    },
    changeInfoText: {
        color: '#1DA1F2',
        marginTop: 10,
    },
    confirmationInputContainer: {
        marginTop: 20,
    },
    infoInput: {
        borderWidth: 1,
        borderColor: '#E1E8ED',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
    discountContainer: {
        marginTop: 20,
    },
    discountCodeInput: {
        borderWidth: 1,
        borderColor: '#E1E8ED',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    applyDiscountButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 5,
    },
    applyDiscountButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    placeOrderContainer: {
        marginTop: 20,
    },
    placeOrderButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 5,
    },
    placeOrderButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default CheckoutPage;
