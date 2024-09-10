import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { editProduct } from "../../../firebase/products"; // Import your editProduct function
import * as ImagePicker from 'expo-image-picker';

const EditProductModal = ({ editModalVisible, setEditModalVisible, productData }) => {
    const [editItemId, setEditItemId] = useState(productData.id);
    const [editItemName, setEditItemName] = useState(productData.name);
    const [editItemPrice, setEditItemPrice] = useState(productData.price);
    const [editItemOffer, setEditItemOffer] = useState(productData.offer || '');
    const [editItemQuantity, setEditItemQuantity] = useState(productData.quantity);
    const [editItemFavorite, setEditItemFavorite] = useState(productData.fav);
    const [editItemCategory, setEditItemCategory] = useState(productData.cat);
    const [editItemImage, setEditItemImage] = useState(productData.image || null);


    useEffect(() => {
        if (productData) {
            setEditItemId(productData.id);
            setEditItemName(productData.name);
            setEditItemPrice(productData.price);
            setEditItemOffer(productData.offer || '');
            setEditItemQuantity(productData.quantity);
            setEditItemFavorite(productData.fav);
            setEditItemCategory(productData.cat);
            setEditItemImage(productData.image || null);
        }
    }, [productData]);  // Run this effect when productData changes

    const handleEditProduct = () => {
        const newData = {
            name: editItemName,
            price: editItemPrice,
            offer: editItemOffer,
            quantity: editItemQuantity,
            fav: editItemFavorite,
            cat: editItemCategory,
            image: editItemImage,
        };
        editProduct(editItemId, newData);
        setEditModalVisible(false); // Close the modal after editing
    };

    const pickImage2 = async () => {
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
            setEditItemImage(result.assets[0].uri);
        }
    };


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setEditModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>

                    {/* Image Picker */}
                    <View style={{ padding: 20, gap: 10, flexDirection: "row", alignItems: 'center' }}>
                        <TouchableOpacity style={styles.pickImageButton} onPress={pickImage2}>
                            <Text style={styles.pickImageButtonText}>Pick Image</Text>
                        </TouchableOpacity>
                        {editItemImage && <Image source={{ uri: editItemImage }} style={styles.productImage} />}
                    </View>

                    {/* Product Name */}
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Product Name"
                        onChangeText={setEditItemName}
                        value={editItemName}
                    />

                    {/* Product Price */}
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Price"
                        onChangeText={setEditItemPrice}
                        value={editItemPrice}
                        keyboardType="numeric"
                    />

                    {/* Offer Price */}
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Offer Price (optional)"
                        onChangeText={setEditItemOffer}
                        value={editItemOffer}
                        keyboardType="numeric"
                    />

                    {/* Product Quantity */}
                    <TextInput
                        style={styles.newItemInput}
                        placeholder="Quantity"
                        onChangeText={setEditItemQuantity}
                        value={editItemQuantity}
                        keyboardType="numeric"
                    />

                    {/* Favorite Selection */}
                    <View style={styles.favoriteContainer}>
                        <Text style={styles.favoriteText}>Is it a favorite?</Text>
                        <TouchableOpacity
                            style={[styles.favoriteButton, editItemFavorite === 'yes' && styles.selectedFavorite]}
                            onPress={() => setEditItemFavorite('yes')}
                        >
                            <Text style={styles.favoriteButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.favoriteButton, editItemFavorite === 'no' && styles.selectedFavorite]}
                            onPress={() => setEditItemFavorite('no')}
                        >
                            <Text style={styles.favoriteButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>Category:</Text>
                        <TouchableOpacity
                            style={[styles.categoryButton, editItemCategory === 'iphones' && styles.selectedCategory]}
                            onPress={() => setEditItemCategory('iphones')}
                        >
                            <Text style={styles.categoryButtonText}>iPhones</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.categoryButton, editItemCategory === 'watches' && styles.selectedCategory]}
                            onPress={() => setEditItemCategory('watches')}
                        >
                            <Text style={styles.categoryButtonText}>Watches</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.categoryButton, editItemCategory === 'macbooks' && styles.selectedCategory]}
                            onPress={() => setEditItemCategory('macbooks')}
                        >
                            <Text style={styles.categoryButtonText}>MacBooks</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity style={styles.addButton} onPress={handleEditProduct}>
                        <Text style={styles.addButtonText}>Edit Product</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default EditProductModal;

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    pickImageButton: {
        backgroundColor: '#A9B3C1',
        padding: 10,
        borderRadius: 10,
    },
    pickImageButtonText: {
        fontSize: 16,
    },
    productImage: {
        height: 100,
        width: 100,
        borderRadius: 10,
    },
    newItemInput: {
        borderWidth: 1,
        borderColor: '#A9B3C1',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
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
    },
    selectedFavorite: {
        backgroundColor: '#1DA1F2',
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
        padding: 5,
        borderRadius: 10,
        marginRight: 10,
    },
    selectedCategory: {
        backgroundColor: '#1DA1F2',
    },
    categoryButtonText: {
        fontSize: 12,
    },
    addButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        color: 'white',
    },
};
