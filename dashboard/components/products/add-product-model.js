import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addProduct } from '../../../firebase/products';

const AddProductModal = ({ modalVisible, setModalVisible }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemOffer, setNewItemOffer] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [newItemFavorite, setNewItemFavorite] = useState('no');
    const [newItemCategory, setNewItemCategory] = useState('iphones');
    const [newItemImage, setNewItemImage] = useState(null);
    const pickImage = async () => {
        // Request permission to access the gallery
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please grant permission to access the gallery');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewItemImage(result.assets[0].uri);
        }
    };

    const handleAddProduct = () => {
        // Check if all required fields are filled
        if (!newItemName || !newItemPrice || !newItemQuantity || !newItemImage) {
            Alert.alert('Missing Information', 'Please fill in all required fields (Name, Price, Quantity, and Image)');
            return;
        }

        // Convert price and quantity to numbers
        const price = parseFloat(newItemPrice);
        const quantity = parseInt(newItemQuantity);

        // Check if price and quantity are valid numbers
        if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            Alert.alert('Invalid Information', 'Price and Quantity must be valid numbers greater than zero');
            return;
        }

        const productData = {
            name: newItemName,
            price: price.toString(), // Convert back to string
            offer: newItemOffer,
            quantity: quantity.toString(), // Convert back to string
            fav: newItemFavorite,
            cat: newItemCategory,
            image: newItemImage,
        };

        addProduct(productData)
            .then(() => {
                Alert.alert('Success', 'Product added successfully');
                // Reset input fields and modal state after adding the product
                setNewItemName('');
                setNewItemPrice('');
                setNewItemOffer('');
                setNewItemQuantity('');
                setNewItemFavorite('no');
                setNewItemCategory('iphones');
                setNewItemImage(null);
                setModalVisible(false);
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to add product. Please try again later.');
                console.error(error);
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
                            <Text style={styles.pickImageButtonText}>Pick Image</Text>
                        </TouchableOpacity>
                        {newItemImage &&
                            <Image source={{ uri: newItemImage }} style={styles.productImage} />}
                    </View>
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Product Name"
                        onChangeText={setNewItemName}
                        value={newItemName}
                    />
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Price"
                        onChangeText={setNewItemPrice}
                        value={newItemPrice}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Offer Price (optional)"
                        onChangeText={setNewItemOffer}
                        value={newItemOffer}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Quantity"
                        onChangeText={setNewItemQuantity}
                        value={newItemQuantity}
                        keyboardType="numeric"
                    />
                    <View style={styles.favoriteContainer}>
                        <Text style={styles.favoriteText}>Is it a favorite?</Text>
                        <TouchableOpacity
                            style={[styles.favoriteButton, newItemFavorite === 'yes' && styles.selectedFavorite]}
                            onPress={() => setNewItemFavorite('yes')}
                        >
                            <Text style={styles.favoriteButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.favoriteButton, newItemFavorite === 'no' && styles.selectedFavorite]}
                            onPress={() => setNewItemFavorite('no')}
                        >
                            <Text style={styles.favoriteButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>Category:</Text>
                        <TouchableOpacity
                            style={[styles.categoryButton, newItemCategory === 'iphones' && styles.selectedCategory]}
                            onPress={() => setNewItemCategory('iphones')}
                        >
                            <Text style={styles.categoryButtonText}>iPhones</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.categoryButton, newItemCategory === 'watches' && styles.selectedCategory]}
                            onPress={() => setNewItemCategory('watches')}
                        >
                            <Text style={styles.categoryButtonText}>Watches</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.categoryButton, newItemCategory === 'macbooks' && styles.selectedCategory]}
                            onPress={() => setNewItemCategory('macbooks')}
                        >
                            <Text style={styles.categoryButtonText}>MacBooks</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
                        <Text style={styles.addButtonText}>Add Product</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    imageContainer: {
        padding: 20,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickImageButton: {
        backgroundColor: '#1DA1F2',
        padding: 10,
        borderRadius: 5,
    },
    pickImageButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    productImage: {
        height: 100,
        width: 100,
        borderRadius: 10,
        marginLeft: 10,
    },
    newItemInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        padding: 10,
    },
    favoriteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    favoriteText: {
        fontSize: 16,
        marginRight: 10,
    },
    favoriteButton: {
        backgroundColor: '#A9B3C1',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        elevation: 4,
    },
    selectedFavorite: {
        backgroundColor: '#1DA1F2', // Change color for selected state
    },
    favoriteButtonText: {
        fontSize: 16,
        color: 'white',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        marginRight: 10,
    },
    categoryButton: {
        backgroundColor: '#A9B3C1',
        borderRadius: 10,
        marginRight: 10,
        elevation: 4,
        padding: 10,
    },
    selectedCategory: {
        backgroundColor: '#1DA1F2', // Change color for selected state
    },
    categoryButtonText: {
        fontSize: 12,
        color: 'white',
    },
    addButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 10,
        elevation: 4,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        color: 'white',
    },
});

export default AddProductModal;
