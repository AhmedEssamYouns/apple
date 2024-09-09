
import MainTabNavigator from "./stack";
import { NavigationContainer } from "@react-navigation/native";


const MainNav = () => {
  return (
    <NavigationContainer>
      <MainTabNavigator/>
    </NavigationContainer>
  )
}

export default MainNav