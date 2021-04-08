import React from "react";
import "./App.css";
import { Login } from "./pages/login/";
import { Pages } from "./pages";
import axios from "axios";
let config = require("./config");
let url_ga_server = config.default.url_ga_server;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: 0,
    };
  }

  checkHaveContract(company1, client1) {
    if (
      (company1 == "juveros" && client1 == "wb") ||
      (company1 == "ipalievkb" && client1 == "wb") ||
      (company1 == "ipalievkb" && client1 == "ozon")
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    let ref = this;
    const searchString = new URLSearchParams(window.location.search);
    const company = searchString.get("company") || "";
    const client = searchString.get("client") || "";
    if (company.length > 0) {
      localStorage.setItem("company", company);
    }

    if (client.length > 0) {
      localStorage.setItem("client", client);
    }

    if (company.length > 0 && client.length > 0) {
      if (this.checkHaveContract(company, client)) {
        if (company.length > 0) {
          localStorage.setItem("company", company);
        }

        if (client.length > 0) {
          localStorage.setItem("client", client);
        }
      } else {
        localStorage.setItem("company", "ipalievkb");
        localStorage.setItem("client", "ozon");
      }
    }

    axios.get(url_ga_server + "session_check.php").then((res) => {
      if (res.data == "0") {
        ref.setState({
          auth: 1,
        });
      }
    });
  }

  render() {
    return (
      <div className="App">{this.state.auth == 0 ? <Pages /> : <Login />}</div>
    );
  }
}
