import { collection, addDoc, getDocs, getDoc, setDoc, doc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from './config';
import { ToastAndroid } from 'react-native';
import { useState,useEffect } from 'react';
import { Alert } from 'react-native';
// Fetch products from Firestore
export function getProducts(callback) {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
        const productsData = [];
        snapshot.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() });
        });
        callback(productsData);
    }, (error) => {
        console.error('Error getting products from Firestore: ', error);
    });

    return unsubscribe;
}


export async function addToFavorites(product) {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        const favoriteItem = { ...product };

        const favoritesRef = doc(db, "fav", uid);
        try {
            const favoriteDoc = await getDoc(favoritesRef);

            if (favoriteDoc.exists()) {
                const favoriteData = favoriteDoc.data();
                const existingItemIndex = favoriteData.items.findIndex((item) => item.id === favoriteItem.id);

                if (existingItemIndex > -1) {
                    // Item already exists in favorites
                    ToastAndroid.show(`${product.name} already in the favorites.`, ToastAndroid.SHORT);
                } else {
                    // Item doesn't exist in favorites, add it
                    const updatedItems = [...favoriteData.items, favoriteItem];
                    await updateDoc(favoritesRef, { items: updatedItems });
                    ToastAndroid.show(`${product.name} added to favorites.`, ToastAndroid.SHORT);
                }
            } else {
                // Favorites doesn't exist, create it
                await setDoc(favoritesRef, { items: [favoriteItem] });
                ToastAndroid.show(`${product.name} added to favorites.`, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error managing favorites document: ", error);
            ToastAndroid.show('Error adding to favorites.', ToastAndroid.SHORT);
        }
    } else {
        ToastAndroid.show('User not logged in.', ToastAndroid.SHORT);
    }
}


export function getFavorites(callback) {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        const favRef = doc(db, 'fav', uid);

        const unsubscribe = onSnapshot(favRef, (favDoc) => {
            if (favDoc.exists()) {
                const favData = favDoc.data();
                callback(favData.items || []);
            } else {
                callback([]); // If no favorites, return an empty array
            }
        }, (error) => {
            console.error('Error getting favorites document: ', error);
        });

        return unsubscribe;
    } else {
        console.warn('User not logged in.');
        callback([]); // Return an empty array if the user is not logged in
        return () => {}; // No cleanup needed if user is not logged in
    }
}

export function useIsInFavorites(productId) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;

        if (currentUser) {
            const { uid } = currentUser;
            const favoritesRef = doc(db, 'fav', uid);

            const unsubscribe = onSnapshot(favoritesRef, (favDoc) => {
                if (favDoc.exists()) {
                    const favoriteData = favDoc.data();
                    const isFavorite = favoriteData.items.some(item => item.id === productId);
                    setIsFavorite(isFavorite);
                } else {
                    setIsFavorite(false);
                }
            }, (error) => {
                console.error("Error checking favorites document: ", error);
                setIsFavorite(false);
            });

            return () => unsubscribe();
        } else {
            console.warn('User not logged in.');
            setIsFavorite(false);
            return () => {};
        }
    }, [productId]);

    return isFavorite;
}


export async function removeFromFavorites(productId) {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
        const { uid } = currentUser;
        const favoritesRef = doc(db, 'fav', uid);

        try {
            const favoriteDoc = await getDoc(favoritesRef);

            if (favoriteDoc.exists()) {
                const favoriteData = favoriteDoc.data();
                const updatedItems = favoriteData.items.filter(item => item.id !== productId);

                await updateDoc(favoritesRef, { items: updatedItems });
                ToastAndroid.show('Item removed from favorites.', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Favorites document does not exist.', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error managing favorites document: ", error);
            ToastAndroid.show('Error removing from favorites.', ToastAndroid.SHORT);
        }
    } else {
        ToastAndroid.show('User not logged in.', ToastAndroid.SHORT);
    }
}

export async function addProduct(productData) {
    try {
      await addDoc(collection(db, "products"), productData);
    } catch (error) {
      console.error("Error adding product to Firestore: ", error);
    }
  }

  export async function deleteProduct(productId) {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "products", productId));
            } catch (error) {
              console.error("Error deleting product from Firestore: ", error);
            }
          },
          style: "destructive"
        }
      ]
    );
  }

  export async function editProduct(productId, newData) {
    try {
      await updateDoc(doc(db, "products", productId), newData);
    } catch (error) {
      console.error("Error updating product in Firestore: ", error);
    }
  }
