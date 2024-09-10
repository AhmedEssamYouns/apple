import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { getProducts } from '../../firebase/products';
import { renderProduct } from '../components/products/manageProductItem';
import AddProductModal from '../components/products/add-product-model';
import EditProductModal from '../components/products/edit-product';
import { Colors } from '../../constants/colors';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showOfferOnly, setShowOfferOnly] = useState(false); // New state
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false); // New state
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Function to open modal with selected product data
  const openEditModal = () => {
    setEditModalVisible(true); // Show the modal
  };


  useEffect(() => {
    const unsubscribe = getProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  const applySearch = (query) => {
    setSearchQuery(query);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const showOfferProducts = () => {
    setShowOfferOnly(true);
    setShowFavoriteOnly(false);
  };

  const showFavoriteProducts = () => {
    setShowOfferOnly(false);
    setShowFavoriteOnly(true);
  };

  const showAllProducts = () => {
    setShowOfferOnly(false);
    setShowFavoriteOnly(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          onChangeText={applySearch}
          value={searchQuery}
        />
        <View style={styles.categoryButtons}>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'All' && styles.selectedCategory]}
            onPress={() => filterByCategory('All')}>
            <Text style={styles.categoryButtonText}>All Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'iphones' && styles.selectedCategory]}
            onPress={() => filterByCategory('iphones')}
          >
            <Text style={styles.categoryButtonText}>iPhones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'Watches' && styles.selectedCategory]}
            onPress={() => filterByCategory('watches')}>
            <Text style={styles.categoryButtonText}>Watches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButton, selectedCategory === 'macbooks' && styles.selectedCategory]}
            onPress={() => filterByCategory('macbooks')}>
            <Text style={styles.categoryButtonText}>MacBooks</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, padding: 10 }}>
          <TouchableOpacity style={styles.categoryButton2} onPress={() => setModalVisible(true)}>
            <Text style={styles.categoryButtonText}>Add New Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, showOfferOnly && styles.selectedCategory]}
            onPress={showOfferProducts}
          >
            <Text style={styles.categoryButtonText}>Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, showFavoriteOnly && styles.selectedCategory]}
            onPress={showFavoriteProducts}
          >
            <Text style={styles.categoryButtonText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, !showOfferOnly && !showFavoriteOnly && styles.selectedCategory]}
            onPress={showAllProducts}
          >
            <Text style={styles.categoryButtonText}>any</Text>
          </TouchableOpacity>

        </View>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) =>
            renderProduct({
              item: item,
              searchQuery,
              selectedCategory,
              showOfferOnly,
              showFavoriteOnly,
              openEditModal,
              setSelectedProduct
            })
          }
          keyExtractor={(item) => item.id}
          ListFooterComponent={<View style={{ height: 200 }} />} // Creates space at the bottom
        />
      )}
      <AddProductModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      {selectedProduct && (
        <EditProductModal
          editModalVisible={editModalVisible}
          setEditModalVisible={setEditModalVisible}
          productData={selectedProduct}  // Pass the selected product to the modal
        />
      )}

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    backgroundColor: '#F5F8FA',
  },

  filterContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    alignSelf: 'center'
  },
  categoryButton: {
    backgroundColor: '#A9B3C1',
    paddingVertical: 10,
    borderRadius: 10,
    padding: 5,
    elevation: 4
  },
  categoryButton2: {
    marginTop: 10,
    width: 100,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 10,
    padding: 5,
    elevation: 4
  }, selectedCategory: {
    backgroundColor: Colors.primary
  },
  categoryButtonText: {
    fontSize: 13,
  },
});

export default ProductsPage;
