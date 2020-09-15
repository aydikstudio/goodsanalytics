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

export class Choosed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_all_goods: [],
      goods: [],
      filteredList: [],
      orders: [],
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
      sortByName: false,
      sortByCategory: false,
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
    this.getOrderData = this.getOrderData.bind(this);
  }

  async componentDidMount() {
    let self = this;

    await axios
      .get(url_ga_server + "sale/sale.json")
      .then(function (response) {
        let data = response.data;
        self.setState({
          data_all_goods: data.filter((item) => !item["date"]),
          date: data.map((item, index) => item["date"]),
          categories: [
            ...data
              .filter((item) => item["category"])
              .reduce((acc, elem) => acc.add(elem["category"]), new Set()),
          ],
          stones: [
            ...data.reduce(
              (acc, elem) => acc.add(elem["wb_vstavka"]),
              new Set()
            ),
          ],
          metalls: [
            ...data.reduce(
              (acc, elem) => acc.add(elem["wb_metall"]),
              new Set()
            ),
          ],
        })(self.getOrderData());
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getOrderData() {
    let self = this;
    axios
      .get(url_ga_server + "preorder/order.json")
      .then(function (response) {
        let data = response.data;
        self.setState({
            order: data,
            goods: self.state.data_all_goods
            .filter((item) => !item["date"])
            .map((obj) => {
              let new_data = data.find((item) => item["name"] === obj["name"]);
              return { ...obj, ...new_data };
            })
            .filter((item) => item["will_postavlka_count"]),
          filteredList: self.state.data_all_goods
            .filter((item) => !item["date"])
            .map((obj) => {
              let new_data = data.find((item) => item["name"] === obj["name"]);
              return { ...obj, ...new_data };
            })
            .filter((item) => item["will_postavlka_count"]),
        })(self.getDeletedModels());
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  
  getDeletedModels() {
    let self = this;
    axios
      .get(url_ga_server + "good/goods_deleted.php")
      .then(function (response) {
        let data = response.data;
        self.setState({
          delected_model: data,
          goods: self.delModeldFromListOfDeletedModels(
            data,
            self.state.goods
          ),
          filteredList: self.delModeldFromListOfDeletedModels(
            data,
            self.state.goods
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  delModeldFromListOfDeletedModels(arr_del, arr_all) {
    let arr = [];
    
     arr_all.map((obj) => {
      if (arr_del.some((item) => item["name"] == obj["name"])) {
        let new_obj = arr_all.find((item) => item["name"] === obj["name"]);
        new_obj.is_delected = true;
        arr = [...arr, new_obj];
      } else {
        let new_obj = arr_all.find((item) => item["name"] === obj["name"]);
        new_obj.is_delected = false;
        arr = [...arr, new_obj];
      }
    });
    
    return arr;
  }


  
  checkIsNotGoods(event) {
    const target = event.target;
    const value = target.name === "isNotGoods" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    this.setState({
      data_all_goods: this.state.goods
        .filter((item) => !item["date"])
        .map((obj) => {
          let data = this.state.order.find(
            (item) => item["name"] === obj["name"]
          );
          return { ...obj, ...data };
        })
        .filter((item) => item["will_postavlka_count"]),
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

  submitFilter() {
    let new_goods = this.state.filteredList;

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

    if (this.state.price_of_gram_min != 0) {
      new_goods = new_goods.filter(
        (item) => item["wb_price_of_gramm"] < this.state.price_of_gram_min
      );
    }

    if (this.state.price_of_gram_max != 0) {
      new_goods = new_goods.filter(
        (item) => item["wb_price_of_gramm"] > this.state.price_of_gram_max
      );
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
          item["name"].toLowerCase().search(e.target.value.trim().toLowerCase()) !== -1
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

    if (name == "Категория") {
      if (this.state.sortByCategory) {
        this.state.filteredList.sort(function (a, b) {
          return b["category"] > a["category"] ? 1 : -1;
        });
        this.setState({
          sortByCategory: !this.state.sortByCategory,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["category"] > b["category"] ? 1 : -1;
        });
        this.setState({
          sortByCategory: !this.state.sortByCategory,
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

    if (name == "В поставке") {
      if (this.state.sortByWillPostavlkaCount) {
        this.state.filteredList.sort(function (a, b) {
          return b["will_postavlka_count"] - a["will_postavlka_count"];
        });
        this.setState({
          sortByWillPostavlkaCount: !this.state.sortByWillPostavlkaCount,
        });
      } else {
        this.state.filteredList.sort(function (a, b) {
          return a["will_postavlka_count"] - b["will_postavlka_count"];
        });
        this.setState({
          sortByWillPostavlkaCount: !this.state.sortByWillPostavlkaCount,
        });
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Выборка</h1>
        <b className="actual_date">Актуально на {this.state.date}</b>
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
        </div>
        <div id="content">
        <p className="goods_count">Найдено: {this.state.filteredList.length || 0}</p>
          <table>
            <thead>
              <tr className="header_table">
              <th name="sortByName" onClick={(e) => this.sortOfGoods(e)}>Артикул</th>
                <th>Артикул WB</th>
                <th name="sortByCategory" onClick={(e) => this.sortOfGoods(e)}>Категория</th>
                <th name="sortByDelivery" onClick={(e) => this.sortOfGoods(e)}>
                  Поставлено
                </th>
                <th name="sortBySell" onClick={(e) => this.sortOfGoods(e)}>
                  Продано
                </th>
                <th
                  name="sortByWillPostavlkaCount"
                  onClick={(e) => this.sortOfGoods(e)}
                >
                  В поставке
                </th>
                <th name="sortByPP" onClick={(e) => this.sortOfGoods(e)}>
                  Процент продаваемости
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredList.length > 0 ? this.state.filteredList.map((item, index) => (
                <tr key={index} className={item["is_delected"] ? "is_exit_file_deleted_models" : ""}>
                  <td>
                    <Link
                      to={`/good/${item["wb_art"]}`}
                      target="_blank"
                      className="link_a_red"
                    >
                      {item["name"]}
                    </Link>
                  </td>
                  <td><Link
                      to={`/good/${item["wb_art"]}`}
                      target="_blank"
                      className="link_a_red"
                    >{item["wb_art"]}</Link></td>
                  <td>{item["category"]}</td>
                  <td>{item["postavleno"]} шт.</td>
                  <td>{item["prodano"]} шт.</td>
                  <td>{item["will_postavlka_count"]}</td>
                  <td>{item["pp"]} %</td>
                </tr>
              )) : <h1>Нет записей</h1>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}