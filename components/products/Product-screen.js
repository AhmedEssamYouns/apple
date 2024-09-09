import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import ReviewList from '../Review/Review-list';
import ReviewInput from '../Review/Review-input';
import { fetchReviews, deleteReview, editReview } from '../../firebase/review';
import { Ionicons, Feather } from '@expo/vector-icons';
import { handleAddToCart } from '../../firebase/cart';
import { FIREBASE_AUTH } from '../../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { submitReview } from '../../firebase/review';
import { Colors } from '../../constants/colors';

const ProductScreen = () => {

    const route = useRoute();
    const { product } = route.params || {};
    const productId = product.id;
    const user = FIREBASE_AUTH.currentUser;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editReviewId, setEditReviewId] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);


    useEffect(() => {
        const unsubscribe = fetchReviews(productId, (newReviews) => {
            setReviews(newReviews);
            setLoading(false);

            if (newReviews.length > 0) {
                const totalRating = newReviews.reduce((sum, review) => sum + review.rating, 0);
                const average = totalRating / newReviews.length;
                setAverageRating(average);
            } else {
                setAverageRating(0);
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, [productId]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleReview = async () => {
        try {
            await submitReview(product, review, rating, user, reviews, setHasSubmittedReview);
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleEditReview = async () => {
        try {
            await editReview(editReviewId, rating, review, reviews, setEditReviewId);
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleCancelEditing = () => {
        setEditReviewId(null);
        setRating(0);
        setReview('');
    };

    if (loading) {
        return <ActivityIndicator size="large"style={{top:40}} color={Colors.primary} />;
    }

    const navigation = useNavigation();

    return (
        <>
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            {/* Product Image and Details */}
            <View style={styles.productInfo}>
                <View style={styles.productImageContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate({ pathname: 'image', params: { imageUrl: encodeURIComponent(product.image ? product.image : product.images[0]) } })}>
                        <Image style={styles.productImage} source={{ uri: product.image ? product.image : product.images[0] }} />
                    </TouchableOpacity>
                    <View style={styles.additionalImagesContainer}>
                        {/* Additional images can be rendered here */}
                    </View>
                </View>
                <View style={styles.productDetails}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(product)}>
                            <Ionicons name='heart' color='white' size={25} />
                        </TouchableOpacity>
                    </View>
                    {product.offer ? (
                        <Text style={styles.productPrice}>${product.offer} <Text style={styles.productPrice2}>{product.price}</Text></Text>
                    ) : (
                        <Text style={styles.productPrice}>${product.price}</Text>
                    )}
                    <Text style={styles.productDescription}>{product.disc}</Text>
                    {product.quantity === 2 && <Text style={styles.productPrice}>Only two left in stock!</Text>}
                    {product.quantity === 1 && <Text style={styles.productPrice}>Only one left in stock!</Text>}
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(product)}>
                        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Rating */}
            {averageRating ? (
                <View style={[styles.ratingContainer, { paddingBottom: 10 }]}>
                    {[...Array(Math.round(averageRating))].map((_, i) => (
                        <Ionicons key={i} name="star" size={30} color="#657786" />
                    ))}
                </View>
            ) : (
                <Text style={styles.noRatingText}>No Rating</Text>
            )}

            {/* Reviews Section */}
            <Text style={styles.reviewTitle}>Reviews</Text>
            <View style={{ height: '55%', borderRadius: 30, paddingHorizontal: 10, backgroundColor: Colors.cardBackground, marginHorizontal: 10 }}>
                <ReviewList
                    reviews={reviews}
                    user={user}
                    setEditReviewId={setEditReviewId}
                    setRating={setRating}
                    setReview={setReview}
                    handleDeleteReview={handleDeleteReview}
                />
            </View>
     
           
        </View>
               <KeyboardAvoidingView>
               <ReviewInput
                   rating={rating}
                   setRating={setRating}
                   review={review}
                   setReview={setReview}
                   handleReview={handleReview}
                   handleEditReview={handleEditReview}
                   handleCancelEditing={handleCancelEditing}
                   editReviewId={editReviewId}
               />
           </KeyboardAvoidingView>
           </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    productInfo: {
        flexDirection: 'row',
        padding: 20,
    },
    productImageContainer: {
        flex: 1,
    },
    productImage: {
        borderRadius: 10,
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
    reviewSection: {
        marginTop: 20,
    },
    reviewTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#657786',
        marginBottom: 10,
        paddingLeft: 10,
    },
    cartIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#1DA1F2',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF3B30',
        borderRadius: 50,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProductScreen;
