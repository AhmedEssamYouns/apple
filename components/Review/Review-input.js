import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const ReviewInput = ({ rating, setRating, review, setReview, handleReview, handleEditReview, handleCancelEditing, editReviewId }) => {
  return (
    <View style={styles.reviewForm}>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.ratingStar,
              rating >= num && styles.selectedRatingStar,
            ]}
            onPress={() => setRating(num)}
          >
            <Ionicons
              name="star"
              size={30}
              color={rating >= num ? "#657786" : "#E1E8ED"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        placeholder={editReviewId ? "Update your review" : "Write a review"}
        fontFamily="SunshineRegular"
        value={review}
        onChangeText={setReview}
        required={true}
      />
      <View style={{ flexDirection: "row", alignSelf: 'center' }}>
        {editReviewId ? (
          <>
            <TouchableOpacity
              style={styles.cancelEditingButton}
              onPress={handleCancelEditing}
            >
              <Text style={styles.cancelEditingButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitReviewButton}
              onPress={() => handleEditReview(editReviewId)}
            >
              <Text style={styles.submitReviewButtonText}>Edit Review</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.submitReviewButton}
            onPress={handleReview}
          >
            <Text style={styles.submitReviewButtonText}>Submit Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewForm: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 5,
    borderColor: Colors.secondary,
    borderTopWidth: 2,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2
  },
  ratingContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  ratingStar: {
    marginHorizontal: 5,
  },
  selectedRatingStar: {
    color: '#657786',
  },
  reviewInput: {
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.textSecondary,
    elevation:2,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  submitReviewButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitReviewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelEditingButton: {
    backgroundColor: '#E1E8ED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelEditingButtonText: {
    color: '#657786',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ReviewInput;
