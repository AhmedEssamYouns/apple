import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FIREBASE_AUTH } from '../firebase/config';
import TabNavigator from './tabs';
import SignInScreen from '../screens/auth/sign-in';
import CustomHeader from '../components/elements/navbar';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import UserProfile from '../screens/Profile/profile';
import { Feather } from '@expo/vector-icons';
import EditProfile from '../screens/Profile/editProfile';
import ImageScreen from '../components/elements/image';
import CartScreen from '../screens/Purchase-Flow/cart';
import OrderPage from '../screens/Purchase-Flow/orders';
import ContactUsPage from '../screens/Purchase-Flow/contact';
import ProductScreen from '../screens/Purchase-Flow/Product-screen';
import CustomHeader2 from '../components/elements/header';
import CheckoutPage from '../screens/Purchase-Flow/cheakout';
import FavoritesPage from '../screens/Purchase-Flow/fav-products';
import ForgotPasswordScreen from '../screens/auth/forgot';
import ChangePasswordScreen from '../screens/auth/change';
import AdminPage from './admin';
import SignUpScreen from '../screens/auth/sign-up';

const Stack = createStackNavigator();

const MainTabNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Handle user state changes
    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [initializing]);

    if (initializing) {
        // You can return a loading screen here
        return null; // or a loading spinner
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background,

                    },
                    headerTintColor: Colors.textPrimary,
                    headerTitleStyle: { right: 10 }
                }}
            >
                {user ? (
                    <>
                        <Stack.Screen
                            name="Tabs"
                            component={TabNavigator}
                            options={{
                                header: () => <CustomHeader />,
                            }}
                        />
                        <Stack.Screen
                            name="profile"
                            component={UserProfile}
                            options={({ navigation }) => ({
                                headerRight: () => (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('edit')}
                                        style={{ padding: 10, right: 10 }}
                                    >
                                        <Feather name="edit" size={20} color={Colors.primary} />
                                    </TouchableOpacity>
                                ),
                            })}
                        />
                        <Stack.Screen
                            name="edit"
                            component={EditProfile}
                        />
                        <Stack.Screen name="ImageScreen" component={ImageScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="cart" component={CartScreen} />
                        <Stack.Screen name="orders" component={OrderPage} />
                        <Stack.Screen name="checkout" component={CheckoutPage} />
                        <Stack.Screen name="change password" component={ChangePasswordScreen} />
                        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
                        <Stack.Screen name="fav" component={FavoritesPage} options={{
                            header: () => <CustomHeader2 />,
                        }} />
                        <Stack.Screen name="contact" component={ContactUsPage} />
                        <Stack.Screen
                            name="signIN"
                            component={SignInScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="Product" component={ProductScreen}
                            options={{
                                header: () => <CustomHeader2 />,
                            }} />
                        <Stack.Screen name="signUP" component={SignUpScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="signIN"
                            component={SignInScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="change password" component={ChangePasswordScreen} />
                        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
                        <Stack.Screen name="signUP" component={SignUpScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="admin" component={AdminPage}
                            options={{ headerShown: false }}
                        />

                    </>
                )}
            </Stack.Navigator>
        </>
    );
};

export default MainTabNavigator;
