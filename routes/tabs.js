import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import HomeScreen from '../screens/main-screens/home-screen';
import CustomHeader from '../components/elements/navbar';
import { Colors } from '../constants/colors';
import Shop from '../screens/main-screens/Shop-screen';
import MenuHome from '../screens/main-screens/menu-screen';
const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation }) {
    const [keyboardVisible, setKeyboardVisible] = React.useState(false);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    display: "none"
                },
                tabBarStyle: {
                    backgroundColor: Colors.background,
                    borderTopWidth: 1,
                    display: keyboardVisible ? 'none' : 'flex'
                },
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'shop') {
                        iconName = 'tag'
                    } else if (route.name === 'menu') {
                        iconName = 'menu'
                    } else if (route.name === 'Exercise') {
                        return <MaterialCommunityIcons name="dumbbell" size={size} color={color} />;
                    }

                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="shop" component={Shop} />
            <Tab.Screen name="menu" component={MenuHome} />


        </Tab.Navigator >
    );
}
