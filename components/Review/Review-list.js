import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ReviewItem from './Review-item';
import { Colors } from '../../constants/colors';
import CustomText from '../elements/Customtext';

const ReviewList = ({ reviews, user, setEditReviewId, setRating, setReview, handleDeleteReview, header }) => {
  const renderItem = ({ item }) => (
    <ReviewItem
      review={item}
      user={user}
      setEditReviewId={setEditReviewId}
      setRating={setRating}
      setReview={setReview}
      handleDeleteReview={handleDeleteReview}
    />
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      data={reviews}
      renderItem={renderItem}
      ListEmptyComponent={
        <CustomText style={{ fontSize: 30, alignSelf: 'center', color: Colors.secondary }}>No Reviews yet</CustomText>
      }
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 10,
    elevation: 4,
    margin:10,
    borderColor: Colors.textPrimary,
  },
});

export default ReviewList;
