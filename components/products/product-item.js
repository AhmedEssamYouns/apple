import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/colors'; // Import colors

const ProductItem = ({ product, handleProductPress, handleAddToCart }) => {
    return (
        <>
            {product.quantity > 0 ? (
                <View key={product.id} style={styles.productCard}>
                    <Image style={styles.productImageContainer} source={{ uri: product.image ? product.image : product.images[0] }} />

                    {product.offer ? (
                        <>
                            <Text style={styles.oldPrice}>${product.price}</Text>
                            <Text style={styles.productPrice2}>${product.offer}</Text>
                        </>
                    ) : (
                        <Text style={styles.productPrice}>${product.price}</Text>
                    )}

                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{product.name}</Text>
                    </View>
                    <View style={styles.addToCartButtonContainer}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => handleProductPress(product)}>
                            <FontAwesome name="info-circle" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, styles.addButton]} onPress={() => handleAddToCart(product)}>
                            <FontAwesome name="cart-plus" size={24} color={Colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View key={product.id} style={styles.productCard}>
                    <Image style={styles.productImageContainer} source={{ uri: product.image }} />
                    {product.offer ? (
                        <>
                            <Text style={styles.oldPrice}>${product.price}</Text>
                            <Text style={styles.productPrice2}>${product.offer}</Text>
                        </>
                    ) : (
                        <Text style={styles.productPrice}>${product.price}</Text>
                    )}

                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{product.name}</Text>
                    </View>
                    <View style={styles.outOfStockContainer}>
                        <Text style={styles.outOfStockText}>Out of stock!</Text>
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
        marginBottom: 20,
        width: '48%',
        height: 290,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 5, height: 0.1 },
        shadowOpacity: 2,
        shadowRadius: 3,
        elevation: 3,
    },
    productImageContainer: {
        height: 190,
        backgroundColor: Colors.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productDetails: {
        paddingTop: 10,
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        color: Colors.secondary,
    },
    productPrice: {
        fontSize: 15,
        color: Colors.secondary,
        position: 'absolute',
        padding: 5,
        margin: 5,
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
    },
    addToCartButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    iconButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginLeft: 8,
    },
    addButton: {
        marginRight: 8,
    },
    addToCartButtonText: {
        fontSize: 17,
        color: Colors.white,
        textAlign: 'center',
    },
    productPrice2: {
        fontSize: 15,
        color: Colors.secondary,
        position: 'absolute',
        margin: 5,
        padding: 5,
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
    },
    oldPrice: {
        fontSize: 18,
        color: Colors.secondary,
        position: 'absolute',
        right: 0,
        padding: 5,
        textDecorationLine: 'line-through',
        backgroundColor: Colors.oldPriceBackground,
        borderRadius: 10,
    },
    outOfStockContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    outOfStockText: {
        fontSize: 16,
        color: Colors.primary,
    },
});

export default ProductItem;
