import React from "react";
import "./header.css";
import { Button, Select, MenuItem } from "@material-ui/core";
import { createBrowserHistory } from "history";
import axios from "axios";
let config = require("../../config");
let url_ga_server = config.default.url_ga_server;

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros"
    }

    this.exitAutho = this.exitAutho.bind(this);
    this.selectCompany = this.selectCompany.bind(this);
  }

  async exitAutho() {
    await axios.get(url_ga_server + "exit.php").then((res) => {
      window.location.reload();
    });
  }

  selectCompany(event) {
    const target = event.target;
    localStorage.setItem('company', target.value);
    window.location.reload();
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
                  <li>
                    <a href="/choosed" id="portfolio-link">
                      <span className="icon solid">Выборка</span>
                    </a>
                  </li>
                  <li>
                    <a href="/deleted_model" id="portfolio-link">
                      <span className="icon solid">Удаленные модели</span>
                    </a>
                  </li>
                  <li>
                    <a href="/reports" id="portfolio-link">
                      <span className="icon solid">Отчеты</span>
                    </a>
                  </li>
                  <li>
                    <a href="/hypothesis" id="portfolio-link">
                      <span className="icon solid">Гипотезы</span>
                    </a>
                  </li>
                  <li>
                    <a href="/orders" id="portfolio-link">
                      <span className="icon solid">Заказы</span>
                    </a>
                  </li>
                  <li></li>
                  <a href="/order" id="portfolio-link">
                    <span className="icon solid">Заказ</span>
                  </a>
                </li>
                <li>
                  <a href="/basket" id="portfolio-link">
                    <span className="icon solid">Корзина</span>
                  </a>
                </li>
                <li>
                  <a href="/setting" id="portfolio-link">
                    <span className="icon solid">Настройка</span>
                  </a>
                </li>
                <li>
                  <Select value={this.state.company} name="company" onChange={this.selectCompany}>
                    <MenuItem selected value="juveros">Юверос</MenuItem>
                    <MenuItem value="ipalievkb">ИП Алиев КБ</MenuItem>
                  </Select>
                </li>
                <Button onClick={this.exitAutho}>Выйти</Button>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
