import React from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-date-picker";
import {getNameOfCategory, getStatus} from "../../utils/func.utils.js"

const axios = require("axios");
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;
let _ = require("lodash");


export class Good extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros",
      good_week: {
        sale_week_ostatok: 0,
        sale_week_prodano: 0
      },
      good: [],
      deficites: [],
      good_id: this.props.match.params.id,
      img: "",
      good_name: "",
      status_act: "no",
      shipment: [],
      sale: [],
      returned: [],
      fromDate: "",
      fromDateShow: "",
      toDateShow: "",
      toDate: "",
      statsShipment: 0,
      statsSale: 0,
      stateReturn: 0,
      hypothesis: [],
      status_backet_good: 0,
      waitinglist: [],
      itogoShipment: 0,
      itogoSales: 0,
      itogoVozvrati: 0,
      orders: [],
      turnoverlist: [{
        status: 'нет данных',
        days: 'нет данных'
      }]
    };
  }

  async componentDidMount() {
    const self = this;

    await axios
      .get(url_ga_server + "sale/sale_"+this.state.company+".json")
      .then(function (response) {
        self.setState({
          good: response.data.filter(
            (item) => item["wb_art"] == self.state.good_id
          )[0],
          good_name: response.data.filter(
            (item) => item["wb_art"] == self.state.good_id
          )[0].name,
        })(self.getInfo());
      })
      .catch(function (error) {
        console.log(error);
      });

      


    await axios
      .get(url_ga_server + "report/report_data.php", {
        params: {
          name: this.state.good_name,
          type: "shipment",
          company: this.state.company
        },
      })
      .then(function (response) {
        self.setState({
          shipment: response.data.sort(
            (a, b) =>
              new Date(...b.date.split("/").reverse()) -
              new Date(...a.date.split("/").reverse())
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    await axios
      .get(url_ga_server + "report/report_data.php", {
        params: {
          name: this.state.good_name,
          type: "sale",
          company: this.state.company
        },
      })
      .then(function (response) {
        self.setState({
          sale: response.data.sort(
            (a, b) =>
              new Date(...b.date.split("/").reverse()) -
              new Date(...a.date.split("/").reverse())
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    await axios
      .get(url_ga_server + "report/report_data.php", {
        params: {
          name: this.state.good_name,
          type: "return",
          company: this.state.company
        },
      })
      .then(function (response) {
        self.setState({
          returned: response.data.sort(
            (a, b) =>
              new Date(...b.date.split("/").reverse()) -
              new Date(...a.date.split("/").reverse())
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    await axios
      .get(url_ga_server + "good/hypothesis.php", {
        params: {
          type: "good_hypothesis",
          item: this.state.good_id,
          company: this.state.company
        },
      })
      .then(function (response) {
        self.setState({
          hypothesis: Array.isArray(response.data) ? response.data : [],
        })(self.checkBasket());
      })
      .catch(function (error) {
        console.log(error);
      });
      await axios
      .get(url_ga_server + "order/order.php", {
        params: {
          type: "item_order_name",
          name: this.state.good_name,
          company: this.state.company
        },
      })
      .then(function (response) {
        console.log(response)
        self.setState({
          orders: Array.isArray(response.data) ? response.data : [],
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    await axios
      .get(url_ga_server + "waitinglist/waitinglist_"+this.state.company+".json")
      .then(function (response) {
        self.setState({
          waitinglist: response.data.filter(
            (item) => item["wb_art"] == self.state.good_id
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });


    await axios
      .get(url_ga_server + "deficit/deficit_"+this.state.company+".json")
      .then(function (response) {
        self.setState({
          deficites: response.data.filter(
            (item) => item["name"] == self.state.good_name
          ).sort(
            (a, b) =>
              a.sizes -  b.sizes
          )
        });
      })
      .catch(function (error) {
        console.log(error);
      });

      await axios
      .get(url_ga_server + "turnover/turnover_"+this.state.company+".json")
      .then(function (response) {
        self.setState({
          turnoverlist: response.data.filter(
            (item) => item["wb_art"] == self.state.good_id
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });



      await axios
      .get(url_ga_server + "sale_week/sale_week_"+this.state.company+".json")
      .then(function (response) {
        console.log()
        self.setState({
          good_week: response.data.filter(
            (item) => item["sale_week_name"] == self.state.good_name
          )[0] || this.state.good_week
        });
      })
      .catch(function (error) {
        console.log(error);
      });


  }


  


  getInfo = () => {

    const self_img = this;
    axios
      .get(
        url_ga_server + "parser_img.php?art=" + self_img.state.good["wb_art"]
      )
      .then(function (response) {
        const img = response.data;
        self_img.setState({
          img,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});

    axios
      .get(
        url_ga_server + "good/check_good.php?check_name=" + this.state.good_name
      )
      .then(function (response) {
        self_img.setState({
          status_act: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  };

  changeStateGood = () => {
    const self = this;
    axios
      .get(
        url_ga_server + "good/check_good.php?act_name=" + this.state.good_name
      )
      .then(function (response) {
        self.setState({
          status_act: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  };

  setFromDate = (date) => {
    let date_from = this.formatDate(date);

    this.setState({
      fromDate: date_from,
      fromDateShow: date,
    });
  };

  setToDate = (date) => {
    let date_to = this.formatDate(date);

    this.setState({
      toDate: date_to,
      toDateShow: date,
    });
  };

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }

  showStats(e) {
    e.preventDefault();

    let statsShipment,
      statsSale,
      statsReturn = 0;

    if (this.state.toDate.length > 0 && this.state.fromDate.length) {
      if (this.state.shipment.length > 0) {
        statsShipment = this.state.shipment
          .filter(
            (item) =>
              item.date.split("/").reverse() <=
                this.state.toDate.split("/").reverse() &&
              item.date.split("/").reverse() >=
                this.state.fromDate.split("/").reverse()
          )
          .map((item) => parseInt(item.count))
          .reduce((prev, curr) => prev + curr || 0);
      }

      if (this.state.sale.length > 0) {
        statsSale = this.state.sale
          .filter(
            (item) =>
              item.date.split("/").reverse() <=
                this.state.toDate.split("/").reverse() &&
              item.date.split("/").reverse() >=
                this.state.fromDate.split("/").reverse()
          )
          .map((item) => parseInt(item.count))
          .reduce((prev, curr) => prev + curr || 0);
      }

      if (this.state.returned.length > 0) {
        statsReturn = this.state.returned
          .filter(
            (item) =>
              item.date.split("/").reverse() <=
                this.state.toDate.split("/").reverse() &&
              item.date.split("/").reverse() >=
                this.state.fromDate.split("/").reverse()
          )
          .map((item) => parseInt(item.count))
          .reduce((prev, curr) => prev + curr || 0);
      }

      this.setState({
        statsShipment,
        statsSale,
        statsReturn,
      });
    } else {
      alert("Выберите все даты");
    }
  }

  checkBasket() {
    if (localStorage.getItem("goods_basket_"+this.state.company)) {
      let good_array = JSON.parse(localStorage.getItem("goods_basket_"+this.state.company));
      if (
        good_array.some((good_item) => good_item.name == this.state.good.name)
      ) {
        this.setState({
          status_backet_good: 1,
        });
      } else {
        this.setState({
          status_backet_good: 0,
        });
      }
    }
  }

  addBasket() {
    if (this.state.status_backet_good == 0) {
      if (localStorage.getItem("goods_basket_"+this.state.company)) {
        let good_array = JSON.parse(localStorage.getItem("goods_basket_"+this.state.company));
        good_array.push(this.state.good);
        localStorage.setItem("goods_basket_"+this.state.company, JSON.stringify(good_array));
      } else {
        let good_array = [];
        good_array.push(this.state.good);
        localStorage.setItem("goods_basket_"+this.state.company, JSON.stringify(good_array));
      }
      this.setState({
        status_backet_good: 1,
      });
    } else {
      let good_array = JSON.parse(localStorage.getItem("goods_basket_"+this.state.company));
      good_array = good_array.filter(
        (item) => item.name != this.state.good["name"]
      );
      localStorage.setItem("goods_basket_"+this.state.company, JSON.stringify(good_array));

      this.setState({
        status_backet_good: 0,
      });
    }
  }

  render() {
    return (
      <div>
        <div id="content">
          <div id="good">
            <div className="goods_img">
              <img src={this.state.img} />
            </div>
            <div className="goods_info">
              <p>
                Артикул: <b>{this.state.good["name"]}</b>
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
                Процент выкупа:{" "}
                <b>
                  {this.state.good["order"] == 0
                    ? 0
                    : Math.round(
                        (this.state.good["prodano"] /
                          this.state.good["order"]) *
                          100
                      )}
                  %
                </b>
              </p>
              <p>
                Процент продаваемости:{" "}
                <b>
                  {this.state.good["pp"] == "NaN" ? 0 : this.state.good["pp"]}%
                </b>
              </p>
              
              {/* <p>
                Вернули поставщику:{" "}
                <b>{this.state.good["returned_whosaler"]} шт.</b>
              </p>
              <p>
                Вернули клиенты:{" "}
                <b>{this.state.good["returned_from_client"]} шт.</b>
              </p> */}
              <p>
                Заказано: <b>{this.state.good["order"]} шт.</b>
              </p>
            
              <p>
                Остаток:{" "}
                <b>{this.state.good["ostatok"]} шт.</b>
              </p>
              <p>
                Оборачиваемость: <b>{this.state.turnoverlist[0]['days']} (дней)</b>
              </p>
              <p>
                Неликвид:  <b>{this.state.turnoverlist[0]['status']}</b>
              </p>
              <p>
                Ориентировочная стоимость за хранение:  <b>{this.state.turnoverlist[0]['days'] > 60 && this.state.good_week["sale_week_ostatok"] > 0 ? (((this.state.good_week["sale_week_ostatok"] - this.state.good_week["sale_week_prodano"]/7*60)*0.5*7).toFixed())+" руб. заплатили за предыдущею неделю" : "Ничего не платим"} </b>
              </p>
              <p>
                Категория: <b>{this.state.good["category"]}</b>
              </p>
              <p>
                Ответственный(ая): <b>{getNameOfCategory(this.state.good["category"])}</b>
              </p>
              <p>
                Розничная цена на WB: <b>{this.state.good["wb_retail"]} руб.</b>
              </p>
              <p>
                Минимальный вес на WB: <b>{this.state.good["wb_weigth"]}</b>
              </p>
              <p>
                Цена за грамм:{" "}
                <b>{this.state.good["wb_price_of_gramm"]} руб.</b>
              </p>
              <p>
                Вставка: <b>{this.state.good["wb_vstavka"]}</b>
              </p>
              <p>
                Металл: <b>{this.state.good["wb_metall"]}</b>
              </p>
              <p>
                Все размеры: <b>{this.state.good["wb_all_sizes"]}</b>
              </p>
              <p>
                Отсутствующие размеры: <b>{this.state.good["wb_no_sizes"]}</b>
              </p>
              <p>
                Рейтинг: <b>{0 || this.state.good["wb_reiting"]}</b>
              </p>
              <p>
                Описание: <b>{this.state.good["desc"]}</b>
              </p>
            </div>
            <div className="good_actions">
              <div className="good_action">
                {this.state.status_act == "no" ? (
                  <b>загрузка</b>
                ) : (
                  <a
                    href="#"
                    onClick={() => this.addBasket()}
                    className={
                      this.state.status_backet_good == 0
                        ? "good_action_blue"
                        : "good_action_red"
                    }
                  >
                    {this.state.status_backet_good == 0
                      ? "Добавить в корзину"
                      : "Удалить из корзины"}
                  </a>
                )}
              </div>
              <div className="good_action">
                {this.state.status_act == "no" ? (
                  <b>загрузка</b>
                ) : (
                  <a
                    href="#"
                    onClick={() => this.changeStateGood()}
                    className={
                      this.state.status_act == 0
                        ? "good_action_red"
                        : "good_action_blue"
                    }
                  >
                    {this.state.status_act == 0
                      ? "Удалить из списка"
                      : "Добавить в список"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="clear">
          <div className="good_stats">
            <div className="good_stat">
              <b>Последние поставки</b>
              <table border="1">
                <tr>
                  <th>Кол-во</th>
                  <th>Дата</th>
                </tr>
                {this.state.shipment.length > 0 ? (
                  this.state.shipment.map((item, index) => (
                    <tr key={index}>
                      <td>{item["count"]}</td>
                      <td>{item["date"]}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}
                {this.state.shipment.length > 0 ? (
                  <tr>
                    <td>
                      Итого:{" "}
                      {this.state.shipment
                        .map((item) => parseInt(item.count))
                        .reduce((prev, curr) => prev + curr || 0)}{" "}
                      
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </table>
            </div>

            <div className="good_stat">
              <b>Последние продажи</b>
              <table border="1">
                <tr>
                  <th>Кол-во</th>
                  <th>Дата</th>
                </tr>
                {this.state.sale.length > 0 ? (
                  this.state.sale.map((item, index) => (
                    <tr key={index}>
                      <td>{item["count"]}</td>
                      <td>{item["date"]}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}

                {this.state.sale.length > 0 ? (
                  <tr>
                    <td>
                      Итого:{" "}
                      {this.state.sale
                        .map((item) => parseInt(item.count))
                        .reduce((prev, curr) => prev + curr || 0)}{" "}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </table>
            </div>

            <div className="good_stat">
              <b>Последние возвраты</b>
              <table border="1">
                <tr>
                  <th>Кол-во</th>
                  <th>Дата</th>
                </tr>
                {this.state.returned.length > 0 ? (
                  this.state.returned.map((item, index) => (
                    <tr key={index}>
                      <td>{item["count"]}</td>
                      <td>{item["date"]}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}

                {this.state.returned.length > 0 ? (
                  <tr>
                    <td>
                      Итого:{" "}
                      {this.state.returned
                        .map((item) => parseInt(item.count))
                        .reduce((prev, curr) => prev + curr || 0)}{" "}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </table>
            </div>

            <div className="good_stat">
              <b>Лист ожидания WB</b>
              <table border="1">
                <tr>
                  <th>Размер</th>
                  <th>Кол-во</th>
                </tr>
                {this.state.waitinglist.length > 0 ? (
                  this.state.waitinglist.map((item, index) => (
                    <tr key={index}>
                      <td>{item["sizes"]}</td>
                      <td>{item["count"]}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}
                {this.state.waitinglist.length > 0 ? (
                  <tr>
                    <td>
                      Итого:{" "}
                      {this.state.waitinglist
                        .map((item) => parseInt(item.count))
                        .reduce((prev, curr) => prev + curr || 0)}{" "}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </table>
            </div>

            
          </div>
        </div>
        

        <div className="clear">
          <div className="good_stats">
            <div className="good_stat">
              <b>Дефицит WB</b>
              <table border="1">
                <tr>
                  <th>Размер</th>
                  <th>Кол-во</th>
                </tr>
                {this.state.deficites.length > 0 ? (
                  this.state.deficites.map((item, index) => (
                    <tr key={index}>
                      <td>{item["sizes"]}</td>
                      <td>{item["count"]}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}
                {this.state.deficites.length > 0 ? (
                  <tr>
                    <td>
                      Итого:{" "}
                      {this.state.deficites
                        .map((item) => parseInt(item.count))
                        .reduce((prev, curr) => prev + curr || 0)}{" "}
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </table>
            </div>
          </div>
        </div>

          <div className="good_stats">
            <div className="good_stat">
              <b>Заказы</b>
              <table border="1">
                <tr>
                  <th>Номер заказа</th>
                  <th>Заказано</th>
                  <th>Получено</th>
                  <th>Статус по заявке</th>
                  <th>Дата изменения заказа</th>
                  <th>Статус заказа</th>
                </tr>
                {this.state.orders.length > 0 ? (
                  this.state.orders.map((item, index) => (
                    <tr key={index}>
                      <td>
                      <Link
                        to={`/order/${item["number_order"]}`}
                        target="_blank"
                        className="link_hypothesis"
                      >
                        {item["number_order"]}
                      </Link>
                    </td>
                      <td>{item["order_count"]}</td>
                      <td>{item["accept_count"]}</td>
                      <td>{parseInt(item["accept_count"]) >= parseInt(item["order_count"])  ? "Выполнен" : "Невыполнен"}</td>
                      <td>{item["date"] || 'Не отправлен'}</td>
                      <td>{getStatus(item["status_order"])}</td>
                    </tr>
                  ))
                ) : (
                  <h1>Нет записей</h1>
                )}
              </table>
            </div>
          </div>

        <div className="clear">
          <div className="good_state_setting">
            <b>Статистика за период</b>
            <form>
              <label>
                От{" "}
                <DatePicker
                  name=""
                  id=""
                  onChange={(e) => this.setFromDate(e)}
                  format="dd/MM/yy"
                  value={this.state.fromDateShow}
                />
              </label>
              <label>
                До{" "}
                <DatePicker
                  name=""
                  id=""
                  onChange={(e) => this.setToDate(e)}
                  format="dd/MM/yy"
                  value={this.state.toDateShow}
                />
              </label>
              <button className="show_stats" onClick={(e) => this.showStats(e)}>
                Отобразить
              </button>
              <table border="1">
                <tr>
                  <th>Поставлено</th>
                  <th>Остаток(с учетом возврата)</th>
                  <th>Продано</th>
                  <th>ПП</th>
                  <th>ПП с учетом возврата</th>
                  <th>Возвращено</th>
                </tr>
                <tr>
                  <td>{this.state.statsShipment || 0}</td>
                  <td>
                    {this.state.statsShipment - this.state.statsReturn || 0}
                  </td>
                  <td>{this.state.statsSale || 0}</td>
                  <td>
                    {Math.floor(
                      (this.state.statsSale / this.state.statsShipment) * 100
                    ) || 0}
                  </td>
                  <td>
                    {Math.floor(
                      (this.state.statsSale /
                        (this.state.statsShipment - this.state.statsReturn)) *
                        100
                    ) || 0}
                  </td>
                  <td>{this.state.statsReturn || 0}</td>
                </tr>
              </table>
            </form>
          </div>
          <div className="hypothesis">
            <b>Гипотезы</b>
            <Link
              to={`/hypothesis_add/${this.state.good_id}`}
              target="_blank"
              className="link_hypothesis"
            >
              Добавить гипотезу
            </Link>
            <table border="1">
              <tr>
                <th>Номер</th>
                <th>Статус</th>
              </tr>
              {this.state.hypothesis.length > 0 ? (
                this.state.hypothesis.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/hypothesis_item/${item["hyp_id"]}`}
                        target="_blank"
                        className="link_hypothesis"
                      >
                        {item["hyp_id"]}
                      </Link>
                    </td>
                    <td>{item["status"] == 0 ? "Открыт" : "Закрыт"}</td>
                  </tr>
                ))
              ) : (
                <h1>Нет записей</h1>
              )}
            </table>
          </div>
       
        </div>
      </div>
    );
  }
}
