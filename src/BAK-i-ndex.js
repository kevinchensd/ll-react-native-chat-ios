import React,{
	Component
} from 'react';
import {Alert} from 'react-native';
import registerScreens from './screens';
import {Navigation} from 'react-native-navigation';
import { Theme } from "native-base-shoutem-theme";
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import storage from './utils/mystorage';
import {NimSession} from 'react-native-netease-im';
registerScreens();

const navigatorStyle = {
	drawUnderNavBar:true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white',
	statusBarTextColorScheme: 'light',
	statusBarColor:'#fff',
};
export default class App extends Component {
  constructor(props) {
    super(props);
    this.goMount();
    Theme.setDefaultThemeStyle(getTheme(platform));
  }

  // async componentWillMount() {
  goMount = () => {

    //global.loggedIn = false;

    global.storage.load({
      key: 'loginState',
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
          // blahblah
        },
        someFlag: true,
      },
    }).then(async (ret) => {
      // found data go to then()
      //Alert.alert('storage ret:' + JSON.stringify(ret));
      //
      global.user = ret;
      global.msg = 'index succ' + JSON.stringify(ret);
      console.log(ret);

      //console.log('Global User.loggedIn: ' + global.user.loggedIn);

      //NimSession.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{

      NimSession.login(global.user.userLoginName,global.user.userPassword).then((data)=>{
        global.user.loggedIn = true;
        this.afterLogin();
      },(err)=>{
        this.startLogin();
        console.warn(err);
        global.user.loggedIn = false;
      })

    }).catch(err => {
      // any exception including data not found
      // goes to catch()
      global.msg = 'index fail' + JSON.stringify(err);
      console.log(err);
      //Alert.alert('Err:' + JSON.stringify(err));

      console.warn(err.message);
      //global.user.loggedIn = false;
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    })

    /*
    if (global.user && global.user.loggedIn) {
        this.afterLogin();
    }
    else {
        this.startLogin();
    }
    */
  }

	afterLogin() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'JTLL.ChatList',
        title: '消息',
        navigatorStyle: {
          ...navigatorStyle,
          statusBarTextColorScheme: 'dark',
          navBarBackgroundColor:'#444',
          navBarHidden:true
        }
      },
      appleStyle:{
        statusBarColor:'#fff',
      },
      drawer: {
        left: {
          screen: 'JTLL.MyInfo',
        }
      }
    });
	}
	startLogin() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'JTLL.Login',
        title: '登录',
        navigatorStyle: {
          ...navigatorStyle,
          statusBarTextColorScheme: 'dark',
          navBarBackgroundColor:'#444',
          navBarHidden:true
        }
      },
      appleStyle:{
        statusBarColor:'#fff',
      },
      drawer: {
        left: {
          screen: 'JTLL.MyInfo',
        }
      }
    });
	}
}
