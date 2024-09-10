import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ReviewItem = ({ review, user, setEditReviewId, setRating, setReview, handleDeleteReview }) => {
  const navigation = useNavigation()
  return (
    <View key={review.id} style={styles.reviewItem}>
      <TouchableOpacity onPress={() => navigation.navigate('ImageScreen', {
        imageUri: review.photoUrl
      })}>
        <Image
          source={{ uri: review.photoUrl }}
          style={styles.reviewAvatar}
        />
      </TouchableOpacity>
      <View style={{ flex: 3 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.reviewName}>{review.name}</Text>

          {review.pass === user.email && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.reviewActionButton}
                onPress={() => {
                  setEditReviewId(review.id);
                  setRating(review.rating);
                  setReview(review.comment);
                }}
              >
                <Feather name="edit" size={20} color="#657786" style={{ marginRight: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reviewActionButton}
                onPress={() => {
                  Alert.alert(
                    "Delete review",
                    "Are you sure you want to delete this review?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => { return; },
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => handleDeleteReview(review.id),
                      },
                    ]
                  );
                }}
              >
                <Feather name="trash" size={20} color="#657786" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.reviewRating}>
          {[...Array(review.rating)].map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={20}
              color="#657786"
            />
          ))}
        </View>
        <Text style={styles.reviewComment1}>{review.comment}</Text>
        <Text style={styles.reviewComment}>{review.edit} {new Date(review.createdAt).toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 0.4,
    paddingTop: 20,
    borderColor: '#657786',
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewName: {
    fontSize: 16,
    marginBottom: 5,
    flex: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 5,
    flex: 1,
    alignItems: 'center',
  },
  reviewComment: {
    fontSize: 14,
    paddingBottom: 10,
    textAlign: 'right',
  },
  reviewComment1: {
    fontSize: 16,
    paddingBottom: 10,
    flex: 4,
  },
  reviewActionButton: {
    marginRight: 10,
  },
});

export default ReviewItem;
