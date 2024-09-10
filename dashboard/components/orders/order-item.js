// components/OrderItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomText from '../../../components/elements/Customtext';
import { Colors } from '../../../constants/colors';

function OrderItem({ item, onReadyChange, onDoneChange, onCancelOrder, onDeleteOrder }) {
    return (
        <View style={styles.orderContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.orderText}>ID: {item.id}</Text>
                {item.isReady === 'no' ? (
                    <Feather name='package' size={23} />
                ) : (
                    <>
                        {item.done === 'yes' ? (
                            <Feather name='check-circle' color='#1DA1F2' size={23} />
                        ) : (
                            <Feather name='truck' color='orange' size={23} />
                        )}
                    </>
                )}
            </View>
            <View style={styles.infoContainer}>
                <CustomText style={styles.orderText}>user info:</CustomText>
                <Text style={styles.orderText}>Username: {item.username}</Text>
                <Text style={styles.orderText2}>Address: {item.Address}</Text>
            </View>
            <View style={styles.itemsContainer}>
                <CustomText style={styles.orderText}>Items:</CustomText>
                {item.items.map((itemDetail) => (
                    <Text key={itemDetail.productId} style={styles.orderText2}>
                        {itemDetail.name} x quantity: ({itemDetail.quantity}) - price: {itemDetail.price}
                    </Text>
                ))}
            </View>
            <View style={styles.detailsContainer}>
                <CustomText style={styles.orderText}>order details:</CustomText>
                <Text style={styles.orderText2}>Date: {new Date(item.timestamp).toLocaleString()}</Text>
                <Text style={styles.orderText}>Discount Code: {item.discountCode || 'No discount'}</Text>
                <Text style={styles.orderText}>Total: ${item.total}</Text>
            </View>
            <View style={styles.stateContainer}>
                <CustomText style={styles.orderText}>Order State:</CustomText>
                <Text style={styles.orderText}>Ready: {item.isReady}</Text>
                <Text style={styles.orderText}>Done: {item.done}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onReadyChange(item.id)} style={styles.button}>
                    <Text style={styles.buttonText}>{item.isReady === 'no' ? 'Set Ready' : 'Set not Ready'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDoneChange(item.id)} style={styles.button}>
                    <Text style={styles.buttonText}>{item.done === 'no' ? 'Set Done' : 'Set not Done'}</Text>
                </TouchableOpacity>
                {item.done === 'yes' ? (
                    <TouchableOpacity onPress={() => onDeleteOrder(item.id)} style={styles.deleteButton}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => onCancelOrder(item.id)} style={styles.cancelButton}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orderContainer: {
        width:'90%',
        alignSelf:'center',
        marginBottom: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#B9C6D0',
        backgroundColor: '#ffff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    orderText: {
        // Add any additional styling here
    },
    orderText2: {
        // Add any additional styling here
    },
    infoContainer: {
        backgroundColor: Colors.cardBackground,
        padding: 10,
        borderRadius: 10,
        margin: 5,
        elevation: 1,
    },
    itemsContainer: {
        padding: 4,
        borderRadius: 10,
        margin: 5,
    },
    detailsContainer: {
        padding: 4,
        borderRadius: 10,
        margin: 5,
    },
    stateContainer: {
        padding: 4,
        borderRadius: 10,
        margin: 5,
    },
    buttonContainer: {
        gap: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 5,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: 'lightcoral',
        padding: 5,
        borderRadius: 10,
    },
    cancelButton: {
        backgroundColor: 'lightgreen',
        padding: 5,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
    },
});

export default OrderItem;
