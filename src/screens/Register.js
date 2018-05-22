import React, { Component } from 'react';
import { View,Image,TextInput,StyleSheet,Text,Dimensions} from 'react-native';
import { Container, Content, Button, Icon,ListItem,Left,Right, Thumbnail } from 'native-base';
import {NimSession} from 'react-native-netease-im';
import md5 from '../utils/md5';
import storage from '../utils/mystorage.js';
import {Navigation} from 'react-native-navigation'

export default class Register extends Component {
    static navigatorStyle = {
        statusBarColor: '#444',
    };
    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            newPassword:'',
            confirmPassword:'',
        };
    }

    componentWillUnmount() {
        //清除密码
        this.setState(
          {
            userName:'',
            newPassword:'',
            confirmPassword:'',
          }
          );
    }
    componentWillMount() {

    }
    register = ()=> {


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
          console.log('Global user to be saved in Login.js:' + JSON.stringify(global.user));

          await global.storage.save({
            key: 'loginState',   // Note: Do not use underscore("_") in key!
            data:user,
            // if not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            //expires: 1000 * 3600 * 1
          });
          this._afterLogin();
          /*
            navigator.resetTo({
                screen:'JTLL.ChatList',
                title:"消息",
            });
            */
        },(err)=>{
            console.warn(err);
        })
    }

  _afterLogin() {
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
    _renderContent(){
        return (
            <View style={styles.content}>

                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>用户名*</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.userName}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        placeholder="请输入用户名"
                        onChangeText={userName => {
                                        this.setState({userName});
                                    }}
                    />
                </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>密码*</Text>
                <TextInput
                  style={styles.textViewStyle}
                  value={this.state.password}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholder="请输入密码"
                  onChangeText={newPassword => {
                    this.setState({newPassword});
                  }}
                />
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>密码确认*</Text>
                <TextInput
                  style={styles.textViewStyle}
                  value={this.state.password}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  placeholder="再次输入密码"
                  onChangeText={confirmPassword => {
                    this.setState({confirmPassword});
                  }}
                />
              </View>
            </View>
        );

    }
    render() {
        return (
            <Container>
              <View style={{flex:1}}>
                    <View style={styles.slogonV}>

                      <Thumbnail square size={80} source={require('../images/littledevil2.png')} />
                      <Text style={styles.slogon}>欢迎注册</Text>
                    </View>
                    {this._renderContent()}
                    <View style={styles.bottom}>
                        <Button block onPress={() => this.register()}>
                            <Text style={styles.buttonText}>注    册</Text>
                        </Button>
                    </View>
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
        //marginTop:height/2 - 270,
        padding:12,
        justifyContent:'center',
        height: 150,
    },
    slogon : {
        fontSize: 24,
        color: '#003a66',
    },
    slogonV: {
      //flex:1,
      //marginTop: 100,
      height:150,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:'row',
    },

    bottom: {
        flex: 1,
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
