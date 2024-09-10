// orderBackend.js
import { collection, query, where, onSnapshot,orderBy, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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

export const deleteOrderforUser = async (orderId, paymentMethod, setOrders, orders, setLoading2) => {
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


export const fetchOrders = (setOrders, setLoading) => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('timestamp', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
        setLoading(false);
    });
};

export const deleteOrder = async (orderId, setOrders, orders) => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
    alert(`Order ID: (${orderId}) deleted`);
    setOrders(orders.filter((order) => order.id !== orderId));
};

export const updateOrderReadyStatus = async (orderId, currentIsReady, currentDone) => {
    const orderRef = doc(db, 'orders', orderId);
    if (currentDone === 'yes') {
        alert('Cannot set Ready if order is already done.');
        return;
    }
    await updateDoc(orderRef, {
        isReady: currentIsReady === 'no' ? 'yes' : 'no',
    });
};

export const updateOrderDoneStatus = async (orderId, currentIsReady, currentDone) => {
    const orderRef = doc(db, 'orders', orderId);
    if (currentDone === 'no') {
        await updateDoc(orderRef, { done: 'yes', isReady: 'yes' });
    } else if (currentIsReady === 'no') {
        await updateDoc(orderRef, { done: 'no' });
    } else {
        await updateDoc(orderRef, { done: 'no', isReady: 'yes' });
    }
};

export const cancelOrder = async (orderId, orders, setOrders) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        const orderItems = orderData.items;
        await Promise.all(
            orderItems.map(async (item) => {
                const productRef = doc(db, 'products', item.id);
                const productDoc = await getDoc(productRef);
                if (productDoc.exists()) {
                    const productData = productDoc.data();
                    const newQuantity = productData.quantity + item.quantity;
                    await updateDoc(productRef, { quantity: newQuantity });
                }
            })
        );
        await deleteDoc(orderRef);
        setOrders(orders.filter((order) => order.id !== orderId));
        alert(`Order ID: (${orderId}) canceled`);
    }
};
