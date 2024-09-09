import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getProducts } from '../../firebase/products';
import ProductItem from '../../components/products/product-item';
import Footer from '../../components/elements/footer';
import { Colors } from '../../constants/colors'; // Import colors
import { handleAddToCart } from '../../firebase/cart';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getProducts((productsData) => {
            setProducts(productsData);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const renderProductItems = (filterCondition) => {
        return products.filter(filterCondition).map((product) => (
            <ProductItem
                key={product.id}
                product={product}
                handleProductPress={() => {/* Handle product press */ }}
                handleAddToCart={handleAddToCart}
            />
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>
                    Welcome to <Text style={styles.brandText}>Apple</Text>Store
                </Text>
                <Text style={styles.niceWords}>
                    Discover our latest products and find the perfect device for you.
                </Text>
            </View>

            <View style={styles.categoriesContainer2}>
                <Text style={styles.niceWords2}>
                    Unlock up to <Text style={styles.discountText}>10%</Text> discount
                </Text>
                <Text style={styles.niceWords2}>when purchasing 2 or more of an item!</Text>
            </View>

            <View style={styles.bestSellingContainer}>
                <Text style={styles.bestSellingTitle}>Best Selling</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                ) : (
                    <View style={styles.productListContainer}>
                        {renderProductItems(product => product.fav === 'yes')}
                    </View>
                )}
            </View>

            <View style={styles.bestSellingContainer}>
                <Text style={styles.bestSellingTitle}>Offers</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                ) : (
                    <View style={styles.productListContainer}>
                        {renderProductItems(product => product.offer)}
                        {products.filter(product => !product.offer).length === products.length && (
                            <Text style={styles.noOffersText}>No offers available</Text>
                        )}
                    </View>
                )}
            </View>

            <Footer />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: 30,
    },
    welcomeContainer: {
        marginBottom: 30,
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 19,
        color: Colors.secondary,
        marginBottom: 10,
    },
    brandText: {
        color: Colors.primary,
        fontSize: 20,
    },
    niceWords: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    niceWords2: {
        fontSize: 14,
        color: Colors.secondary,
        alignSelf: 'center',
    },
    discountText: {
        color: Colors.primary,
        fontSize: 18,
    },
    categoriesContainer2: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        elevation: 1,
        padding: 10,
        borderRadius: 12,
    },
    bestSellingContainer: {
        marginBottom: 30,
    },
    bestSellingTitle: {
        fontSize: 20,
        color: Colors.secondary,
        marginBottom: 10,
    },
    follow: {
        fontSize: 20,
        color: Colors.secondary,
        marginBottom: 10,
        alignSelf: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 50,
    },
    socialIcon: {
        marginHorizontal: 10,
    },
    loader: {
        alignSelf: 'center',
        height: 100,
    },
    noOffersText: {
        textAlign: 'center',
        color: Colors.secondary,
        fontSize: 16,
    },
    productListContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
});

export default HomeScreen;
