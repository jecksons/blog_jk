import React, {Component} from 'react';
import {Link, widhRouter, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './register.css'


class Register extends Component{

    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            errorMessage: ''
        };
        this.doRegister = this.doRegister.bind(this);
        this.registerUser = this.registerUser.bind(this);

    }


    doRegister(e){        
        e.preventDefault();
        this.registerUser();
    }

    registerUser = async () =>  {
        const {name, email, password} = this.state;

        try {
            await firebase.register(name, email, password)
            .catch((error) => {
                this.setState({errorMessage: error.message});                
            })
            .then(() => {
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
                <h1 className="register-h1">New User </h1>                
                <form onSubmit={this.doRegister} id="register">
                    <label>Nome:</label> 
                    <input type="text" autoFocus value={this.state.name} 
                        onChange={(e) => this.setState({name: e.target.value})} placeholder="Your name" /> <br/>                        
                    <label>Email:</label> 
                    <input type="email" autoComplete="off"  value={this.state.email} 
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
                    <button type="submit">Register</button> 
                </form>
            </div>
        )
    }
}


export default withRouter(Register);