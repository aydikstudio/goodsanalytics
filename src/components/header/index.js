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
      company: localStorage.getItem("company") || "juveros",
      client: localStorage.getItem("client") || "wb"
    };

    this.exitAutho = this.exitAutho.bind(this);
    this.selectCompany = this.selectCompany.bind(this);
    this.selectClient = this.selectClient.bind(this);
    this.checkHaveContract = this.checkHaveContract.bind(this);
  }

  async exitAutho() {
    await axios.get(url_ga_server + "exit.php").then((res) => {
      window.location.reload();
    });
  }

  selectCompany(event) {
    const target = event.target;
    if(this.checkHaveContract(target.value, this.state.client)) {
      localStorage.setItem("company", target.value);
      window.location.reload();
    } else {
      alert("Между данными контрагентами нет договора.");
    }
  }

  selectClient(event) {
    const target = event.target;
    if(this.checkHaveContract(this.state.company, target.value)) {
      localStorage.setItem("client", target.value);
      window.location.reload();
    } else {
      alert("Между данными контрагентами нет договора.");
    }
    
  }

  checkHaveContract(company, client) {
    if((company == 'juveros' && client == 'wb') || (company == 'ipalievkb' && client == 'wb') || (company == 'ipalievkb' && client == 'ozon')) {
      return true;
    } 
    else {
      return false;
    }
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
                  <Select
                    value={this.state.company}
                    name="company"
                    onChange={this.selectCompany}
                  >
                    <MenuItem selected value="juveros">
                      Юверос
                    </MenuItem>
                    <MenuItem value="ipalievkb">ИП Алиев КБ</MenuItem>
                  </Select>
                </li>
                <li>
                  <Select
                    value={this.state.client}
                    name="client"
                    onChange={this.selectClient}
                  >
                    <MenuItem selected value="wb">
                      Wildberries
                    </MenuItem>
                    <MenuItem value="ozon">Ozon</MenuItem>
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
