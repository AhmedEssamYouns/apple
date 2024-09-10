import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import ProductsPage from '../dashboard/screens/manageProducts';
import UsersPage from '../dashboard/screens/manageUsers';
import DiscountCodesPage from '../dashboard/screens/manageCodes';
import ReviewsPage from '../dashboard/screens/manageReviews';
import ContactMessagesPage from '../dashboard/screens/manageEmails';
import OrdersPage from '../dashboard/screens/manageOrders';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

const AdminPage = ({ }) => {
    const navigation = useNavigation()
    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'signIN' }],
            }))
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Products':
                            iconName = 'shopping-bag';
                            return <Feather name={iconName} size={25} color={color} />;
                        case 'Users':
                            iconName = 'user';
                            return <FontAwesome name={iconName} size={25} color={color} />;
                        case 'Discount Codes':
                            iconName = 'percent';
                            return <Feather name={iconName} size={25} color={color} />;
                        case 'Reviews':
                            iconName = 'star';
                            return <FontAwesome name={iconName} size={25} color={color} />;
                        case 'Emails':
                            iconName = 'mail';
                            return <Feather name={iconName} size={25} color={color} />;
                        case 'Orders':
                            iconName = 'list';
                            return <Feather name={iconName} size={25} color={color} />;
                        default:
                            return null;
                    }
                },
                tabBarLabelStyle: { display: 'none' }, // Hide the tab labels
                tabBarStyle: styles.bottomBar,
                tabBarActiveTintColor: '#1DA1F2', // Color when focused
                tabBarInactiveTintColor: '#657786', // Color when not focused
                headerTitle: 'applestore',
                headerTitleStyle: { fontFamily: 'title' },
                headerTitleAlign: 'left',
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Feather name="log-out" size={24} color="red" />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    elevation: 5,
                },
            })}
        >
            <Tab.Screen name="Products" component={ProductsPage} />
            <Tab.Screen name="Users" component={UsersPage} />
            <Tab.Screen name="Discount Codes" component={DiscountCodesPage} />
            <Tab.Screen name="Reviews" component={ReviewsPage} />
            <Tab.Screen name="Emails" component={ContactMessagesPage} />
            <Tab.Screen name="Orders" component={OrdersPage} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        elevation: 5,
    },
    logoutButton: {
        paddingRight: 15,
    },
});

export default AdminPage;
