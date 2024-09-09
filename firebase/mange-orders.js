// orderBackend.js
import { collection, query, where, onSnapshot, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db,FIREBASE_AUTH } from './config';
import { ToastAndroid } from 'react-native';

export const getOrders = (setOrders, setLoading) => {
  const currentUser = FIREBASE_AUTH.currentUser;

  if (currentUser) {
    const { uid } = currentUser;
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('userId', '==', uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userOrders = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        userOrders.push(orderData);
      });

      // Sort orders by timestamp
      userOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(userOrders);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
    });

    return unsubscribe;
  }
};

export const deleteOrder = async (orderId, paymentMethod, setOrders, orders, setLoading2) => {
  try {
    let refundMessage = '';

    if (paymentMethod === 'Paid by card' || paymentMethod === 'Paid with balance') {
      refundMessage = paymentMethod === 'Paid by card' 
        ? 'Your money will be transferred to your balance in the app.'
        : 'Your balance will be refunded.';
    }

    // Delete order process
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      const orderItems = orderData.items;

      // Adjust product quantities
      await Promise.all(orderItems.map(async (item) => {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const newQuantity = productData.quantity + item.quantity;
          await updateDoc(productRef, { quantity: newQuantity });
        }
      }));

      // Delete order
      await deleteDoc(orderRef);
      setOrders(orders.filter((order) => order.id !== orderId));

      ToastAndroid.showWithGravity(
        `Order canceled. ${refundMessage}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  } catch (error) {
    console.error('Error canceling order:', error);
    ToastAndroid.showWithGravity(
      'An error occurred while canceling the order.',
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  } finally {
    setLoading2(false);
  }
};
