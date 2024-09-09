import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getProducts } from '../../firebase/products';
import ProductItem from '../../components/products/product-item';
import Footer from '../../components/elements/footer';
import { Colors } from '../../constants/colors'; // Import colors
import { handleAddToCart } from '../../firebase/cart';
import CustomText from '../../components/elements/Customtext';

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
                handleProductPress={() => {
                    navigation.navigate('Product', { product: product })
                 }}
                handleAddToCart={handleAddToCart}
            />
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.welcomeContainer}>
                <CustomText style={styles.welcomeCustomText}>
                    Welcome to <CustomText style={styles.brandCustomText}>Apple</CustomText>Store
                </CustomText>
            </View>

            <View style={styles.categoriesContainer2}>
                <CustomText style={styles.niceWords2}>
                    Unlock up to <CustomText style={styles.discountCustomText}>10%</CustomText> discount
                </CustomText>
                <CustomText style={styles.niceWords2}>when purchasing 2 or more of an item!</CustomText>
            </View>

            <View style={styles.bestSellingContainer}>
                <CustomText style={styles.bestSellingTitle}>Best Selling</CustomText>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                ) : (
                    <View style={styles.productListContainer}>
                        {renderProductItems(product => product.fav === 'yes')}
                    </View>
                )}
            </View>

            <View style={styles.bestSellingContainer}>
                <CustomText style={styles.bestSellingTitle}>Offers</CustomText>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                ) : (
                    <View style={styles.productListContainer}>
                        {renderProductItems(product => product.offer)}
                        {products.filter(product => !product.offer).length === products.length && (
                            <CustomText style={styles.noOffersCustomText}>No offers available</CustomText>
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
    welcomeCustomText: {
        fontSize: 19,
        color: Colors.secondary,
        marginBottom: 10,
    },
    brandCustomText: {
        color: Colors.primary,
        fontSize: 20,
    },
    niceWords: {
        fontSize: 16,
        color: Colors.secondary,
    },
    niceWords2: {
        fontSize: 14,
        color: Colors.secondary,
        alignSelf: 'center',
    },
    discountCustomText: {
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
    noOffersCustomText: {
        CustomTextAlign: 'center',
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
