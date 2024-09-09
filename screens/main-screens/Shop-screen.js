import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ProductList from '../../components/products/product-list';
import Filter from '../../components/elements/filter';
import { handleAddToCart } from '../../firebase/cart';
import { getProducts } from '../../firebase/products';
import Footer from '../../components/elements/footer';
import { Colors } from '../../constants/colors';

const Shop = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [filteredPriceRange, setFilteredPriceRange] = useState([0, Infinity]);
    const [sortingMethod, setSortingMethod] = useState(null);
    const [customLowerBound, setCustomLowerBound] = useState('');
    const [customUpperBound, setCustomUpperBound] = useState('');

    useEffect(() => {
        const unsubscribe = getProducts((productsData) => {
            setProducts(productsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const inPriceRange = product.price >= filteredPriceRange[0] && product.price <= filteredPriceRange[1];
            const matchesCategory = !selectedCategory || product.cat === selectedCategory;

            return matchesSearch && inPriceRange && matchesCategory;
        })
        .sort((a, b) => sortingMethod === 'lowToHigh' ? a.price - b.price : b.price - a.price);

    return (
        <View style={styles.container}>
            <ProductList
                header={
                    <Filter
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedPrice={selectedPrice}
                        setSelectedPrice={setSelectedPrice}
                        sortingMethod={sortingMethod}
                        setSortingMethod={setSortingMethod}
                        customLowerBound={customLowerBound}
                        setCustomLowerBound={setCustomLowerBound}
                        customUpperBound={customUpperBound}
                        setCustomUpperBound={setCustomUpperBound}
                        setFilteredPriceRange={setFilteredPriceRange}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                }
                products={filteredProducts}
                loading={loading}
                handleAddToCart={handleAddToCart}
                handleProductPress={() => null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    noResultsText: {
        alignSelf: 'center',
        fontSize: 16,
        color: Colors.secondary,
    },
});

export default Shop;
