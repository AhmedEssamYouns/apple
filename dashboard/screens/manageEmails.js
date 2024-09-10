import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchContactMessages, markAsResponded } from '../../firebase/email';
const ContactMessagesPage = () => {
    const [contactMessages, setContactMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(true);
    const [showResponded, setShowResponded] = useState(false);
    const [showUnresponded, setShowUnresponded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = fetchContactMessages((data) => {
            setContactMessages(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredContactMessages = contactMessages.filter(
        (contactMessage) =>
            contactMessage.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
            ((showAll || (showResponded && contactMessage.responded) || (showUnresponded && !contactMessage.responded)))
    );

    const handleSearchTermChange = (value) => {
        setSearchTerm(value);
    };

    const handleMarkAsResponded = async (contactMessageId) => {
        const confirmResponded = await new Promise((resolve) => {
            Alert.alert(
                'Confirm',
                'Are you sure you want to mark this contact message as responded?',
                [
                    { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
                    { text: 'Mark as Responded', onPress: () => resolve(true) }
                ],
                { cancelable: true }
            );
        });
        if (!confirmResponded) return;

        try {
            await markAsResponded(contactMessageId);
            setContactMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.id === contactMessageId ? { ...message, responded: true } : message
                )
            );
            Alert.alert('Success', 'Contact message marked as responded successfully.');
        } catch (error) {
            console.error('Error updating contact message: ', error);
            Alert.alert('Error', 'Error updating contact message. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Text style={styles.searchText}>Search by Email:</Text>
                <TextInput
                    style={styles.input}
                    value={searchTerm}
                    placeholder='Enter email address..'
                    onChangeText={handleSearchTermChange}
                />
            </View>
            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton} onPress={() => { setShowAll(true); setShowResponded(false); setShowUnresponded(false); }}>
                    <Text style={styles.filterButtonText}>Show All {contactMessages.length > 0 && <Text style={styles.badge}>{contactMessages.length}</Text>}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => { setShowAll(false); setShowResponded(true); setShowUnresponded(false); }}>
                    <Text style={styles.filterButtonText}>Responded {contactMessages.filter((contactMessage) => contactMessage.responded).length > 0 && <Text style={styles.badge}>{contactMessages.filter((contactMessage) => contactMessage.responded).length}</Text>}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => { setShowAll(false); setShowResponded(false); setShowUnresponded(true); }}>
                    <Text style={styles.filterButtonText}>Unresponded {contactMessages.filter((contactMessage) => !contactMessage.responded).length > 0 && <Text style={styles.badge}>{contactMessages.filter((contactMessage) => !contactMessage.responded).length}</Text>}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1DA1F2" style={styles.loadingIndicator} />
            ) : filteredContactMessages.length === 0 ? (
                <Text style={styles.noMessagesText}>No messages found.</Text>
            ) : (
                <FlatList
                    style={styles.flatList}
                    data={filteredContactMessages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.contactMessage}>
                            <Text style={styles.contactMessageText}>Name: <Text style={styles.contactMessageValue}>{item.name}</Text></Text>
                            <Text style={styles.contactMessageText}>Email: <Text style={styles.contactMessageValue}>{item.user}</Text></Text>
                            <Text style={styles.contactMessageText}>Phone number: <Text style={styles.contactMessageValue}>{item.subject}</Text></Text>
                            <Text style={styles.contactMessageText}>Message: <Text style={styles.contactMessageValue}>{item.message}</Text></Text>
                            <Text style={styles.contactMessageText}>Date: <Text style={styles.contactMessageValue}>{new Date(item.createdAt.toDate()).toLocaleString()}</Text></Text>
                            <View>
                                {item.responded ? (
                                    <Text style={styles.respondedText}>Responded</Text>
                                ) : (
                                    <TouchableOpacity style={styles.button} onPress={() => handleMarkAsResponded(item.id)}>
                                        <Text style={styles.buttonText}>Mark as Responded</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = {
    container: {
        paddingHorizontal: 20,
        backgroundColor: '#F5F8FA',
        paddingTop:10
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchText: {
        fontSize: 16,
        color: '#1DA1F2',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginLeft: 10,
        paddingHorizontal: 15,
        borderColor: '#E1E8ED',
        borderWidth: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#1DA1F2',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#FFF',
        fontSize: 10,
    },
    badge: {
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 2,
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    noMessagesText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#AAB8C2',
    },
    flatList: {
        marginBottom: 100,
    },
    contactMessage: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderColor: '#E1E8ED',
        borderWidth: 1,
    },
    contactMessageText: {
        fontSize: 16,
        color: '#657786',
    },
    contactMessageValue: {
        fontWeight: 'bold',
    },
    respondedText: {
        color: '#28A745',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#1DA1F2',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
};

export default ContactMessagesPage;
