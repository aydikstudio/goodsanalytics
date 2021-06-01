import React from "react";
import {
  Checkbox,
  Button,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import {getNameOfCategory} from "../../utils/func.utils.js";
import Modal_Export from "../../components/modal_export";

let config = require("../../config");
let url_ga_server = config.default.url_ga_server;

export class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accept_count: '',
      company: localStorage.getItem('company') || "juveros",
      client: localStorage.getItem('client') || "wb ",
      edit: false,
      login: "",
      order_id: this.props.match.params.id || "",
      status_order: "",
      data_all_goods: [],
      goods: [],
      filteredList: [],
      delected_model: [],
      isNotGoods: false,
      isNotSizes: false,
      isGoods: false,
      date: [],
      categories: [],
      stones: [],
      metalls: [],
      metall: "vse",
      stone: "vse",
      category: "vse",
      pp: 0,
      pp_max: 0,
      price_of_gram_min: 0,
      price_of_gram_max: 0,
      sortByPP: false,
      sortByProdano: false,
      sortByPostavleno: false,
      sortByWillPostavlkaCount: false,
    };

    this.checkIsNotGoods = this.checkIsNotGoods.bind(this);
    this.checkIsNotSizes = this.checkIsNotSizes.bind(this);
    this.checkIsGoods = this.checkIsGoods.bind(this);
    this.submitFilter = this.submitFilter.bind(this);
    this.handleChangeCount = this.handleChangeCount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  async componentDidMount() {
    if (this.state.order_id.length > 0) {
      const self = this;
      await axios
        .get(url_ga_server + "sale/sale_"+this.state.client+"_"+this.state.company+".json")
        .then(function (response) {
          let data = response.data;
          self.setState({
            data_all_goods: data.filter((item) => !item["date"]),
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      await axios
        .get(url_ga_server + "order/order.php", {
          params: {
            name: this.state.order_id,
            type: "number_order",
            company: this.state.company,
            client: this.state.client
          },
        })
        .then(function (response) {
          let data = response.data;
          console.log(data);
          self.setState({
            login: data[0]["user_login"],
            status_order: data[0]["status_order"],
            filteredList: data.map((obj) => {
              let new_data = self.state.data_all_goods.find(
                (item) => item["name"] === obj["name"]
              );
              return { ...obj, ...new_data };
            }),
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      let data = JSON.parse(localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company)) || [];
      this.setState({
        filteredList: data.filter((item) => !item["date"]),
        categories: [
          ...data
            .filter((item) => item["category"])
            .reduce((acc, elem) => acc.add(elem["category"]), new Set()),
        ],
        stones: [
          ...data.reduce((acc, elem) => acc.add(elem["wb_vstavka"]), new Set()),
        ],
        metalls: [
          ...data.reduce((acc, elem) => acc.add(elem["wb_metall"]), new Set()),
        ],
      });
    }

    let login = localStorage.getItem("login");


    if (this.state.order_id.length == 0) {
        this.setState({
          edit: true
        })
    }

    if (this.state.order_id.length == 0 && login == "Kamil.Alievator") {
      this.setState({
        edit: true
      })
  }



      else if (this.state.status_order == 3 || this.state.status_order == 2) {
        if (login == this.state.login) {
          this.setState({
            edit: true
          })
        }
      }


      else if (this.state.status_order == 1) {
        if (login == this.state.login) {
          this.setState({
            accept_count: 'edit'
          })
        }
      }
  }

  checkIsNotGoods(event) {
    const target = event.target;
    const value = target.name === "isNotGoods" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    this.setState({
      goods: this.state.goods.map((obj) => {
        let data = this.state.delected_model.find(
          (item) => item["name"] === obj["name"]
        );
        return { ...obj, ...data };
      }),
    });
  }

  checkIsGoods(event) {
    const target = event.target;
    const value = target.name === "isGoods" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  checkIsNotSizes(event) {
    const target = event.target;
    const value = target.name === "isNotSizes" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleChangeCount(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value || 0,
    });
  }

  delModeldFromListOfDeletedModels(arr_del, arr_all) {
    let arr = [];
    arr_all.map((obj) => {
      if (arr_del.some((item) => item["name"] == obj["name"])) {
        arr = [...arr, arr_all.find((item) => item["name"] === obj["name"])];
      }
    });
    return arr;
  }

  submitFilter() {
    let new_goods = this.delModeldFromListOfDeletedModels(
      this.state.delected_model,
      this.state.data_all_goods
    );

    if (this.state.isNotGoods) {
      new_goods = new_goods.filter(
        (item) => item["wb_retail"] == "Нет в наличии"
      );
    }

    if (this.state.isGoods) {
      new_goods = new_goods.filter(
        (item) => item["wb_retail"] != "Нет в наличии"
      );
    }

    if (this.state.isNotSizes) {
      new_goods = new_goods.filter((item) => item["wb_sizes"] instanceof Array);
    }

    if (this.state.category !== "vse") {
      new_goods = new_goods.filter(
        (item) => item["category"] == this.state.category
      );
    }

    if (this.state.stone !== "vse") {
      new_goods = new_goods.filter(
        (item) => item["wb_vstavka"] == this.state.stone
      );
    }

    if (this.state.metall !== "vse") {
      new_goods = new_goods.filter(
        (item) => item["wb_metall"] == this.state.metall
      );
    }

    if (this.state.pp.length > 0) {
      new_goods = new_goods.filter((item) => item["pp"] >= this.state.pp);
    }

    if (this.state.pp_max.length > 0) {
      new_goods = new_goods.filter((item) => item["pp"] <= this.state.pp_max);
    }

    this.setState({
      goods: new_goods.filter((item) => !item["date"]),
      filteredList: new_goods.filter((item) => !item["date"]),
    });
  }

  filterList(e) {
    var filteredList = [];
    if (this.state.goods.length > 0) {
      var filteredList = this.state.goods.filter(function (item) {
        return (
          item["name"]
            .toLowerCase()
            .search(e.target.value.trim().toLowerCase()) !== -1
        );
      });

      if (filteredList.length == 0) {
        var filteredList = this.state.goods.filter(function (item) {
          return (
            item["wb_art"]
              .toLowerCase()
              .search(e.target.value.trim().toLowerCase()) !== -1
          );
        });
      }

      this.setState({ filteredList });
    } else {
      this.submitFilter();
    }
  }

  sortOfGoods(event) {
    const target = event.target;
    const name = target.innerText;

    if (name == "Артикул") {
      if (this.state.sortByName) {
        this.state.filteredList.sort(function (a, b) {
          return b["name"] > a["name"] ? 1 : -1;
        });
        this.setState({
          sortByName: !this.state.sortByName,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["name"] > b["name"] ? 1 : -1;
        });
        this.setState({
          sortByName: !this.state.sortByName,
        });
      }
    }

    if (name == "Процент продаваемости") {
      if (this.state.sortByPP) {
        this.state.filteredList.sort(function (a, b) {
          return b["pp"] - a["pp"];
        });
        this.setState({
          sortByPP: !this.state.sortByPP,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["pp"] - b["pp"];
        });
        this.setState({
          sortByPP: !this.state.sortByPP,
        });
      }
    }

    if (name == "Поставлено") {
      if (this.state.sortByPostavleno) {
        this.state.filteredList.sort(function (a, b) {
          return b["postavleno"] - a["postavleno"];
        });
        this.setState({
          sortByPostavleno: !this.state.sortByPostavleno,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["postavleno"] - b["postavleno"];
        });
        this.setState({
          sortByPostavleno: !this.state.sortByPostavleno,
        });
      }
    }

    if (name == "Продано") {
      if (this.state.sortByProdano) {
        this.state.filteredList.sort(function (a, b) {
          return b["prodano"] - a["prodano"];
        });
        this.setState({
          sortByProdano: !this.state.sortByProdano,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["prodano"] - b["prodano"];
        });
        this.setState({
          sortByProdano: !this.state.sortByProdano,
        });
      }
    }
  }

  clearOrder() {
    localStorage.removeItem("goods_order_"+this.state.client+"_"+this.state.company);
    window.location.reload();
  }

  async addToOrderToModarate(e) {
    const self = this;
    const event = e;

    if (this.state.filteredList.length > 0) {
      let good_add = this.state.filteredList;
      const options = {
        headers: { "Content-Type": "application/json" },
        type: "add_order",
        data: JSON.stringify(good_add),
        company:  this.state.company,
        client: this.state.client
      };

      await axios
        .post(url_ga_server + "order/order.php", options)
        .then(function (response) {
          if (response.data == 1) {
            alert("Заказ на модерации.");
            localStorage.removeItem("goods_order_"+this.state.client+"_"+this.state.company);
            window.location.reload();
          } else {
            alert("Ошибка.");
          }
        })
        .catch(function (error) {
          console.log(error);
        });

        localStorage.removeItem("goods_order_"+this.state.client+"_"+this.state.company);
    } else {
      alert("Заполните описание");
    }

    event.preventDefault();
  }


  async editToOrderToModarate(e, status_order) {
    const self = this;
    const event = e;

    if (this.state.filteredList.length > 0) {
      let good_add = this.state.filteredList;
      const options = {
        headers: { "Content-Type": "application/json" },
        type: "edit_order",
        data: JSON.stringify(good_add),
        number_order: this.state.order_id,
        company:  this.state.company,
        status_order: status_order,
        client: this.state.client
      };


      await axios
        .post(url_ga_server + "order/order.php", options)
        .then(function (response) {
          if (response.data == 1 && status_order == 0) {
            alert("Заказ на модерации.");
            window.location.reload();
          } else if (response.data == 1 && status_order == 1) {
            alert("Обновлено.");
            window.location.reload();
          }
          else {
            alert("Ошибка.");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        localStorage.removeItem("goods_order_"+this.state.client+"_"+this.state.company);
    } else {
      alert("Заполните описание");
    }

    event.preventDefault();
  }


  
  changeCountOfGood(e) {
    let good_array;

    let new_array = this.state.filteredList.map((item) => {
      if (item["wb_art"] == e.target.name) {
        item["order_count"] = e.target.value;
      }

      return item;
    });

    if (localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company)) {
      good_array = JSON.parse(localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company));
    }

    localStorage.setItem("goods_order_"+this.state.client+"_"+this.state.company, JSON.stringify(new_array));

    this.setState({
      filteredList: new_array,
    });
  }

  changeCountOfGoodAccept(e) {
    let good_array;

    let new_array = this.state.filteredList.map((item) => {
      if (item["wb_art"] == e.target.name) {
        item["accept_count"] = e.target.value;
      }

      return item;
    });

    if (localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company)) {
      good_array = JSON.parse(localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company));
    }

    localStorage.setItem("goods_order_"+this.state.client+"_"+this.state.company, JSON.stringify(new_array));

    this.setState({
      filteredList: new_array,
    });
  }



  changeTextOfGood(e) {
    let good_array;

    let new_array = this.state.filteredList.map((item) => {
      if (item["wb_art"] == e.target.name) {
        item["comment"] = e.target.value;
      }

      return item;
    });

    if (localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company)) {
      good_array = JSON.parse(localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company));
    }

    localStorage.setItem("goods_order_"+this.state.client+"_"+this.state.company, JSON.stringify(new_array));

    this.setState({
      filteredList: new_array,
    });
  }

  deletedGoodFromOrder(e) {
    let good_array;

    let new_array = this.state.filteredList.filter(
      (item) => item["wb_art"] != e.target.name
    );

    if (localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company)) {
      good_array = JSON.parse(localStorage.getItem("goods_order_"+this.state.client+"_"+this.state.company));
    }

    localStorage.setItem("goods_order_"+this.state.client+"_"+this.state.company, JSON.stringify(new_array));

    this.setState({
      filteredList: new_array,
    });

    e.preventDefault();
  }

  getActions() {

    let login = localStorage.getItem("login");


        if (login == "Kamil.Alievator" && this.state.status_order == 0) {
          return (
            <div className="actions">
              <a href="#" className="action_green"  onClick={(e) => this.aproveOrder(e)}>
                одобрить
              </a>
              <a href="#" className="action_red" onClick={(e) => this.changeStatus(2)}>
                отклонить
              </a>
            </div>
          );
          
          
        } else if (login == this.state.login && this.state.status_order == 0) {

          return (
            <div className="actions">
              <a href="#" className="action_green" onClick={(e) => this.changeStatus(3)}>
                редактировать
              </a>
              <a href="#" className="action_red" onClick={(e) => this.changeStatus('delete')}>
                удалить
              </a>
            </div>
          );

        }

        else if  ((login == this.state.login) && (this.state.status_order == 3 || this.state.status_order == 2)) {
          return (
            <div className="actions">
              <a href="#" className="action_green" onClick={(e) => this.editToOrderToModarate(e, 0)}>
                на модерацию
              </a>
              <a href="#" className="action_red" onClick={(e) => this.changeStatus('delete')}>
                удалить
              </a>
            </div>
          );
        }
      
      
        
        else if  (login == this.state.login && this.state.status_order == 1) {
          return (
            <div className="actions">
              <a href="#" className="action_green" onClick={(e) => this.editToOrderToModarate(e, 1)}>
                Обновить
              </a>
            </div>
          );
        }

        else {
          return (
            <div className="actions">
              <a
                href="#"
                className="action_green"
                onClick={(e) => this.addToOrderToModarate(e)}
              >
                оформить заказ
              </a>
              <a
                href="#"
                onClick={() => this.clearOrder()}
                className="action_red"
              >
                очистить заказ
              </a>
            </div>
          );
        }
          
      
  
  
       
      } 
  
 
   


  async aproveOrder(e) {

    let options = {
      headers: { "Content-Type": "application/json" },
      number_order: this.state.order_id,
      status: 1,
      type: "aprove_order",
      data: JSON.stringify(this.state.filteredList),
      client: this.state.client
    }

    await axios
    .post(url_ga_server + "order/order.php", options)
    .then(function (response) {
      let data = response.data;
      if(data) {
        alert('Заказ отправлен');
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    e.preventDefault()
  }

  async changeStatus(val) {
    
    await axios
    .get(url_ga_server + "order/order.php", {
      params: {
        number_order: this.state.order_id,
        status: val,
        type: "update_status",
        client: this.state.client
      },
    })
    .then(function (response) {
      let data = response.data;
      console.log(data);
      if(data == 1) {
        alert('Статус обновлен');
      }

      if(data == 0) {
        alert('Заказ удален');
      }

      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
   
    return (
      <div>
        <h1>Заказ {this.state.order_id || ""}</h1>
        <div className="sort">
          <div className="checkboxes">
            <div className="block_form_checkbox">
              <Checkbox
                name="isGoods"
                type="checkbox"
                checked={this.state.isGoods}
                onChange={this.checkIsGoods}
              />
              в наличии
            </div>

            <div className="block_form_checkbox">
              <Checkbox
                name="isNotGoods"
                type="checkbox"
                checked={this.state.isNotGoods}
                onChange={this.checkIsNotGoods}
              />
              нет в наличии
            </div>

            <div className="block_form_checkbox">
              <Checkbox
                name="isNotSizes"
                type="checkbox"
                checked={this.state.isNotSizes}
                onChange={this.checkIsNotSizes}
              />
              нет размеров
            </div>
          </div>

          <div className="categories">
            <div className="block_form_category">
              <InputLabel id="category">Категория</InputLabel>
              <Select
                labelId="category"
                name="category"
                id="select_category"
                value={this.state.category}
                onChange={this.handleChange}
              >
                <MenuItem value="vse">Все</MenuItem>
                {this.state.categories.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="block_form_category">
              <InputLabel id="stone">Вставка</InputLabel>
              <Select
                labelId="stone"
                name="stone"
                id="select_stone"
                value={this.state.stone}
                onChange={this.handleChange}
              >
                <MenuItem value="vse">Все</MenuItem>
                {this.state.stones.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="block_form_category">
              <InputLabel id="metall">Металл</InputLabel>
              <Select
                labelId="metall"
                name="metall"
                id="select_metall"
                value={this.state.metall}
                onChange={this.handleChange}
              >
                <MenuItem value="vse">Все</MenuItem>
                {this.state.metalls.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="block_form_category">
              <InputLabel id="pp">Мин. процент продаваемости</InputLabel>
              <input
                type="text"
                className="input_sort"
                value={this.state.value}
                name="pp"
                onChange={this.handleChangeCount}
              />
            </div>

            <div className="block_form_category">
              <InputLabel id="pp_max">Макс. процент продаваемости</InputLabel>
              <input
                type="text"
                className="input_sort"
                value={this.state.value}
                name="pp_max"
                onChange={this.handleChangeCount}
              />
            </div>

            <div className="block_form_category">
              <InputLabel id="pp">Мин. цена за грамм</InputLabel>
              <input
                type="text"
                className="input_sort"
                value={this.state.value}
                name="price_of_gram_min"
                onChange={this.handleChangeCount}
              />
            </div>

            <div className="block_form_category">
              <InputLabel id="pp">Макс. цена за грамм</InputLabel>
              <input
                type="text"
                className="input_sort"
                value={this.state.value}
                name="price_of_gram_max"
                onChange={this.handleChangeCount}
              />
            </div>
          </div>
          <div className="block_form_search_fast">
            <InputLabel id="fast_search">Быстрый поиск артикула</InputLabel>
            <input
              type="text"
              className="input_sort"
              value={this.state.value}
              name="fast_search"
              onChange={this.filterList}
            />
          </div>
          <div className="block_form_search_fast">
                Ответственный(ая): <b>{getNameOfCategory(this.state.category)}</b>
          </div>

          <Modal_Export data={this.state.filteredList}/>

          <Button className="button_filter" onClick={this.submitFilter}>
            Отфильтровать
          </Button>
          {this.getActions()}
        </div>

        <div id="content">
          <p className="goods_count">
            Найдено: {this.state.filteredList.length || 0}
          </p>
          <table>
            <thead>
              <tr className="header_table">
                <th name="sortByName" onClick={(e) => this.sortOfGoods(e)}>
                  Артикул
                </th>
                <th>Артикул WB</th>
                <th>Категория</th>
                <th name="sortByDelivery" onClick={(e) => this.sortOfGoods(e)}>
                  Поставлено
                </th>
                <th name="sortBySell" onClick={(e) => this.sortOfGoods(e)}>
                  Продано
                </th>
                <th name="sortByPP" onClick={(e) => this.sortOfGoods(e)}>
                  Процент продаваемости
                </th>
                <th>Кол-во заказанного</th>
                <th>Кол-во получено</th>
                <th>Комментарии</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredList.length > 0 ? (
                this.state.filteredList.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/good/${item["wb_art"]}`}
                        target="_blank"
                        className="link_a_red"
                      >
                        {item["name"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/good/${item["wb_art"]}`}
                        target="_blank"
                        className="link_a_red"
                      >
                        {item["wb_art"]}
                      </Link>
                    </td>
                    <td>{item["category"]}</td>
                    <td>{item["postavleno"]} шт.</td>
                    <td>{item["prodano"]} шт.</td>
                    <td>{item["pp"]} %</td>
                    <td>
                      <input
                        disabled={!this.state.edit ? "disabled" : ""}
                        type="text"
                        className="order_count_goods"
                        value={item["order_count"]}
                        name={item["wb_art"]}
                        onChange={(e) => this.changeCountOfGood(e)}
                      />
                    </td>
                    <td>
                      <input
                        disabled={this.state.accept_count != 'edit' ? "disabled" : ""}
                        type="text"
                        className="order_count_goods"
                        value={item["accept_count"]}
                        name={item["wb_art"]}
                        onChange={(e) => this.changeCountOfGoodAccept(e)}
                      />
                    </td>
                    <td>
                      <textarea
                        name={item["wb_art"]}
                        onChange={(e) => this.changeTextOfGood(e)}
                        disabled={!this.state.edit ? "disabled" : ""}
                      >
                        {item["comment"]}
                      </textarea>
                    </td>
                    <td>
                      {this.state.edit ? <Link name={item["wb_art"]} target="_blank" className="link_a_red" onClick={(e) => this.deletedGoodFromOrder(e)}>удалить</Link> : '' }
                    </td>
                  </tr>
                ))
              ) : (
                <h1>Нет записей</h1>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
