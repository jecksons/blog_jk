import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './dashboard.css';

class Dashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.nome,
            email: ''
        };
        this.logout = this.logout.bind(this);
    }

    logout = async () =>{
        await firebase.logout()
        .catch((error) => {
            console.log(error);
        });
        localStorage.removeItem("nome");
        this.props.history.push('/');        
    }

    async componentDidMount(){
        if (!firebase.getCurrent()){
            this.props.history.replace('/login');
            return null;
        }
        firebase.getUserName((info) => {
            localStorage.nome = info.val().nome;
            this.setState({name: localStorage.nome});
        });
        this.setState({email: firebase.getCurrent()}) ;
    }

    render(){
        return (
        <div id="dashboard">            
            <div className="user-info">
                <h1>Olá {this.state.name}</h1>
                <Link to="/dashboard/newpost">Novo post</Link>
            </div>            
            <p>Logado com email {this.state.email}</p>
            <button onClick={() => {this.logout()}}>Logout</button>
        </div>
        );
    }
}


export default  withRouter(Dashboard);