import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router';

class FriedList extends Component {
	constructor(props){
        super(props);
        
        this.state = {
            friendList: [],
            searchList: [],
            _isSearch: false,
            _left: new Set()
        };

        this.socket = props.socket;
        this.dispatch = this.props.dispatch;
        this.userFind = this.userFind.bind(this);
        this.friendAdd = this.friendAdd.bind(this);
        this.checkSMS = this.checkSMS.bind(this);

        this.socket.on('msg', (data) => {
			if(!this.props.getUID()) {
                this.state._left.add(data.from);
				this.forceUpdate();
			}
		});
    }
    
	componentDidMount () {
        this.getFriends();
        this.checkSMS();        
    }

    checkSMS () {
        fetch('/chat/left', {
            credentials: "same-origin"
        })
        .then(out => out.json())
        .then(out => {
            this.setState(st => {
                let set = new Set(st._left);
                out.forEach(el => set.add(el.from));
                return { _left: set };
            });
        });
    }

    getFriends () {
        fetch('/user/friends', {
            credentials: "same-origin"
        })
        .then(out => out.json())
        .then(friendList => {
            this.setState({ friendList });
        });
    }

    userFind (e) {
        let val = e.target.value;
        
        if(val && val.length>0){
            fetch('/user/find/'+val, {
                credentials: "same-origin"
            })
            .then(out => out.json())
            .then(searchList => {
                this.setState({ searchList, _isSearch: true });
            });
        }
        else{
            this.setState({ _isSearch: false });
            this.getFriends();
        }
    }

    friendAdd (id) {
        fetch('/user/friends/'+id, {
            method: "POST",
            credentials: "same-origin",
            body: id
		})
		.then(out => out.json())
		.then(out => {
            if(!out.code){
                this.refs.userFindInput.value = '';
                this.setState({ _isSearch: false, searchList: [] });
                this.getFriends();
            }
		});
    }

	render() {
        let search = this.state._isSearch,
        list = search ? this.state.searchList : this.state.friendList;
        
		return (
			<div>
				<div className="head">
                    <div className="goback"></div>
                    <div className="title">Friends list</div>
                    <div className="div"></div>
                </div>
                <div className="seach">
                    <input onChange={ this.userFind } ref="userFindInput" placeholder="Search users" type="text"/>
                </div>
                <div>
                    <ul className="list">
                        { list &&
                            !list.length
                            ?
                                <li className="msg">{ search ? "No results found" : "You don't have friends yet, but you can find new using the search form in top..." }</li>
                            :
                                list.map((el) => 
                                    <li className={"user"+(this.state._left.has(el._id)?" nsms":"")} key={el._id}>
                                        <Link to={"/chat/"+el._id}>
                                            <img className="ava" src={el.haveAvatar?"/users/"+el._id+".png":"/images/icons/avatar.png"}/>
                                            <span className="name">{el.name.first+" "+el.name.last} <span className="nick">@{el.username}</span></span>
                                        </Link>
                                        { search && !el.friend && <div className="addFriend" onClick={()=>this.friendAdd(el._id)}>+</div>}
                                    </li>
                                )
                        }
                    </ul>
                </div>
			</div>
		);
	}
}

export default connect()(FriedList);
