import React, {useEffect, useState, Component} from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import logo from './images/logo-rectangle.png';

import AuthService from "./services/auth.service";

import Home from "./components/home.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Main from "./components/main.page.jsx";

import background from './images/background.png';
import Web3 from "web3";
import RouletteContract from './contracts/Roulette.json';

class App extends Component {

  // state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount = async () => {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  };

  logOut() {
    AuthService.logout();
  }

  render() {

    const { currentUser } = this.state;

    return (
      <div
        className="App" style={{ backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover', 
        overflow: 'hidden',
        width: '100vw',
        height: '100vh'}}
      >
        <nav className="navbar navbar-expand navbar-dark ">
          <Link className="navbar-brand" to={"/"}> 
            <img className="logo" src={logo} alt="Logo" />
          </Link>

          <div className="navbar-nav mr-auto">

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                { this.state.account}
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/main" component={Main} />
            <Route exact path="/user" component={BoardUser}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
