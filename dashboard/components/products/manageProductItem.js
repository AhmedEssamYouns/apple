import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { deleteProduct } from '../../../firebase/products';

export const renderProduct = ({ item, searchQuery, selectedCategory, showOfferOnly, showFavoriteOnly, openEditModal, setSelectedProduct }) => {
    // Apply search filter
    if (searchQuery.length > 0 && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
    }

    // Apply category filter
    if (selectedCategory !== 'All' && item.cat !== selectedCategory) {
        return null;
    }

    // Apply offer filter
    if (showOfferOnly && !item.offer) {
        return null;
    }

    // Apply favorite filter
    if (showFavoriteOnly && item.fav !== 'yes') {
        return null;
    }

    return (
        <View style={styles.productContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "103%", }}>
                <View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>Price: {item.price}</Text>
                    {item.offer && <Text style={styles.productOffer}>Offer: {item.offer}</Text>}
                    <Text style={styles.productCategory}>Category: {item.cat}</Text>
                    <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                    {item.fav === 'yes' && <Text style={styles.productFavorite}>Favorite: Yes</Text>}
                </View>
                {item.image && <Image source={{ uri: item.image }} style={styles.productImage} />}

            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => {
                    setSelectedProduct(item);  // Set the selected product first
                    openEditModal();  // Then open the modal
                }}>
                    <Text style={styles.editButtonText}>Edit</Text>
                    <Feather name='edit' size={20} />
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    productContainer: {
        backgroundColor: 'white',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        elevation: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 16,
        marginBottom: 5,
    },
    productCategory: {
        fontSize: 16,
        marginBottom: 5,
    },
    productQuantity: {
        fontSize: 16,
        marginBottom: 5,
    },
    productOffer: {
        fontSize: 16,
        color: 'green',
        marginBottom: 5,
    },
    productFavorite: {
        fontSize: 16,
        color: 'blue',
        marginBottom: 5,
    },
    productImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 6,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#A9B3C1',
        padding: 6,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editButtonText: {
        fontWeight: 'bold',
    },
});
