import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductList from '../../components/products/product-list';
import { getFavorites } from '../../firebase/products';
import { Colors } from '../../constants/colors';
import CustomText from '../../components/elements/Customtext';

const FavoritesPage = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getFavorites((favItems) => {
            setFavorites(favItems);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

  
    const renderHeader = () => (
        <CustomText style={styles.header}>Favorites</CustomText>
    );
    return (
        <View style={styles.container}>
            <ProductList
                products={favorites}
                loading={loading}
                header={renderHeader()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingVertical: 10,
    },
    header: {
        fontSize: 24,
        color: Colors.primary,
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default FavoritesPage;
