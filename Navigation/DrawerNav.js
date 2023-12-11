import { createDrawerNavigator,} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React,{ Component } from 'react';
import Home from '../Components/Home';

import Sidemenu from './Sidemenu';
import StackNav from './StackNav';

const Drawer = createDrawerNavigator();


class DrawerNav extends Component{
   
    render(){
        return(
        <Drawer.Navigator
        
         defaultStatus='closed' gestureEnabled={true} screenOptions={{
                headerShown: false,
            }}
        drawerContent={() => <Sidemenu/>}>
        <Drawer.Screen name="afterlogin" component={StackNav} />
        
      </Drawer.Navigator>
      

       
      
        );
    }
}
export default DrawerNav;