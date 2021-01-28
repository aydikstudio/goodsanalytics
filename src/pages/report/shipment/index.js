import React from "react";
const axios = require("axios");
let config = require("../../../config/");
let url_ga_server = config.default.url_ga_server;

export class Shipment_report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros",
      client: localStorage.getItem('client') || "wb ",
      goods: []
    };
  }

  async componentDidMount() {
    let self = this;
    await axios
    .get(url_ga_server + "report/report_data.php", {
      params: {
        name: this.state.good_name,
        type: "all_shipment",
        company: this.state.company,
        client: this.state.client
      },
    })
    .then(function (response) {
      self.setState({
        goods:  response.data.sort(
          (a, b) =>
            new Date(...b.date.split("/").reverse()) -
            new Date(...a.date.split("/").reverse())
        ),
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  async onDeleteItem(value) {
    let self = this;
    await axios
    .get(url_ga_server + "report/report_data.php", {
      params: {
        date: value,
        type: "delete_shipment",
        client: this.state.client
      },
    })
    .then(function (response) {
      if(response.data == "yes") {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <h1>Отгрузка</h1>
        <a href="/add_shipment">
          <div className="add_report">+</div>
        </a>
        {this.state.goods.length > 0 ? (
                this.state.goods.map((item, index) => (
                  <div className="shipment_item" key={index}>
                  <div className="shipment_item_name">
                    {item['date']}
                  </div>
        
                  <div className="shipment_item_actions">
                    <button onClick={() => this.onDeleteItem(item['date'])}>удалить</button>
                  </div>
                </div>
                ))
              ) : (
                <h1>Нет записей</h1>
              )}
       
        
      </div>
    );
  }
}
