import React from 'react';
import { View, ActivityIndicator, FlatList, Text, StyleSheet } from 'react-native';
import ProductItem from './product-item';
import { Colors } from '../../constants/colors';

const ProductList = ({ header, products, loading }) => {

    const renderProductItem = ({ item }) => (
        <ProductItem
            product={item}
        />
    );

    const renderFooter = () => {
        return (
            loading ? <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} /> : null
        );
    };

    const renderEmptyComponent = () => {
        if (!loading) {
            return <Text style={styles.noProductsText}>No products found.</Text>;
        }
        return null;
    };

    return (
        <View style={styles.productListContainer}>
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={header}
                stickyHeaderHiddenOnScroll={header}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmptyComponent} 
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productListContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    noProductsText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.secondary,
        marginVertical: 20,
    },
});

export default ProductList;
