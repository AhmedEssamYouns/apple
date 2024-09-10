// components/OrderList.js
import React from 'react';
import { FlatList } from 'react-native';
import OrderItem from './order-item';

function OrderList({ orders, onReadyChange, onDoneChange, onCancelOrder, onDeleteOrder, header }) {
    const renderOrderItem = ({ item }) => (
        <OrderItem
            item={item}
            onReadyChange={onReadyChange}
            onDoneChange={onDoneChange}
            onCancelOrder={onCancelOrder}
            onDeleteOrder={onDeleteOrder}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={header}
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
        />
    );
}

export default OrderList;
