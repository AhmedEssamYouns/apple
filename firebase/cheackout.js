// checkoutBackend.js

import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from './config';
import { ToastAndroid } from 'react-native';

const Products = async () => {
  try {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    const productsData = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return productsData;
  } catch (error) {
    console.error('Error getting products from Firestore: ', error);
    throw error;
  }
};

export const placeOrder = async ({
  cartItems,
  subtotal ,
  shipping ,
  total,
  userData = {}, // Default to empty object if not provided
  address = '',
  phoneNUMBER = '',
  paymentMethod = '',
  discountApplied = false,
  discountCode = '',
  amount = 0, // Default to 0 if not provided
  subtotal2 = 0, // Default to 0 if not provided
  setLoading,
  setCartItems,
  navigation,
}) => {
  try {
    setLoading(true);
    const products = await Products();
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
      const { uid } = currentUser;
      const ordersCollectionRef = collection(db, 'orders');
      const orderData = {
        userId: uid,
        items: [...cartItems],
        subtotal,
        shipping,
        total,
        timestamp: new Date().toISOString(),
        id: '', // Initialize orderId property
        done: 'no',
        isReady: 'no',
        username: userData.name || '',
        email: userData.email || '',
        Address: address || '',
        Phone: phoneNUMBER || '',
        paymentMethod: paymentMethod || '',
      };

      if (discountApplied) {
        orderData.discountCode = discountCode || '';
        orderData.amount = amount;
        orderData.old = subtotal2;
      }

      const docRef = await addDoc(ordersCollectionRef, orderData);
      await updateDoc(docRef, { id: docRef.id });
      console.log('Order stored with ID: ', docRef.id);

      cartItems.forEach(async (item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          const productRef = doc(db, 'products', product.id);
          const newQuantity = product.quantity - item.quantity;
          await updateDoc(productRef, { quantity: newQuantity });
          console.log(`Updated quantity for product ${product.id} to ${newQuantity}`);
        } else {
          console.log(`Product with ID ${item.id} not found in products array`);
        }
      });

      const cartRef = doc(db, 'carts', uid);
      await updateDoc(cartRef, { items: [] });
      setCartItems([]);

      setLoading(false);
      ToastAndroid.show('Order placed successfully', ToastAndroid.SHORT);
      navigation.navigate('Tabs'); // Ensure 'navigation' is properly defined
    }
  } catch (error) {
    setLoading(false);
    console.error('Error placing order:', error);
    ToastAndroid.show('Error placing order', ToastAndroid.SHORT);
  }
};



export const applyDiscount = async ({
  discountCode,
  subtotal,
  shipping,
  setTotal,
  discountApplied,
  setDiscountApplied,
  setAmount,
  setDiscountCode,
}) => {
  if (discountCode === '') {
    ToastAndroid.show('Please enter a discount code first.', ToastAndroid.SHORT);
    return;
  }

  if (discountApplied) {
    ToastAndroid.show('Discount has already been applied.', ToastAndroid.SHORT);
    return;
  }

  const discountCodesRef = collection(db, 'discountCodes');
  const discountCodeQuery = query(discountCodesRef, where('code', '==', discountCode));

  try {
    const querySnapshot = await getDocs(discountCodeQuery);
    if (!querySnapshot.empty) {
      const discountData = querySnapshot.docs[0].data();
      const discountAmount = subtotal * discountData.amount;
      const discountedTotal = subtotal - discountAmount + shipping;
      setTotal(discountedTotal);
      setDiscountApplied(true);
      setDiscountCode(discountCode);
      setAmount(discountData.amount);
      ToastAndroid.show('Discount applied successfully!', ToastAndroid.SHORT);
    } else {
      setDiscountCode('');
      ToastAndroid.show('Invalid discount code', ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error('Error applying discount:', error);
    ToastAndroid.show('Error applying discount', ToastAndroid.SHORT);
  }
};
