import React from "react";
import { Link } from "react-router-dom";
const axios = require("axios");
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;


export class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        orders: []
    };
  }

  async componentDidMount() {
    let self = this;
    await axios
    .get(url_ga_server + "order/order.php", {
      params: {
        type: "all_orders",
      },
    })
    .then(function (response) {
      let data = response.data;
      self.setState({
        orders: data
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  getStatus(val) {
      if(val == 0) {
          return 'На модерации'
      } else if(val == 1) {
          return 'Одобрено'
      } else if(val == 2) {
        return 'Отклонено'
    } else if(val == 3) {
      return 'Редактируется'
  }
    
  }

  render() {
    return (
      <div>
        <h1>Заказы</h1>
     
        {this.state.orders.length > 0 ? (
                this.state.orders.map((item, index) => (
                    <div className="shipment_item" key={index}>
                    <div className="shipment_item_name">
                      {item['number_order']}
                    </div>
                    <div className="shipment_item_name">
                      {item['user_login']}
                    </div>
                    <div className="shipment_item_name">
                     {this.getStatus(item['status_order'])}
                     {item['status_order'] == 1 ? ' '+item['date'] : ''}
                    </div>
                    <Link
                      to={`/order/${item["number_order"]}`}
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
