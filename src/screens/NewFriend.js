import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    NativeAppEventEmitter,
    ListView,
    Image,
    Text
} from 'react-native';
import {Container,Content,Icon,ListItem,Body,Right,Left,Item,Input,Header,Text as TextNB} from 'native-base';
import {NimSystemMsg,NimFriend} from 'react-native-netease-im';
import {SwipeListView} from 'react-native-swipe-list-view';
import Toast from 'react-native-simple-toast';

export default class NewFriend extends React.Component {
    static navigatorStyle = {
        StatusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    // 构造
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            rowOpen:false,
            dataSource: ds.cloneWithRows([]),
        };
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }
    _onNavigatorEvent(event){
        const {navigator} = this.props;
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'search') { // this is the same id field from the static navigatorButtons definition
                navigator.showModal({
                    screen:"JTLL.SearchScreen",
                    animationType: 'slide-up',
                    passProps:{
                        onResult:function(result){
                            navigator.dismissAllModals({
                                animated:false,
                            });
                            navigator.push({
                                screen:'JTLL.FriendDetail',
                                title:'详细资料',
                                passProps:{
                                    friendData:result
                                }
                            });
                        }
                    }
                });

            }
        }
    }
    componentWillMount() {
        NimSystemMsg.startSystemMsg();
    }
    componentDidMount() {
        this.friendListener = NativeAppEventEmitter.addListener("observeReceiveSystemMsg",(data)=>{
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(data)
            });
        });
    }
    componentWillUnmount() {
        NimSystemMsg.stopSystemMsg();
        this.friendListener && this.friendListener.remove();
    }
    toFriendDetail(res){
        NimFriend.fetchUserInfo(res.fromAccount).then((data)=>{
            this.props.navigator.push({
                screen:'JTLL.FriendDetail',
                title:'详细资料',
                passProps:{
                    friendData:data,
                    isRequest:res.status === '1' ?false:true
                }
            });

        })
    }
    delete(res){
        NimSystemMsg.ackAddFriendRequest(res.messageId,res.fromAccount,"0",res.time).then((r)=>{
            Toast.show("拒绝了添加");
        });
    }
    accect(res){

        NimSystemMsg.ackAddFriendRequest(res.messageId,res.fromAccount,"1",res.time).then((r)=>{
            Toast.show("添加成功");
        },(err)=>{
            console.log(err)
        });
    }
    _renderRow(res){
        return(
            <ListItem style={{backgroundColor:'#fff'}} key={res.messageId} onPress={()=>this.toFriendDetail(res)}>
                <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                <Body>
                    <TextNB>
                        {res.name}
                    </TextNB>
                    <TextNB note>{res.verifyText}</TextNB>
                </Body>
                {res.status === '0' ?<TouchableOpacity style={{backgroundColor:'#d82617',borderRadius:3,padding:8}} onPress={()=>this.accect(res)}>
                    <Text style={{color:"#fff",fontSize:13}}>接受</Text>
                </TouchableOpacity>:<TextNB note>已接受</TextNB>}
            </ListItem>
        );
    }
    _renderHiddenRow(res,index){
        return(
            <View style={styles.rowBack}>
                <TouchableOpacity style={styles.deleteBtn} activeOpacity={1} onPress={()=>this.delete(res)}>
                    <TextNB style={{color:'#fff'}}>删除</TextNB>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <Container style={{flex:1,backgroundColor:'#f7f7f7'}}>

                <Content>
                    <View style={{backgroundColor:'#fff'}}>
                        <SwipeListView
                            ref="swList"
                            enableEmptySections
                            disableRightSwipe
                            recalculateHiddenLayout
                            closeOnRowPress={true}
                            tension={-2}
                            friction={5}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}

                            renderHiddenRow={this._renderHiddenRow.bind(this)}
                            rightOpenValue={-75}
                            onRowOpen={()=>this.setState({rowOpen:true})}
                            onRowClose={()=>this.setState({rowOpen:false})}
                            swipeToOpenPercent={5}
                        />
                    </View>

                </Content>

            </Container>
        );
    }
}
const styles = StyleSheet.create({
    deleteBtn:{
        height:67,
        width:75,
        backgroundColor:'#d82617',
        alignItems:'center',
        justifyContent:'center'
    },
    rowBack:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    }

});
