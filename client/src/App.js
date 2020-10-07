import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
// import { Route, Switch, withRouter } from "react-router-dom";
// import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";

import ButtonSelector from './components/ButtonSelector';

import Dashboard from "./components/dashboard/Dashboard";

import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            transcriptLocationHash: localStorage.getItem("transcriptLocationHash") || ""
        };
    }
    componentWillMount() {
        // console.log("componentWillMount");
        // update ButtonSelector selected option on drilldown
        // this.unlisten = this.props.history.listen((location, action) => {
        var location = window.location;
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
            // var transcriptLocationHash = location.hash || "";

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            // localStorage.setItem("transcriptLocationHash", transcriptLocationHash);

            this.setState({
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                // transcriptLocationHash: transcriptLocationHash
            });
        // });
    }

    componentWillUnmount() {
        // console.log("componentWillUnmount");
        // this.unlisten();
    }

    // componentDidMount() {
    //     console.log("componentDidMount");
    //     // If logged in and user navigates to Register page, should redirect them to dashboard
    //     var buttonSelectorSelectedOption = this.state.buttonSelectorSelectedOption || localStorage.getItem("buttonSelectorSelectedOption"),
    //         transcriptLocationHash = this.state.transcriptLocationHash || localStorage.getItem("transcriptLocationHash");
    //     console.log("buttonSelectorSelectedOption", buttonSelectorSelectedOption, "transcriptLocationHash", transcriptLocationHash);
    //     console.log("localStorage", localStorage);
    //     this.props.history.push(`/dashboard/${buttonSelectorSelectedOption}${transcriptLocationHash}`);
    // }

    handleClick(value) {
        console.log("value", value);
        localStorage.setItem("buttonSelectorSelectedOption", value);
        this.setState({
            buttonSelectorSelectedOption: value
        });

        console.log("this.state", this.state);
    }
    render() {
        return (
          <Provider store={store}>
            {/* Routers can only have one child element */}
            <Router>
              <div className="app-container">
                <Navbar />

                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />

                {/* coarse, medium, and fine-grained visualizations */}
                <ButtonSelector
                  selectedOption={this.state.buttonSelectorSelectedOption}
                  handleClick={this.handleClick.bind(this)} />

                <Switch>
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
                  <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
                  <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
                </Switch>
              </div>
            </Router>
          </Provider>
        );
    }
}

export default withRouter(App);
// export default App;
