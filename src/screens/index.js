import { Navigation } from 'react-native-navigation';

import Login from './Login';
import Chat from './Chat';
import ChatList from './ChatList';
import FriendList from './FriendList';
import FriendDetail from './FriendDetail';
import CreateTeam from './CreateTeam';
import NewFriend from './NewFriend';
import RemoveUsers from './RemoveUsers';
import SessionTeamDetail from './SessionTeamDetail';
import SessionUserDetail from './SessionUserDetail';
import SendAddFriend from './SendAddFriend';
import UpdateTeamName from './UpdateTeamName';
import SearchScreen from './SearchScreen';
import SelectUsers from './SelectUsers';
import LocationPicker from './LocationPicker';
import LocationView from './LocationView';
import MyInfo from './MyInfo';
import Register from './Register';

export default function () {
    Navigation.registerComponent('JTLL.Login', () => Login);
    Navigation.registerComponent('JTLL.Chat', () => Chat);
    Navigation.registerComponent('JTLL.ChatList', () => ChatList);
    Navigation.registerComponent('JTLL.FriendList', () => FriendList);
    Navigation.registerComponent('JTLL.FriendDetail', () => FriendDetail);
    Navigation.registerComponent('JTLL.CreateTeam', () => CreateTeam);
    Navigation.registerComponent('JTLL.NewFriend', () => NewFriend);
    Navigation.registerComponent('JTLL.RemoveUsers', () => RemoveUsers);
    Navigation.registerComponent('JTLL.SessionTeamDetail', () => SessionTeamDetail);
    Navigation.registerComponent('JTLL.SessionUserDetail', () => SessionUserDetail);
    Navigation.registerComponent('JTLL.SendAddFriend', () => SendAddFriend);
    Navigation.registerComponent('JTLL.UpdateTeamName', () => UpdateTeamName);
    Navigation.registerComponent('JTLL.SearchScreen', () => SearchScreen);
    Navigation.registerComponent('JTLL.SelectUsers', () => SelectUsers);
    Navigation.registerComponent('JTLL.LocationView', () => LocationView);
    Navigation.registerComponent('JTLL.LocationPicker', () => LocationPicker);
    Navigation.registerComponent('JTLL.MyInfo', () => MyInfo);
    Navigation.registerComponent('JTLL.Register', () => Register);

}