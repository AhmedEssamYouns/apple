import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ReviewItem from './Review-item';
import { Colors } from '../../constants/colors';
import CustomText from '../elements/Customtext';

const ReviewList = ({ reviews, user, setEditReviewId, setRating, setReview, handleDeleteReview }) => {
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
      data={reviews}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={{justifyContent:'center',marginTop:'20%'}}>
        <CustomText style={{ fontSize: 30, alignSelf: 'center'}}>No Reviews yet</CustomText>
        </View>
      }
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop:10,
    borderRadius: 10,
  },
});

export default ReviewList;
