import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './header.css';


class Header extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <header id="main-header">
                <div className="header-content">
                    <Link to="/">
                        Home
                    </Link>
                    <Link to="/login">
                        Login
                    </Link>
                </div>            
            </header>
        )
    }
}


export default Header;
