import React from "react";
import "./App.css";
import { Login } from "./pages/login/";
import { Pages } from "./pages";
import axios from 'axios';
let config = require("./config");
let url_ga_server = config.default.url_ga_server;




export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: 0
    }
  }

  componentDidMount() { 
    let ref = this;
    axios
      .get(url_ga_server + "session_check.php")
      .then((res) => {
          if (res.data == "0") {
            ref.setState({
               auth: 1
             })
          }
      });
  }

  render() {
    return (
      <div className="App">
        {this.state.auth == 0 ? <Pages /> : <Login />}
      </div>
    );
  }
}
