import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import OrderList from '../components/orders/order-list';
import { fetchOrders, cancelOrder, updateOrderDoneStatus, updateOrderReadyStatus, deleteOrder } from '../../firebase/mange-orders';
import { Colors } from '../../constants/colors';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOrderId, setSearchOrderId] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const unsubscribe = fetchOrders(setOrders, setLoading);
        return unsubscribe;
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.username.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
        order.id.toLowerCase().startsWith(searchOrderId.toLowerCase()) &&
        ((filter === 'all') ||
            (filter === 'notReady' && order.isReady === 'no') ||
            (filter === 'notDone' && order.done === 'no') ||
            (filter === 'done' && order.done === 'yes' && order.isReady === 'yes') ||
            (filter === 'ready' && order.isReady === 'yes'))
    );

    const handleReadyChange = async (orderId) => {
        const currentIsReady = orders.find((order) => order.id === orderId).isReady;
        const currentDone = orders.find((order) => order.id === orderId).done;
        await updateOrderReadyStatus(orderId, currentIsReady, currentDone);
    };

    const handleDoneChange = async (orderId) => {
        const currentIsReady = orders.find((order) => order.id === orderId).isReady;
        const currentDone = orders.find((order) => order.id === orderId).done;
        await updateOrderDoneStatus(orderId, currentIsReady, currentDone);
    };

    const handleCancelOrder = async (orderId) => {
        await cancelOrder(orderId, orders, setOrders);
    };

    const handleDeleteOrder = async (orderId) => {
        await deleteOrder(orderId, setOrders, orders);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleSearchOrderIdChange = (value) => {
        setSearchOrderId(value);
    };

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    };

    const getTitle = () => {
        if (filter === 'all') {
            return 'All Orders';
        } else if (filter === 'notReady') {
            return 'Orders Not Ready';
        } else if (filter === 'notDone') {
            return 'Orders Not Done';
        } else if (filter === 'done') {
            return 'Completed Orders';
        } else if (filter === 'ready') {
            return 'Orders Ready for Delivery';
        }
    };

    return (
        <View style={styles.container}>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <OrderList
                    header={
                        <>
                            <View style={styles.searchContainer}>
                                <TextInput
                                    placeholder='Search by username'
                                    value={searchQuery}
                                    onChangeText={handleSearchChange}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder='Search by order ID'
                                    value={searchOrderId}
                                    onChangeText={handleSearchOrderIdChange}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.filterContainer}>
                                <TouchableOpacity onPress={() => handleFilterChange('all')} style={styles.filterButton}>
                                    <Text style={styles.filterText}>All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFilterChange('notReady')} style={styles.filterButton}>
                                    <Text style={styles.filterText}>Not Ready</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFilterChange('notDone')} style={styles.filterButton}>
                                    <Text style={styles.filterText}>Not Done</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFilterChange('done')} style={styles.filterButton}>
                                    <Text style={styles.filterText}>Done</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFilterChange('ready')} style={styles.filterButton}>
                                    <Text style={styles.filterText}>Ready</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>{getTitle()}</Text>
                        </>

                    }

                    orders={filteredOrders}
                    onReadyChange={handleReadyChange}
                    onDoneChange={handleDoneChange}
                    onCancelOrder={handleCancelOrder}
                    onDeleteOrder={handleDeleteOrder}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: Colors.background,
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'column',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    input: {
        width: '90%',
        elevation: 3,
        padding: 10,
        borderRadius: 13,
        backgroundColor: "white",
        margin: 10,
    },
    filterContainer: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 10,
    },
    filterButton: {
        backgroundColor: Colors.cardBackground,
        padding: 4,
        borderRadius: 10,
    },
    filterText: {
        fontSize: 15,
    },
    title: {
        padding: 20,
    },
});

export default OrdersPage;
