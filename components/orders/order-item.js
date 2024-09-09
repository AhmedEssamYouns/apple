import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const OrderItem = ({ order, deleteOrder, loading }) => {
  const totalQty = order.items.reduce((acc, item) => acc + item.quantity, 0);

  const itemNames = order.items.map((item) => {
    let discountedPrice = item.quantity > 1 ? item.price - item.price * 0.1 : item.price;

    return (
      <View key={item.name} style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.nameContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name: </Text>{item.name}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Price: </Text>{discountedPrice}
            </Text>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.text}>
              <Text style={styles.label}>Quantity: </Text>{item.quantity}
            </Text>
          </View>
        </View>
      </View>
    );
  });

  return (
    <View key={order.id} style={styles.orderContainer}>
      {order.isReady === 'no' ? (
        <TouchableOpacity onPress={() => deleteOrder(order.id, order.paymentMethod)}>
          <Text style={styles.deleteButtonText}>Cancel Order</Text>
        </TouchableOpacity>
      ) : order.done === 'no' ? (
        <Text style={styles.readyText}>Order is ready for pick up</Text>
      ) : null}

      <Text style={styles.text}>Order ID: <Text style={styles.smallText}>{order.id}</Text></Text>

      <Text style={styles.text}>Items: {totalQty}</Text>

      <View style={styles.itemsWrapper}>
        {itemNames}
      </View>

      <Text style={styles.subtext}>Subtotal: ${order.subtotal}</Text>
      <Text style={styles.subtext}>Shipping: ${order.shipping}</Text>

      <Text style={styles.subtext}>
        Payment Method: {order.paymentMethod === 'Paid by card' ? (
          <Text>Paid by card <Feather name="check-circle" color={Colors.primary} size={10} /></Text>
        ) : order.paymentMethod === 'Paid with balance' ? (
          <Text>Paid with balance <Feather name="check-circle" color={Colors.primary} size={10}/></Text>
        ) : (
          <Text>Pay {order.paymentMethod}</Text>
        )}
      </Text>

      {order.discountCode && (
        <Text style={styles.subtext}>
          Discount Code: "{order.discountCode}" with {order.amount * 100}% discount
        </Text>
      )}

      <Text style={styles.subtext}>Address: {order.Address}</Text>

      <Text style={styles.text}>Total: <Text style={styles.totalPrice}>${order.total}</Text></Text>

      {order.isReady === 'no' ? (
        <View style={styles.shippedContainer}>
          <Text style={styles.shippedText}>Ordered at {new Date(order.timestamp).toLocaleDateString()}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Getting ready</Text>
            <Feather name="package" size={24} color="#657786" />
          </View>
        </View>
      ) : order.done === 'yes' ? (
        <View style={styles.shippedContainer}>
          <Text style={styles.shippedText}>Ordered at {new Date(order.timestamp).toLocaleDateString()}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Shipped</Text>
            <Feather name="check-circle" size={24} color={Colors.primary} />
          </View>
        </View>
      ) : (
        <View style={styles.shippedContainer}>
          <Text style={styles.shippedText}>Ordered at {new Date(order.timestamp).toLocaleDateString()}</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: '#657786' }]}>Shipping</Text>
            <MaterialCommunityIcons name="truck-delivery" size={24} color={Colors.primary} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    borderBottomWidth: 0.5,
    borderColor: Colors.secondary,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
    paddingLeft: 10,
    width: 125,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: 65,
  },
  quantityContainer: {
    flex: 1,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  smallText: {
    fontSize: 12,
  },
  label: {
    color: Colors.primary,
    fontSize: 12,
  },
  deleteButtonText: {
    fontSize: 10,
    color: Colors.textPrimary,
    padding: 5,
    margin: 5,
    alignSelf: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
  },
  readyText: {
    fontSize: 12,
    color: Colors.primary,
    padding: 5,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 10,
  },
  itemsWrapper: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  subtext: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  totalPrice: {
    fontSize: 16,
    color: Colors.primary,
  },
  shippedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  shippedText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 0,
  },
  statusText: {
    fontSize: 16,
    marginRight: 10,
    color: Colors.primary,
  },
});

export default OrderItem;