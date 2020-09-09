import React from "react";
import {
  Checkbox,
  Button,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-date-picker";
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;

export class Hypothesis_add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      good: {},
      good_id: this.props.match.params.id,
      desc: "Что будем делать?",
    };
  }

  async componentDidMount() {
    const self = this;

    await axios
      .get(url_ga_server + "sale/sale.json")
      .then(function (response) {
        self.setState({
          good: response.data.filter(
            (item) => item["wb_art"] == self.state.good_id
          )[0],
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

 async addHypothesis (e) {
    const self = this;

    if (this.state.desc.length > 0) {
      let good_add = this.state.good;
      good_add.desc = this.state.desc;
      const options = {
        headers: { 'Content-Type': 'application/json' },
        type: 'add_hypothesis',
        data: JSON.stringify(good_add)
    };


      await axios
      .post( url_ga_server + "good/hypothesis.php", options)
      .then(function (response) {
          console.log(response.data);
          if(response.data == 1) {
            alert("Гипотеза добавлена.");
            window.location.replace('/');
          } else {
            alert("Ошибка.");
          }

      })
      .catch(function (error) {
        console.log(error);
      });

    } else {
      alert("Заполните описание");
    }

    e.preventDefault();
  };

  onChangeDesc = (e) => {
    this.setState({
      desc: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <h1>Добавить гипотезу</h1>
        <div id="good">
          <div className="goods_info">
            <p>
              Артикул: <b><Link
                      to={`/good/${this.state.good["wb_art"]}`}
                      target="_blank"
                      className="link_a_red"
                    >{this.state.good["name"]}</Link></b>
            </p>
            <p>
              Артикул WB:{" "}
              <b>
                <a
                  href={`https://www.wildberries.ru/catalog/${this.state.good["wb_art"]}/detail.aspx`}
                  target="_blank"
                  className="link_a_red"
                >
                  {this.state.good["wb_art"]}
                </a>
              </b>
            </p>
            <p>
              Поставлено: <b>{this.state.good["postavleno"]} шт.</b>
            </p>
            <p>
              Продано: <b>{this.state.good["prodano"]} шт.</b>
            </p>
            <p>
              Процент продаваемости: <b>{this.state.good["pp"]}%</b>
            </p>
          </div>

          <div className="goods_info">
            <textarea
              row="20"
              value={this.state.desc}
              onChange={(e) => this.onChangeDesc(e)}
            />
            <br />
            <button
              className="show_stats"
              onClick={(e) => this.addHypothesis(e)}
            >
              Создать гипотезу
            </button>
          </div>
        </div>
      </div>
    );
  }
}
