import React, { Component } from 'react';
import { View,Image,TextInput,StyleSheet,Text,Dimensions} from 'react-native';
import { Container, Content, Button, Icon,ListItem,Left,Right } from 'native-base';
import {NimSession} from 'react-native-netease-im';
import md5 from '../utils/md5';
import storage from '../utils/mystorage.js';

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
    async componentWillMount() {
      /*
      if (global.user && global.user.loggedIn) {
        this.loginIn();
      }
      */
      await global.storage.load({
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
        await this.setState( {
          msg: JSON.stringify(ret),
        });
        console.log(ret);
        global.user = ret;
        //console.log('Global User.loggedIn: ' + global.user.loggedIn);

        //NimSession.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{
        /*
        await NimSession.login(global.user.userLoginName,global.user.userPassword).then((data)=>{
          global.user.loggedIn = true;
          this.afterLogin();
        },(err)=>{
          console.warn(err);
          global.user.loggedIn = false;
        })
        */
      }).catch(async (err) => {
        // any exception including data not found
        // goes to catch()
        await this.setState( {
          msg: 'ERRRRRRor',
        });
        console.warn(err.message);
        //global.user.loggedIn = false;
        this.startLogin();
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      })
      console.log('global.user' + JSON.stringify(global.user));
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
            navigator.resetTo({
                screen:'JTLL.ChatList',
                title:"消息",
            });
        },(err)=>{
            console.warn(err);
        })
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
                <Content alwaysBounceVertical={false}>
                    <View style={styles.slogonV}>
                        <Text style={styles.slogon}>只想静静地跟你聊聊天！</Text>
                    </View>
                    {this._renderContent()}
                    <View style={styles.bottom}>
                        <Button block onPress={() => this.loginIn()}>
                            <Text style={styles.buttonText}>登录</Text>
                        </Button>
                    </View>
                  { /*
                  <View style={styles.slogonV}>
                    <Text style={styles.slogon}>Global User: {JSON.stringify(global.user)}</Text>
                  </View>
                  <View style={styles.slogonV}>
                    <Text style={styles.slogon}>Global User.userloginame: {JSON.stringify(global.user.userLoginName)}</Text>
                  </View>
                  <View style={styles.slogonV}>
                    <Text style={styles.slogon}>Global MSG: {global.msg}</Text>
                  </View>
                  <View style={styles.slogonV}>
                    <Text style={styles.slogon}>Error MSG: {JSON.stringify(global.user)}</Text>
                  </View>
                  <View style={styles.slogonV}>
                    <Text style={styles.slogon}>State MSG: {this.state.msg}</Text>
                  </View>
                  */}
                </Content>
            </Container>
        );
    }
}
const borderWidth = StyleSheet.hairlineWidth;
const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        flex: 1,
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
