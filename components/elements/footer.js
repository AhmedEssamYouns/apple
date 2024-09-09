import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const Footer = () => {
    return (
        <View>
            <Text style={styles.follow}>Follow us on social media</Text>
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.socialIcon}>
                    <Feather name="facebook" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Feather name="twitter" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Feather name="instagram" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    follow: {
        fontSize: 20,
        color: Colors.secondary,
        alignSelf: 'center'
    },
    footerContainer: {
        paddingTop:10,
        marginBottom: 55,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialIcon: {
        marginHorizontal: 10,
    },
});

export default Footer;
