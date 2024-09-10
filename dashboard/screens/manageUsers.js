import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import { handleUpdateUser, subscribeToUsers } from '../../firebase/userData';

const UsersPage = () => {
    const [usersData, setUsersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [loading, setLoading] = useState(true); // State to manage loading indicator

    useEffect(() => {
        const unsubscribe = subscribeToUsers(setUsersData, setLoading);
        return () => {
            unsubscribe();
        };
    }, []);

    const handleSearchQuery = (query) => {
        setSearchQuery(query);
    };


    const renderUser = ({ item }) => (
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
            <Text style={{  }}>
                Username: <Text style={{  }}>{item.name}</Text>
            </Text>
            <Text style={{  }}>
                Name: <Text style={{  }}>{item.fullname}</Text>
            </Text>
            <Text style={{  }}>
                Email: <Text style={{  }}>{item.email}</Text>
            </Text>
            <Text style={{  }}>
                Phone: <Text style={{  }}>{item.Phone}</Text>
            </Text>
            <Text style={{  }}>
                Address: <Text style={{  }}>{item.Address}</Text>
            </Text>
            <Text style={{  }}>
                Balance: <Text style={{  }}>{item.balance ? item.balance : 0}</Text>
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 10, gap: 5, alignSelf: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleModalOpen(item.email, 'Address')} style={{ backgroundColor: '#1da1f2', padding: 6, borderRadius: 5 }}>
                    <Text style={{ color: 'white', fontSize: 13,  }}>Update Address</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => handleModalOpen(item.email, 'balance')} style={{ backgroundColor: '#1da1f2', padding: 6, borderRadius: 5 }}>
                    <Text style={{ color: 'white', fontSize: 13,  }}>Update Balance</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => handleModalOpen(item.email, 'Phone')} style={{ backgroundColor: '#1da1f2', padding: 6, borderRadius: 5 }}>
                    <Text style={{ color: 'white', fontSize: 13,  }}>Update Phone</Text>
                </TouchableOpacity>
            </View>
        </View>
    );


    const handleModalOpen = (email, field) => {
        setSelectedEmail(email);
        setSelectedField(field);
        setModalVisible(true);
        setInputValue('');
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleConfirmUpdate = () => {
        handleUpdateUser(selectedEmail, selectedField, inputValue);
        handleModalClose();
    };

    return (
        <View style={{  backgroundColor: '#F5F8FA', padding: 10, marginBottom: 80 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 }}>Users</Text>
            <TextInput
                style={{ backgroundColor: 'white', borderRadius: 13, padding: 10, marginBottom: 10, elevation: 4 }}
                placeholder="Search by username"
                value={searchQuery}
                onChangeText={handleSearchQuery}
            />
            {loading ? ( // Show loading indicator if data is loading
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={usersData.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                    renderItem={renderUser}
                    keyExtractor={(item) => item.email}
                    style={{ marginBottom: 10 }}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text>Enter new value:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginTop: 10 }}
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                            <Button title="Cancel" onPress={handleModalClose} />
                            <Button title="Update" onPress={handleConfirmUpdate} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default UsersPage;
