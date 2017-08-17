import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router';
import io from 'socket.io-client' 

class Chat extends Component {
	constructor(props){
		super(props);

		this.state = {
			userChat: { name: { } },
			userSelf: { name: { } },
			smsList: [],
			hvaSMS: false
		};

		this.uid = this.props.match.params.userID;
		this.socket = props.socket;
		this.dispatch = this.props.dispatch;

		this.sendSMS = this.sendSMS.bind(this)
		this.formKeyDown = this.formKeyDown.bind(this)

		this.props.setUID(this.uid);
	}

	componentWillMount () {
		fetch('/chat/left/'+this.uid, { credentials: "same-origin", method: "PUT" });
	}

	componentDidMount () {
		this._container = document.getElementById('push_container');
		let chatBox = this.refs.chatBox;

		window.onscroll = () => {
			chatBox.parentElement.scrollTop = this.getWindowScroll();
		};

		this.refs.textarea.focus();

		fetch('/user/'+this.uid, {
            credentials: "same-origin"
		})
		.then(out => out.json())
		.then(out => {
            if(!out.code){
                this.setState({ userChat: out });
            }
		});

		fetch('/user', {
            credentials: "same-origin"
		})
		.then(out => out.json())
		.then(out => {
            if(!out.code){
                this.setState({ userSelf: out });
            }
		});

		fetch('/chat/'+this.uid, {
            credentials: "same-origin"
		})
		.then(out => out.json())
		.then(smsList => {
            this.setState({ smsList });
		});
	
		this.socket.on('msg', (data) => {
			if(!data) {
				return false;
			}

			if(this.props.checkUID(data.from)) {
				fetch('/chat/left/'+this.uid, { credentials: "same-origin", method: "PUT" });

				this.setState(prevState => {
					return { smsList : [...prevState.smsList, data] } 
				});
			}
			else {
				this.setState({ hvaSMS: true });
			}
		});
	}

	componentDidUpdate () {
		this.resizeWindow();
	}

	componentWillUnmount () {
		this.props.setUID(null);
		this.props.checkSMS();
	}
	
	getWindowScroll () {
		return (window.pageYOffset || document.documentElement.scrollTop);
	}

	resizeWindow () {
		let chatBox = this.refs.chatBox;
		
		if(this._container) {
			this._container.style.height = chatBox.clientHeight + "px";
			chatBox.scrollTop = chatBox.scrollHeight;
			window.scrollTo(0, document.body.clientHeight);
		}
	}

	sendSMS () {
		let textarea = this.refs.textarea;
		let newState = {
			smsList: [
				...this.state.smsList,
				{
					text: textarea.value,
					from: this.state.userSelf._id,
					to: this.state.userChat._id,
					data: new Date()
				}
			]
		};

		this.setState(newState);
		this.socket.emit("msg", {f: this.uid, v: textarea.value});
	
		textarea.value = "";
	}

	formKeyDown (e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			this.sendSMS();
		}
	}

	render() {
		const userChat = this.state.userChat,
			  userSelf = this.state.userSelf;

		return (
			<div>
				<div className="head">
                    <div className="goback">
						<Link to="/"><img src="/images/icons/goback.png"/></Link>
						{ this.state.hvaSMS && <div className="hvaSMS">+1</div> }
					</div>
                    <div className="title">{ userChat.name.first ? userChat.name.first + " " + userChat.name.last : '' }</div> 
                    <div className="div">
					</div>
                </div>
				<div className="chatBox">
					<div className="ovf">
						<ul ref="chatBox">
							{
								this.state.smsList.map((sms, id) => (
									<li className={ sms.from == userSelf._id ?"msms":"" } key={id}>
										<div style={{backgroundImage: "url(/images/icons/avatar.png)"}} className="avatar"/>
										<div>
											<div className="name">{ sms.from == userChat._id ? userChat.name.first : userSelf.name.first }</div>
											<div className="sms">{ sms.text }</div>
										</div>
									</li>
								))
							}
						</ul>
					</div>
					<form onSubmit={e => e.preventDefault()}>
						<textarea ref="textarea" onKeyDown={this.formKeyDown}/>
						<div className="send" onClick={this.sendSMS}></div>
					</form>
				</div>
			</div>
		);
	}
}

export default connect()(Chat);
