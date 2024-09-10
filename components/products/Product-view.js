import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import CustomText from '../elements/Customtext';

const ProductView = ({ product, navigation, addToFavorites, handleAddToCart, averageRating }) => {
    return (
        <View style={{ backgroundColor: Colors.background }}>
            {/* Product Image and Details */}
            <View style={styles.productInfo}>
                <View style={styles.productImageContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ImageScreen', { imageUri: product.image })}
                    >
                        <Image style={styles.productImage} source={{ uri: product.image ? product.image : product.images[0] }} />
                    </TouchableOpacity>
                    <View style={styles.additionalImagesContainer}>
                        {/* Additional images can be rendered here */}
                    </View>
                </View>
                <View style={styles.productDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(product)}>
                            <Ionicons name='heart' color={Colors.textSecondary} style={{ elevation: 3 }} size={35} />
                        </TouchableOpacity>
                    </View>
                    {product.offer ? (
                        <Text style={styles.productPrice}>
                            ${product.offer} <Text style={styles.productPrice2}>{product.price}</Text>
                        </Text>
                    ) : (
                        <Text style={styles.productPrice}>${product.price}</Text>
                    )}
                    <Text style={styles.productDescription}>{product.disc}</Text>
                    {product.quantity === 2 && <Text style={styles.productPrice}>Only two left in stock!</Text>}
                    {product.quantity === 1 && <Text style={styles.productPrice}>Only one left in stock!</Text>}
                    {product.quantity != 0 ?
                        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(product)}>
                            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ backgroundColor: Colors.cardBackground ,alignItems:'center',borderRadius:5}}>
                            <CustomText style={{fontSize:15,padding:5}}>Product out of stock</CustomText>
                        </View>
                    }
                </View>
            </View>

            {/* Rating */}
            {averageRating ? (
                <View style={[styles.ratingContainer, { paddingBottom: 10 }]}>
                    {[...Array(Math.round(averageRating))].map((_, i) => (
                        <Ionicons key={i} name='star' size={30} color='#657786' />
                    ))}
                </View>
            ) : (
                <Text style={styles.noRatingText}>No Rating</Text>
            )}

            <CustomText style={styles.reviewTitle}>Reviews</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    productInfo: {
        flexDirection: 'row',
        padding: 20,
    },
    productImageContainer: {
        width: 150, backgroundColor: 'white',
        borderRadius: 10,
        elevation: 1,
    },
    productImage: {
        borderRadius: 10,
        resizeMode: 'contain',
        width: '100%',
        height: 200,
    },
    additionalImagesContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    productDetails: {
        flex: 2,
        paddingLeft: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#657786',
    },
    favoriteButton: {
        position: 'absolute',
        right: 10,
    },
    productPrice: {
        fontSize: 18,
        color: '#1DA1F2',
    },
    productPrice2: {
        textDecorationLine: 'line-through',
        color: '#AAB8C2',
    },
    productDescription: {
        fontSize: 16,
        color: '#657786',
        marginVertical: 10,
    },
    addToCartButton: {
        backgroundColor: '#1DA1F2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    ratingContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
    },
    noRatingText: {
        fontSize: 16,
        color: '#657786',
        textAlign: 'center',
    },
    reviewTitle: {
        fontSize: 22,
        color: '#657786',
        marginBottom: 10,
        paddingLeft: 20,
    },
});

export default ProductView;
