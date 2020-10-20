import React from "react";
import { Link } from "react-router-dom";
const axios = require("axios");
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;


export class Hypothesis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros",
        hypothesis: []
    };
  }

  async componentDidMount() {
    let self = this;
    await axios
    .get(url_ga_server + "good/hypothesis.php", {
      params: {
        type: "all_hypothesis",
        company: this.state.company
      },
    })
    .then(function (response) {
      let data = response.data;
      self.setState({
        hypothesis: Array.isArray(data) ? data : [],
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  }


  async onDeleteItem(value) {
    // let self = this;
    // await axios
    // .get(url_ga_server + "report/report_data.php", {
    //   params: {
    //     date: value,
    //     type: "delete_return",
    //   },
    // })
    // .then(function (response) {
    //   if(response.data == "yes") {
    //     window.location.reload();
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }


  render() {
    return (
      <div>
        <h1>Гипотезы</h1>
     
        {this.state.hypothesis.length > 0 ? (
                this.state.hypothesis.map((item, index) => (
       
                  <div className="shipment_item" key={index}>
                  <div className="shipment_item_name">
                    {item['name']}({item['status'] == 1 ? "Закрыт" : "Открыт"})
                    Дата начала - {item['was_date']}
                    {item['status'] == 1 ? " Дата закрытия - "+item['date'] : ""} 
                  </div>
                  <div className="shipment_item_name">
                  Автор: {item['user_login']}
                  </div>
                  <Link
                      to={`/hypothesis_item/${item["hyp_id"]}`}
                      target="_blank"
                      className="link_a_red"
                    ><div className="shipment_item_actions">
                    <button>Перейти</button>
                  </div>
                  </Link>
                </div>
                ))
              
              ) : (
                <h1>Нет записей</h1>
              )}
      </div>
    );
  }
}
