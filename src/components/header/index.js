import React from "react";
import "./header.css";
import { Button } from "@material-ui/core";
import {createBrowserHistory} from 'history'
import axios from 'axios';
let config = require("../../config");
let url_ga_server = config.default.url_ga_server;

export class Header extends React.Component {

  constructor(props) {
    super(props);

    this.exitAutho = this.exitAutho.bind(this);
  }

  async exitAutho() {
    await axios
      .get(url_ga_server + "exit.php")
      .then((res) => {
        window.location.reload();
      });
  }


  render() {
    
    return (
      <div>
      <div id="header">
        <div className="top">
          <div id="logo">
            <a href="/" id="portfolio-link">
              <img src="../images/logo.png" width="150" />
            </a>
          </div>
  
          <nav id="nav">
            <ul>
              <li>
                <a href="/" id="portfolio-link">
                  <span className="icon solid">Продажи</span>
                </a>
                <a href="/choosed" id="portfolio-link">
                  <span className="icon solid">Выборка</span>
                </a>
                <a href="/deleted_model" id="portfolio-link">
                  <span className="icon solid">Удаленные модели</span>
                </a>
                <a href="/reports" id="portfolio-link">
                  <span className="icon solid">Отчеты</span>
                </a>
                <a href="/hypothesis" id="portfolio-link">
                  <span className="icon solid">Гипотезы</span>
                </a>
                <a href="/orders" id="portfolio-link">
                  <span className="icon solid">Заказы</span>
                </a>
                <a href="/order" id="portfolio-link">
                  <span className="icon solid">Заказ</span>
                </a>
                <a href="/basket" id="portfolio-link">
                  <span className="icon solid">Корзина</span>
                </a>
                <a href="/setting" id="portfolio-link">
                  <span className="icon solid">Настройка</span>
                </a>
                <Button  onClick={this.exitAutho}>
                  Выйти
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    );
  }
}

