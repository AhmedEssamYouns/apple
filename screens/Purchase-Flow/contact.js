import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Toast, ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { db,FIREBASE_AUTH } from '../../firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const ContactUsPage = () => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!name || !subject || !message) {
            // Show error toast if any field is left empty
            Toast.show({
                type: ALERT_TYPE.WARNING,
                textBody: 'Please fill out all the fields before submiting',
                autoClose: 2000,
                titleStyle: {
                    color: '#657786',
                },
                textBodyStyle: {
                    color: '#657786',
                },

            });
            return;
        }

        addDoc(collection(db, 'contacts'), {
            name,
            subject,
            message,
            user: FIREBASE_AUTH.currentUser.email,
            createdAt: serverTimestamp(),
        })
            .then(() => {
                // Show success toast and clear fields
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    textBody: 'message submitted, will reply as soon as possible',
                    autoClose: 3000,
                    titleStyle: {
                        color: '#657786',
                    },
                    textBodyStyle: {
                        color: '#657786',
                    },
                });
                setName('');
                setSubject('');
                setMessage('');
            })
            .catch((error) => {
                // Show error toast if database write fails
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    textBody: 'failed',
                    autoClose: 2000,
                });
                console.error('Error writing document: ', error);
            });
    };

    return (
        <View style={styles.container}>
            <AlertNotificationRoot>
                <ScrollView>
                    {/* Contact form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Contact Us</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder=" Name"
                                placeholderTextColor="#657786"
                                selectionColor="#657786"
                                value={name}
                                maxLength={20}

                                onChangeText={setName}
                            />
                            <Feather name="user" size={24} color="#657786" style={{ position: 'absolute', right: 10 }} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="phone number"
                                placeholderTextColor="#657786"
                                selectionColor="#657786"
                                value={subject}
                                maxLength={20}
                                keyboardType='numeric'
                                onChangeText={setSubject}
                            />
                           <Feather name="phone" size={24} color="#657786" style={{ position: 'absolute', right: 10 }} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.messageInput]}
                                placeholder=" Message"
                                placeholderTextColor="#657786"
                                selectionColor="#657786"
                                value={message}
                                onChangeText={setMessage}
                                numberOfLines={4}
                                multiline={true}
                                textAlignVertical="top"
                                returnKeyType="done"
                                blurOnSubmit={true}
                            />
                            <Feather name="message-circle" size={24} color="#657786" style={{ position: 'absolute', right: 10, top: 10 }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.follow}>Contact us on social media</Text>
                    <View style={styles.footerContainer}>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Feather name="facebook" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Feather name="twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialIcon}>
                            <Feather name="instagram" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </AlertNotificationRoot>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8FA',

    },
    formContainer: {
        marginTop: 40,
        padding: 60,
        borderRadius: 10,
        alignSelf: 'center',
        width: '100%',
    },
    formTitle: {
        fontSize: 24,
        alignSelf: 'center',
        color: '#657786',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#657786',
        borderRadius: 10,
        borderBottomWidth: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 20,
        paddingVertical: 10,

    },
    submitButton: {
        backgroundColor: '#657786',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center'

    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center'

    },
    follow: {
        fontSize: 20,
        color: '#657786',
        marginTop: 30,
        marginBottom: 10,
        alignSelf: 'center'
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 7,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        backgroundColor: '#E1E8ED',
        borderRadius: 50,
        width: 50,
        alignSelf: 'center',

        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
});

export default ContactUsPage;