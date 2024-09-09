import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FIREBASE_AUTH } from '../firebase/config';
import TabNavigator from './tabs';
import SignInScreen from '../screens/auth/sign-in';
import CustomHeader from '../components/elements/navbar';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import UserProfile from '../screens/auth/profile';
import { Ionicons, Feather } from '@expo/vector-icons';
import EditProfile from '../screens/auth/editProfile';
import ImageScreen from '../components/elements/image';

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
                    </>
                ) : (
                    <Stack.Screen
                        name="signIN"
                        component={SignInScreen}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </>
    );
};

export default MainTabNavigator;
