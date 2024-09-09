// components/Filter.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../constants/colors';

const Filter = ({
    searchQuery,
    setSearchQuery,
    selectedPrice,
    sortingMethod,
    setSelectedPrice,
    setSortingMethod,
    customLowerBound,
    setCustomLowerBound,
    customUpperBound,
    setCustomUpperBound,
    setFilteredPriceRange,
    selectedCategory,
    setSelectedCategory
}) => {
    const [low, setlow] = useState(null);

    const handlePriceChange = (itemValue) => {
        setSelectedPrice(itemValue);
        setCustomLowerBound('');
        setCustomUpperBound('');
        switch (itemValue) {
            case 'any':
                setFilteredPriceRange([0, Infinity]);
                break;
            case 499:
                setFilteredPriceRange([0, 499]);
                setlow(0)

                break;
            case 999:
                setFilteredPriceRange([500, 999]);
                setlow(555)

                break;
            case 1000:
                setFilteredPriceRange([1000, Infinity]);
                setlow(null)

                break;
            case 'custom':
                // do nothing, custom range will be set with text input
                break;
            default:

        }
    };
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 20 }}>
                <TouchableOpacity onPress={() => setSelectedCategory('')} style={styles.filterButton(selectedCategory === '')}>
                    <Text style={styles.filterText}>All products</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedCategory('iphones')} style={styles.filterButton(selectedCategory === 'iphones')}>
                    <Text style={styles.filterText}>iphones</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedCategory('watches')} style={styles.filterButton(selectedCategory === 'watches')}>
                    <Text style={styles.filterText}>watches</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedCategory('macbooks')} style={styles.filterButton(selectedCategory === 'macbooks')}>
                    <Text style={styles.filterText}>Macbooks</Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignSelf: 'center', paddingTop: 20 }}>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search Products"
                        placeholderTextColor={Colors.textSecondary}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setFilteredPriceRange([0, Infinity]);
                            setSortingMethod(null);
                        }}
                    />
                    <TouchableOpacity style={styles.searchButton}>
                        <Ionicons name="search" size={24} color="#1DA1F2" />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: "space-between", paddingHorizontal: 5, }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.filterLabel}>
                            Filter by Price:
                        </Text>
                        <ScrollView>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={selectedPrice} onValueChange={handlePriceChange} style={styles.picker}>
                                    <Picker.Item label="All" value={'any'} color="#657786"  />
                                    <Picker.Item label="$0 - $499" value={499} color="#657786" />
                                    <Picker.Item label="$500 - $999" value={999} color="#657786" />
                                    <Picker.Item label="$1000+" value={1000} color="#657786" />
                                    <Picker.Item label="Custom Range" value="custom" color="#657786" />
                                </Picker>
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.filterLabel}>Sort by:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={sortingMethod} onValueChange={setSortingMethod} style={styles.picker}>
                                <Picker.Item label="None" value={null} color="#657786" />
                                <Picker.Item label="Low to High" value="lowToHigh" color="#657786" />
                                <Picker.Item label="High to Low" value="highToLow" color="#657786" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {selectedPrice === 'custom' && (
                    <View style={styles.customPriceRangeContainer}>
                        <TextInput
                            style={styles.customPriceInput}
                            placeholder="Min"
                            keyboardType='number-pad'
                            value={customLowerBound}
                            onChangeText={(text) => setCustomLowerBound(text)}
                        />
                        <TextInput
                            style={styles.customPriceInput}
                            placeholder="Max"
                            value={customUpperBound}
                            onChangeText={(text) => setCustomUpperBound(text)}
                        />
                        <TouchableOpacity
                            style={styles.customPriceButton}
                            onPress={() => setFilteredPriceRange([Number(customLowerBound) || 0, Number(customUpperBound) || Infinity])}
                        >
                            <Text style={styles.customPriceButtonText}>Go</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelectedPrice('any')
                            setFilteredPriceRange([0, Infinity])
                        }} style={{ paddingLeft: 10 }}>
                            <Feather name="x" size={24} color="#657786" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterButton: (isSelected) => ({
        backgroundColor: isSelected ? Colors.cardBackground : 'white',
        padding: 6,
        elevation: 2,
        borderRadius: 10,
        margin: 5
    }),
    filterText: {
        color: Colors.textPrimary,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        height: 40,
        width: '100%',
        alignSelf:'center',
        padding: 10,
        marginBottom: 20
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    searchButton: {
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    filterLabel: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 5,
    },
    pickerContainer: {
        height: 40,
        width: 150,
        justifyContent:'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    picker: {
        fontSize:20,
        color: Colors.textPrimary,
    },
    customPriceRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15,
    },
    customPriceInput: {
        height: 40,
        width: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 15,
    },
    customPriceButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    customPriceButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
})
export default Filter;
