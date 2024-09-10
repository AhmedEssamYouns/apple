import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const ReviewInput = ({ rating, setRating, review, setReview, handleReview, handleEditReview, handleCancelEditing, editReviewId }) => {

  const onSubmitReview = () => {
    if (handleReview) {
      handleReview();
      Keyboard.dismiss();
    }
  };

  const isSubmitDisabled = rating === 0 || review.trim() === '';

  return (
    <View style={styles.reviewForm}>
      <KeyboardAvoidingView style={styles.reviewInputContainer}>
        <TextInput
          placeholder={editReviewId ? "Update your review" : "Write a review"}
          value={review}
          onChangeText={setReview}
          style={styles.textInput}
          numberOfLines={2}
          placeholderTextColor="#B0B0B0"
        />
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
                size={28}
                color={rating >= num ? "#FFD700" : "#D3D3D3"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          {editReviewId ? (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEditing}
              >
                <Feather
                  name='x-circle'
                  color={'#FF6F6F'}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitReviewButtonEdit, isSubmitDisabled && styles.disabledButton]}
                onPress={() => { handleEditReview(editReviewId), Keyboard.dismiss() }}
                disabled={isSubmitDisabled}
              >
                <Text style={styles.submitReviewButtonTextEdit}>Update</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.submitReviewButton, isSubmitDisabled && styles.disabledButton]}
              onPress={onSubmitReview}
              disabled={isSubmitDisabled}
            >
              <Text style={styles.submitReviewButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewForm: {
    zIndex:2,
    borderRadius: 10,
    elevation: 4,
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ratingStar: {
    marginHorizontal: 3,
  },
  selectedRatingStar: {
    color: '#FFD700',
  },
  reviewInputContainer: {
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    elevation: 1,
  },
  textInput: {
    width: '100%',
    height: 40,
    fontSize: 16,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  submitReviewButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  submitReviewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  submitReviewButtonEdit: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  submitReviewButtonTextEdit: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cancelButton: {
    padding: 5,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0', // Change button color when disabled
  },
});

export default ReviewInput;
