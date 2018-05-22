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
	navBarTextColor: 'white',
	navBarButtonColor: 'white',
	statusBarTextColorScheme: 'light',
	statusBarColor:'#444',
};
export default class App extends Component {
  constructor(props) {
    super(props);
    this.goMount();
    Theme.setDefaultThemeStyle(getTheme(platform));
  }

  //componentWillMount() {
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

      global.user = ret;
      global.msg = 'index succ' + JSON.stringify(ret);
      //console.log('index.js succ of storage.load' + JSON.stringify(ret));
      //console.log('index.js global.user of storage.load succ' + JSON.stringify(global.user));


      if (global.user && global.user.loggedIn === true) {

        //NimSession.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{
        NimSession.login(global.user.userLoginName, global.user.userPassword).then((data) => {
          global.user.loggedIn = true;
          this.afterLogin();
        }, (err) => {
	  console.log('index.js fail of nimsession.login:' + JSON.stringify(err));	
          global.user.loggedIn = false;
          this.startLogin();
          console.warn(err);
        })
      }
      else {
	console.log('index.js  go directly to startLogin');
        this.startLogin();
      }

    }).catch(err => {
      // any exception including data not found
      // goes to catch()
      console.log('index fail' + JSON.stringify(err));
      
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

  }

	afterLogin() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'JTLL.ChatList',
        title: '消息',

      },
      navigatorStyle : {
        navBarTextColor: 'white',
        navBarButtonColor: 'white',
        statusBarTextColorScheme: 'light',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
      },
      appleStyle:{
        statusBarColor:'#444',
        navigationBarColor: '#003a66',
        navBarBackgroundColor: '#003a66',
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
        statusBarColor:'#444',
      },
      drawer: {
        left: {
          screen: 'JTLL.MyInfo',
        }
      }
    });
	}
}
