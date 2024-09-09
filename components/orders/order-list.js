import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderItem from './order-item';
import { Colors } from '../../constants/colors';
import CustomText from '../elements/Customtext';

const OrdersList = ({ orders, deleteOrder }) => {
  const renderItem = ({ item }) => (
    <OrderItem order={item} deleteOrder={deleteOrder} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <CustomText style={styles.headerText}>You have </CustomText>
            <Text style={{ color: Colors.primary,fontSize:20,alignSelf:'center' }}>{orders.length}</Text>
            <CustomText style={styles.headerText}> {orders.length === 1 ? 'order' : 'orders'}</CustomText>
          </View>
        }
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingVertical: 10,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignSelf: 'center',
justifyContent:'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    alignSelf:'center',
    justifyContent:'center',
    fontSize: 18,
    color: Colors.textPrimary,
  },
});

export default OrdersList;
