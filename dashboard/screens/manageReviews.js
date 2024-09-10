import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchAllReviews, deleteReview } from '../../firebase/review';
import { Colors } from '../../constants/colors';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = fetchAllReviews(setReviews, setLoading);
        return unsubscribe;
    }, []);

    const handleSearchTermChange = (value) => {
        const searchTerm = value.toLowerCase();
        setSearchTerm(searchTerm);
        const filteredReviews = reviews.filter((review) =>
            review.productId.toLowerCase().startsWith(searchTerm) ||
            review.productName.toLowerCase().startsWith(searchTerm)
        );
        setFilteredReviews(filteredReviews);
    };

    const handleDeleteReview = (reviewId) => {
        deleteReview(reviewId)
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.label}>Search by Product ID or Name:</Text>
                <TextInput
                    style={styles.input}
                    value={searchTerm}
                    placeholder='Search by Product ID or Name..'
                    onChangeText={handleSearchTermChange}
                />
            </View>
            {filteredReviews.length === 0 ? (
                <Text>No reviews found.</Text>
            ) : (
                <FlatList
                    data={filteredReviews}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.review}>
                            <Text>Product ID: {item.productId}</Text>
                            <Text>Product Name: {item.productName}</Text>
                            <Text>Rating: {item.rating}</Text>
                            <Text>Comment: {item.comment}</Text>
                            <Text>Name: {item.name}</Text>
                            <Text>User email: {item.pass}</Text>
                            <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleDeleteReview(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F8FA',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 13,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    review: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
    listContent: {
        flexGrow: 1,
    },
});

export default ReviewsPage;
