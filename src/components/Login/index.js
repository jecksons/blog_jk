import React, {Component} from 'react';
import {Link, widhRouter, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './login.css';

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };
        this.doLogin = this.doLogin.bind(this);
        this.loginUser = this.loginUser.bind(this);

    }

    componentDidMount(){
        if (firebase.getCurrent()) {
            return this.props.history.replace('dashboard');
        }
    }

    doLogin(e){        
        e.preventDefault();
        this.loginUser();
    }

    loginUser = async () =>  {
        const {email, password} = this.state;

        try {
            await firebase.login(email, password)
            .catch((error) => {                
                this.setState({errorMessage: error.message });
            }).then(() => {
                if (firebase.getCurrent()) {
                    this.props.history.replace('/dashboard');
                }
            }
            );            
        } catch (error){
            this.setState({errorMessage: `Error: ${error.code}` });
        }

        
    }


    render() {
        return (
            <div>
                <form onSubmit={this.doLogin} id="login">
                    <label>Email:</label> 
                    <input type="email" autoComplete="off" autoFocus value={this.state.email} 
                        onChange={(e) => this.setState({email: e.target.value})} placeholder="email@email.com" /> <br/>                        
                    <label>Password:</label> 
                    <input type="password" value={this.state.password} 
                        onChange={(e) => this.setState({password: e.target.value})} placeholder="Your password" />  <br/>                        
                    {
                        this.state.errorMessage !== '' && 
                        <div className="div-error">
                            <strong>{this.state.errorMessage}</strong> <br/>
                        </div>                        
                    }
                    <button type="submit">Login</button> 
                    <Link to="/register">Still don't have an account?</Link>
                </form>
            </div>
        )
    }
}


export default withRouter(Login);