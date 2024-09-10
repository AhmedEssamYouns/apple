import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { getOrders, deleteOrder, deleteOrderforUser } from '../../firebase/mange-orders'
import OrdersList from '../../components/orders/order-list';
import { Colors } from '../../constants/colors';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false); // For handling loading when deleting

    useEffect(() => {
        const unsubscribe = getOrders(setOrders, setLoading);
        return unsubscribe; // Unsubscribe on unmount
    }, []);

    // Function to show the alert before deleting
    const handleDeleteOrder = (orderId, paymentMethod) => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: () => {
                        setLoading2(true);
                        deleteOrderforUser(orderId, paymentMethod, setOrders, orders, setLoading2);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return (
            <View style={{ backgroundColor: Colors.background, flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <OrdersList
            orders={orders}
            deleteOrder={handleDeleteOrder}
        />
    );
};

export default OrderPage;
