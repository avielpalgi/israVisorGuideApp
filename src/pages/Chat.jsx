import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import '../Css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { Container } from "shards-react";
import '../Css/Chat.css';
import ChatBox from '../Components/ChatBox';
import WelcomeCard from '../Components/WelcomeCard';
import profilePic from '../Img/Default-welcomer.png';
import ReactLoading from 'react-loading'
import TouristProfile from '../Components/TouristProfile';
import moment from 'moment'
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore, myStorage,myFirebase} from '../services/firebase'
//import images from '../Themes/Images'
//import './ChatBoard.css';
import AppString from '../Components/Const'
//import {AppString} from './../Const'
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navbar: this.props.navbarOpenCheck,
            messages: [],
            Guide: this.props.Guide,
            currentPeerUser: null,
            displayedContactSwitchedNotification: [],
            discplayedContacts: [],
            isLoading: true,
            tourist:this.props.tourist,
            openToruist:false
        }
        this.currentUserIdchat = localStorage.getItem("idChat")
        this.currentUserDocumentId = localStorage.getItem('docId');
        // this.currentUserMessages = localStorage.getItem('Messages');
        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
        this.notificationErase = this.notificationErase.bind(this);
        this.updaterenderList = this.updaterenderList.bind(this);
        this.notificationMessagesErase = [];
        this.searchUsers = [];
        this.currentUserMessages = [];
    }
    ConnectFirebase = async () => {
        await myFirebase.auth().signInWithEmailAndPassword(this.state.Guide.Email, this.state.Guide.PasswordGuide)
            .then(async result => {
                let user = result.user;
                if (user) {
                    await myFirestore.collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                console.log(doc.id);
                                const currentdata = doc.data()
                                console.log(currentdata)
                                localStorage.setItem('docId', doc.id);
                                localStorage.setItem('idChat', currentdata.id);
                            })
                        })
                }
            })
        console.log(localStorage.getItem('docId'));
        console.log(localStorage.getItem('idChat'));
    }
    componentDidMount() {
        let guideTemp = JSON.parse(localStorage.getItem('Guide'));
        this.setState({
            Guide: guideTemp
        })
        if (this.currentUserDocumentId !== null) {
            myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
                .then((doc) => {
                    doc.data().messages.map((item) => {
                        this.currentUserMessages.push({
                            notificationId: item.notificationId,
                            number: item.number
                        })
                    })
                    this.setState({
                        displayedContactSwitchedNotification: this.currentUserMessages
                    })
                })
            this.getListUser();
        }
        else {
            this.ConnectFirebase();
            if (this.currentUserDocumentId !== null) {
                myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
                    .then((doc) => {
                        doc.data().messages.map((item) => {
                            this.currentUserMessages.push({
                                notificationId: item.notificationId,
                                number: item.number
                            })
                        })
                        this.setState({
                            displayedContactSwitchedNotification: this.currentUserMessages
                        })
                    })
                this.getListUser();
            }
        }

    }
    getListUser = async () => {
        const result = await myFirebase.firestore().collection('users').get();
        if (result.docs.length > 0) {
            let listUsers = []
            listUsers = [...result.docs]
            console.log(listUsers);
            listUsers.forEach((item, index) => {
                this.searchUsers.push({
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    name: item.data().name,
                    messages: item.data().messages,
                    URL: item.data().URL,
                    type: item.data().type,
                    guideEmail: item.data().guideEmail

                })
            })
        }
        this.renderListUser();
    }

    getClassnameforUserandNotification = (itemId) => {
        let number = 0
        let className = ""
        let check = false;
        if (this.state.currentPeerUser && this.state.currentPeerUser.id === itemId) {
            className = 'viewWrapItemFocused'
        }
        else {
            this.state.displayedContactSwitchedNotification.forEach((item) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true
                        number = item.number
                    }

                }
            })
            if (check) {
                className = "viewWrapItemNotification"
            }
            else {
                className = "viewWrapItem"
            }
        }
        return className;
    }

    notificationErase = (itemId) => {
        this.state.displayedContactSwitchedNotification.forEach((el) => {
            if (el.notificationId.length > 0) {
                if (el.notificationId !== itemId) {
                    this.notificationMessagesErase.push({
                        notificationId: el.notificationId,
                        number: el.number

                    })
                }
            }
        })
        this.updaterenderList();
    }

    updaterenderList = () => {
        myFirebase.firestore().collection('users').doc(this.currentUserDocumentId).update(
            { messages: this.notificationMessagesErase }
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }

    renderListUser = () => {
        if (this.searchUsers.length > 0) {
            let viewListUser = [];
            let classname = "";
            this.searchUsers.map((item) => {
                if (item.id !== this.currentUserIdchat && item.id !== undefined && item.type == "Tourist" && item.guideEmail === this.state.Guide.Email) {
                    console.log(item);
                    classname = this.getClassnameforUserandNotification(item.id);
                    viewListUser.push(
                        <button
                            id={item.key}
                            className={classname}
                            onClick={() => {
                                this.notificationErase(item.id)
                                this.setState({
                                    currentPeerUser: item,
                                    displayedContactSwitchedNotification: this.notificationMessagesErase
                                })
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                if (document.getElementById(item.key)) {
                                    document.getElementById(item.key).style.color = '#fff';
                                }
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={profilePic}
                                alt=""
                                placeholder=""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    Name: {item.name}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                                <div className="notificationpragraph">
                                    <p id={item.key} className="newmessages">New messages</p>
                                </div> : null}
                        </button>
                    )
                }
            })
            this.setState({
                discplayedContacts: viewListUser,
                isLoading: false
            })
        }
        else {
            console.log("No user is Present")
        }
    }
    componentWillMount() {

    }


    onProfileClick = () => {
        this.setState({
            openToruist:!this.state.openToruist
        })
        console.log(this.state.openToruist)
    }


    render() {
        return (
            <Container fluid id={this.props.navbarOpenCheck} className="HomePageContainer" >
                <div className="root">
                    <div className="body">
                        <div className="viewListUser">
                            <div className="profileviewleftside">
                                <img
                                    className="ProfilePicture"
                                    alt=""
                                    src={this.state.Guide.ProfilePic}
                                onClick={this.onProfileClick}
                                />
                            </div>
                            {this.state.discplayedContacts}
                        </div>
                        <div className="viewBoard">
                            {this.state.currentPeerUser ? (
                                <ChatBox currentPeerUser={this.state.currentPeerUser} showToast={this.props.showToast} Guide={this.state.Guide} />) : (<WelcomeCard currentUserName={this.state.Guide.FirstName}
                                    currentUserPhoto={this.state.Guide.ProfilePic}
                                />
                                )}
                        </div>
                    </div>
                    {/* Loading */}
                    {this.state.isLoading ? (
                        <div className="viewLoading">
                            <ReactLoading
                                type={'spin'}
                                color={'#203152'}
                                height={'3%'}
                                width={'3%'}
                            />
                        </div>
                    ) : null}
                     {this.state.openToruist ? (
                        <div>
                            <TouristProfile
                                navbarOpenCheck={this.state.navbar} 
                                tourist={this.state.tourist}
                            />
                        </div>
                    ) : null}
                </div>
            </Container>
        )
    }
}

export default withRouter(Chat)