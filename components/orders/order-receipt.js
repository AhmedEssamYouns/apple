import React from 'react';
import { View, Text, } from 'react-native';
import { StyleSheet } from 'react-native';

const ItemList = ({ cartItems }) => {
    return cartItems.map((item) => {
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
};


const styles = StyleSheet.create({

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
    }
})

export default ItemList;
