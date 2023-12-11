import React, {Component} from 'react';
import Drawer from 'react-native-drawer';
import Sidemenu from '../../Navigation/Sidemenu';

export default class DrawerComponent extends Component{
    render(){
        return(
            <Drawer
            ref={this.props.ref}
        type="overlay"
        content={<Sidemenu />}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        //styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        />
        );

    }
}