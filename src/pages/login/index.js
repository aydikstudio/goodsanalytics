import React from "react";
import "./login.css";
import { Button, InputLabel } from "@material-ui/core";
import {createBrowserHistory} from 'history'
let config = require("../../config");
let url_ga_server = config.default.url_ga_server;
const axios = require("axios");

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submitForm() {
    var dostup = this.state;


    if (dostup.login.length > 0 && dostup.password.length > 0) {
      const self = this;
      axios
        .post(url_ga_server+'dostup.php', {
            login: dostup.login,
            password: dostup.password
          })
        .then(function(response) {
            if(response.data) {
                alert("Авторизация прошла успешно");
                localStorage.setItem('name', response.data);
                localStorage.setItem('login', dostup.login);
                window.location.reload();
            }

            if(response.data == 0) {
                alert("Логин и пароль и/или пароль неверные");
            }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {});
    } else {
      alert("Заполните все поля");
    }
  }

  render() {
    return (
      <div>
        <form id="forma" name="form_login">
          <div className="forms_blocks">
            <div className="form_block">
              <InputLabel id="login">Логин</InputLabel>
              <input
                type="text"
                className="login"
                name="login"
                onChange={this.handleChange}
              />
            </div>

            <div className="form_block">
              <InputLabel id="password">Пароль</InputLabel>
              <input
                type="password"
                className="password"
                name="password"
                onChange={this.handleChange}
              />
            </div>

            <div className="form_block">
              <Button className="button_form" onClick={this.submitForm}>
                Войти
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
