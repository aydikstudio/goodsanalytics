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

export class Hypothesis_item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros",
      hip_id: this.props.match.params.id,
      good_name: "",
      good_was: {},
      good: {},
      img: ""
    };
  }

  async componentDidMount() {

    const self = this;
    await axios
    .get(url_ga_server + "good/hypothesis.php", {
      params: {
        type: "item_hypothesis",
        item: this.state.hip_id,
        company: this.state.company
      },
    })
    .then(function (response) {
      self.setState({
        good_was: response.data[0] || {}
      })(self.getInfo())
    })
    .catch(function (error) {
      console.log(error);
    });

  }


  async getInfo() {
    const self = this;

    if(this.state.good_was["status"] == 0) {
      await axios
      .get(url_ga_server + "sale/sale_"+this.state.company+".json")
      .then(function (response) {
        self.setState({
          good: response.data.filter(
            (item) => item["wb_art"] == self.state.good_was["wb_art"]
          )[0],
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      self.setState({
        good: this.state.good_was
      });
    }
   
    axios
      .get(
        url_ga_server + "parser_img.php?art=" + self.state.good_was["wb_art"]
      )
      .then(function (response) {
        const img = response.data;
        self.setState({
          img,
        });
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  

  async finishedHypothesis() {

    const self = this;

    const options = {
      headers: { 'Content-Type': 'application/json' },
      type: 'update_hypothesis',
      hip_id: this.state.hip_id,
      data: JSON.stringify(this.state.good),
      company: this.state.company
   };

      await axios
      .post( url_ga_server + "good/hypothesis.php", options)
      .then(function (response) {
        console.log(response);
          if(response.data == 1) {
            window.location.replace('/');
          }

      })
      .catch(function (error) {
        console.log(error);
      });

  }


  async deletedHypothesis() {
    const self = this;
    await axios
    .get(url_ga_server + "good/hypothesis.php", {
      params: {
        type: "delete_hypothesis",
        item: this.state.hip_id,
        company: this.state.company
      },
    })
    .then(function (response) {
      if(response.data == 1) {
        window.location.replace('/');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  render() {
    return (
      <div>
        <h1>Гипотеза № {this.state.hip_id}. {this.state.good_was['user_login']}</h1>
        <div className="hypothesis_img">
              <img src={this.state.img} />
            </div>
          <div className="hypothesis_date">
          <b>Было({this.state.good_was["was_date"]})</b>
            </div>

          <div className="hypothesis_info">
            <p>
              Артикул: <b><Link
                      to={`/good/${this.state.good_was["wb_art"]}`}
                      target="_blank"
                      className="link_a_red"
                    >{this.state.good_was["name"]}</Link></b>
            </p>
            <p>
              Артикул WB:{" "}
              <b>
                <a
                  href={`https://www.wildberries.ru/catalog/${this.state.good_was["wb_art"]}/detail.aspx`}
                  target="_blank"
                  className="link_a_red"
                >
                  {this.state.good_was["wb_art"]}
                </a>
              </b>
            </p>
            <p>
              Поставлено: <b>{this.state.good_was["was_ship"]} шт.</b>
            </p>
            <p>
              Продано: <b>{this.state.good_was["was_sale"]} шт.</b>
            </p>
            <p>
              Процент продаваемости: <b>{(this.state.good_was["was_sale"]/this.state.good_was["was_ship"]*100).toFixed()}%</b>
            </p>
            <p>
                Описание: <p><b>{this.state.good_was["description"]}</b></p>
            </p>
          </div>

        
        <hr />
        <div className="hypothesis_date">
    <b> {this.state.good_was["date"] && this.state.good_was["status"] == 1 ? "Cтало("+this.state.good_was["date"]+")" : "Текущее состояние"}</b>
    <div className="hypothesis_info">
          </div>
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
              Процент продаваемости: <b>{(this.state.good["prodano"]/this.state.good["postavleno"]*100).toFixed()}%</b>
            </p>
          </div>


        <div className="hypothesis_actions clear">
          <a href="#" className="good_action_red" onClick={(e) => this.deletedHypothesis(e)}>Удалить</a>
          {this.state.good_was["status"] == 0 ? <a href="#" className="good_action_blue" onClick={(e) => this.finishedHypothesis(e)}>Завершить</a> : "" }
        </div>

        </div>
    );
  }
}
