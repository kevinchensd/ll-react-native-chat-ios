import React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import { Container,Text, Content,Card, CardItem, Header,Title, Button, Icon,Thumbnail ,Left,Right,Body,List,ListItem} from 'native-base';
import {Navigation} from 'react-native-navigation';

class MyInfo extends React.Component {

  static navigatorStyle = {
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    statusBarTextColorScheme: 'light',
    //tabBarHidden: true,
    navBarBackgroundColor:"#444",
    //drawUnderNavBar:false,
    //statusBarHideWithNavBar: true,
    //statusBarHidden: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      name:global.user?global.user.userLoginName: '',
      password: global.user?global.user.userPassword:'',
      loggedIn:global.user?global.user.loggedIn:false,
    };
  }

  componentWillMount() {
    console.log('MyInfo-Willmount this.state.name:' + JSON.stringify(this.state.name));
    console.log('MyInfo-Willmount global.user.name:' + JSON.stringify(global.user.userLoginName));
    this.setState(
      {
        name:global.user?global.user.userLoginName: '',
      }
    )
  }

  componentWillUnmount() {
    console.log('MyInfo-Will Unmount this.state.name:' + JSON.stringify(this.state.name));
    console.log('MyInfo-Will unmount global.user.name:' + JSON.stringify(global.user.userLoginName));
  }

  onShowModal = () => {
    this.toggleDrawer();
    this.props.navigator.showModal({
      screen: 'example.Types.Modal',
      title: `Modal`,
    });
  };

  onPushToFirstTab = () => {
    this.toggleDrawer();
    this.props.navigator.handleDeepLink({
      link: 'tab1/example.Types.Push'
    });
  };

  logoutConfirm= ()=> {
    Alert.alert('','确定要退出登录吗？',
      [
        {text:"确定", onPress:this.logout},
        {text:"取消", onPress:()=>{}},
      ]
    );
  }
  logout = async ()=> {
    console.log("Logged Out");
    let user = {
      userLoginName:global.user.userLoginName,
      userPassword: global.user.userPassword,
      loggedIn: false,
    };

    global.user = user;
    console.log('Set global user to be logged out in logout:' + JSON.stringify(global.user));

    await global.storage.save({
      key: 'loginState',   // Note: Do not use underscore("_") in key!
      data:user,
    });

    this.startLogin();
  }

  startLogin() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'JTLL.Login',
        title: '登录',
        navigatorStyle: {
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
  toggleDrawer = () => {
    this.props.navigator.toggleDrawer({
      side: 'left'
    });
  };

  render() {
    return (
      <Container style={styles.container}>

        <Content contentContainerStyle={styles.contentV}>

          <List>
            <ListItem>
              <Thumbnail square size={80} source={require('../images/littledevil2.png')} />
              
              <Text>Hi~ {this.state.name}</Text>
              
            </ListItem>
          </List>

        <View style={{padding:12}}>
          <Button onPress={this.logoutConfirm}>
            <Text style={styles.buttonText}>注  销</Text>
          </Button>
        </View>
        </Content>
        <View style={styles.versionView}>
          <Text style={styles.versionText}>欢迎使用凉凉专业聊天App</Text>
          <Text style={styles.versionText}>版本：Ver.1.0.1 APN</Text>
          <Text style={styles.versionText}>联系: kevin.e@163.com</Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width: 300,
    paddingTop: 100,
    //alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  contentV: {
    //flex:1,
    alignItems: 'center',
    //justifyContent: 'center',
    //borderWidth:1,
    //borderColor:'#444'

  },
  button: {
    marginTop: 16
  },
  buttonText: {
    color: '#fff',
    paddingLeft:20,
    paddingRight:20,

  },
  versionView: {
    marginBottom:50,
    justifyContent:'center',
    alignItems:'center',
  },
  versionText: {
    fontSize:14,
    color:'#444'
  }
});

export default MyInfo;
