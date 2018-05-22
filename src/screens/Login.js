import React, { Component } from 'react';
import { View,Image,TextInput,StyleSheet,Text,Dimensions} from 'react-native';
import { Container, Content, Button, Icon,ListItem,Left,Right, Thumbnail } from 'native-base';
import {NimSession} from 'react-native-netease-im';
import md5 from '../utils/md5';
import storage from '../utils/mystorage.js';
import {Navigation} from 'react-native-navigation'

export default class Login extends Component {
    static navigatorStyle = {
        statusBarColor: '#444',
    };
    constructor(props) {
        super(props);
        this.state = {
            name:global.user?global.user.userLoginName: '',
            password: global.user?global.user.userPassword:'',
            msg:'',
        };
    }

    componentWillUnmount() {
        //清除密码
        this.setState({password: ''});
    }
    componentWillMount() {

      //console.log('Login.js---willmount---global.user' + JSON.stringify(global.user));
    }
    goToRegister = () => {
      this.props.navigator.push({
        screen:"JTLL.Register",
        title:'注册用户'
      });
    }

    loginIn = async ()=> {
        const {navigator} = this.props;
        //NimSession.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{
      await NimSession.login(this.state.name,this.state.password).then( async (data)=>{
            let user = {
              userLoginName: this.state.name,
              userPassword: this.state.password,
              loggedIn: true,
            }
            global.user = user;

            global.imaccount = this.state.name;
          //console.log('NimSession succ, Global user to be saved in Login.js--loginIn():' + JSON.stringify(global.user));

          await global.storage.save({
            key: 'loginState',   // Note: Do not use underscore("_") in key!
            data:user,
            // if not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            //expires: 1000 * 3600 * 1
          });
          this._afterLogin();

        },(err)=>{
            console.warn('Error--loginIn---Login.js:' + JSON.stringify(err));
        })
    }

  _afterLogin = ()=> {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'JTLL.ChatList',
        title: '消息',

      },
      navigatorStyle : {
        navBarTextColor: 'white',
        navBarButtonColor: 'white',
        statusBarTextColorScheme: 'light',
        //tabBarHidden: true,
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
    _renderContent(){
        return (
            <View style={styles.content}>

                <View style={[styles.inputView,{borderTopWidth:borderWidth,borderTopColor:'#ccc'}]}>
                    <Text style={styles.inputLabel}>账户</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.name}
                        underlineColorAndroid="transparent"
                        placeholder="请输入帐号"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        onChangeText={name => {
                                    this.setState({name});
                                }}
                    />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>密码</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.password}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        placeholder="请输入密码"
                        onChangeText={password => {
                                        this.setState({password});
                                    }}
                    />
                </View>
            </View>
        );

    }
    render() {
        return (
            <Container>
              {/*<Content alwaysBounceVertical={false}> */}
              <View style={{flex:1}}>
                    <View style={styles.slogonV}>

                      <Thumbnail square size={80} source={require('../images/littledevil2.png')} />
                      <Text style={styles.slogon}>只想静静地跟你聊聊天！</Text>
                    </View>
                    {this._renderContent()}
                    <View style={styles.bottom}>
                        <Button block onPress={() => this.loginIn()}>
                            <Text style={styles.buttonText}>登    录</Text>
                        </Button>
                    </View>
                { /*
                  <View style={styles.bottom2}>
                    <Button style={{alignSelf: 'flex-end'}} bordered onPress={() => {
                      this.goToRegister()
                    }}>
                      <Text>注册新用户</Text>
                    </Button>
                  </View>
                  */
                }
                {/*</Content>*/}
              </View>
            </Container>
        );
    }
}
const borderWidth = StyleSheet.hairlineWidth;
const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        //flex: 1,
        marginTop:height/2 - 270,
        padding:12
    },
    slogon : {
        fontSize: 24,
        color: '#003a66',
    },
    slogonV: {
      marginTop: 100,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:'row',
    },
    contentMain: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    bottom: {
        padding:12
    },

    bottom2: {
      flex:1,
      padding:12,
      flexDirection:'row',
      justifyContent:'flex-end',
      //borderWidth:1,
      //borderColor:'#444',
      marginBottom:30,
    },
    inputView: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: 9,
        paddingRight: 9,
        alignItems: 'center',
        borderBottomWidth: borderWidth,
        borderBottomColor: '#ccc',
        height: 41,
        borderLeftWidth: borderWidth,
        borderLeftColor: '#ccc',
        borderRightWidth: borderWidth,
        borderRightColor: '#ccc'
    },
    inputLabel: {
        fontSize: 14,
        marginRight: 10
    },
    textViewStyle: {
        flex: 1,
        fontSize: 14,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff'
    },

});
