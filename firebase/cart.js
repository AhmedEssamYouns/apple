// cartBackend.js
import { collection, doc, getDoc, onSnapshot, updateDoc, setDoc, } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from './config';
import Toast, { ALERT_TYPE } from 'react-native-alert-notification';
import { ToastAndroid } from 'react-native';

export async function handleAddToCart(product) {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        let newPrice = product.offer ? Number(product.offer) : product.price;
        const cartItem = { id: product.id, name: product.name, image: product.image, price: newPrice, quantity: 1, Ava: product.quantity };

        const cartRef = doc(db, "carts", uid);
        try {
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                const existingItemIndex = cartData.items.findIndex((item) => item.id === cartItem.id);
                const updatedItems = [...cartData.items];

                if (existingItemIndex > -1) {
                    if (updatedItems[existingItemIndex].quantity < 10 && updatedItems[existingItemIndex].quantity < product.quantity) {
                        updatedItems[existingItemIndex].quantity += 1;
                        await updateDoc(cartRef, { items: updatedItems });
                        ToastAndroid.show(`${product.name} quantity updated in cart.`, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Item already has the maximum quantity in cart.', ToastAndroid.LONG);
                    }
                } else {
                    const newItems = [...cartData.items, cartItem];
                    await updateDoc(cartRef, { items: newItems });
                    ToastAndroid.show(`${product.name} added to cart.`, ToastAndroid.SHORT);
                }
            } else {
                await setDoc(cartRef, { items: [cartItem] });
                ToastAndroid.show(`${product.name} added to cart.`, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error getting cart document: ", error);
            ToastAndroid.show('Error adding item to cart.', ToastAndroid.LONG);
        }
    } else {
        ToastAndroid.show('You must be logged in to add items to the cart.', ToastAndroid.LONG);
    }
}

export const getProductsForCart = (setProducts, setCartItems) => {
    const productsRef = collection(db, "products");

    const unsubscribe = onSnapshot(productsRef, async (snapshot) => {
        const productsData = [];
        snapshot.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() });
        });

        const currentUser = FIREBASE_AUTH.currentUser;

        if (currentUser) {
            const { uid } = currentUser;
            const cartRef = doc(db, "carts", uid);

            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                const removedItems = [];
                const updatedCartItems = cartData.items.filter((item) => {
                    const product = productsData.find((p) => p.id === item.id);
                    if (product && product.quantity === 0) {
                        removedItems.push(product.name);
                        return false;
                    }
                    return true;
                });

                if (removedItems.length > 0) {
                    Alert.alert(`Items '${removedItems.join(", ")}' removed due to being out of stock.`);
                }

                updateDoc(cartRef, { items: updatedCartItems })
                    .catch((error) => console.error("Error updating cart items:", error));

                setCartItems(updatedCartItems);
            }
        }

        setProducts(productsData);
    }, (error) => {
        console.error("Error fetching products:", error);
    });

    return unsubscribe;
};





export const getCartItems = (setCartItems) => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        const cartRef = doc(db, "carts", uid);

        const unsubscribe = onSnapshot(cartRef, (cartDoc) => {
            if (cartDoc.exists()) {
                const cartData = cartDoc.data();
                setCartItems(cartData.items);
            }
        }, (error) => {
            console.error("Error fetching cart items:", error);
        });

        return unsubscribe;
    }
};




export const updateCartItems = (updatedCartItems) => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        const cartRef = doc(db, "carts", uid);

        updateDoc(cartRef, { items: updatedCartItems })
            .catch((error) => {
                console.error("Error updating cart items:", error);
            });
    }
};



// Function to fetch and monitor cart data
export const fetchCartData = (setCartItems, setIsLoading) => {
  const currentUser = FIREBASE_AUTH.currentUser;

  if (currentUser) {
    const { uid } = currentUser;
    const cartRef = doc(db, 'carts', uid);

    const unsubscribe = onSnapshot(cartRef, (cartDoc) => {
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        setCartItems(cartData.items || []); // Ensure items is set as an empty array if undefined
        setIsLoading(false);
      } else {
        console.log('No cart data found');
        setCartItems([]);
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Error getting cart document:', error);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }
};

// Function to calculate total items in the cart
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
};