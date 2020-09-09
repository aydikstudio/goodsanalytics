import React from "react";
import { Button, Checkbox } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import "./modal_export.css";
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;

export default class Modal_Export extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      nameModal: "",
      path: ''
    };
  }

  render() {
    return (
      <div>
        <Button className="excel_export" onClick={() => this.openModal()}>
          Экспорт
        </Button>
        <Modal
          isOpen={this.state.isModalOpen}
          onClose={() => this.closeModal()}
          data={this.props.data}
        ></Modal>
      </div>
    );
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedBoxes: [],
      path: '',
      parametrs: [
        {
          name: "Наш артикул",
          type: "name",
        },
        {
          name: "Артикул wb",
          type: "wb_art",
        },
        {
          name: "Поставлено",
          type: "postavleno",
        },
        {
          name: "Возвращено поставщиком",
          type: "returned_whosaler",
        },
        {
          name: "Возвращено клиентами",
          type: "returned_from_client",
        },
        {
          name: "Процент продаваемости",
          type: "pp",
        },
        {
          name: "Категория",
          type: "category",
        },
        {
          name: "Розничная цена",
          type: "wb_retail",
        },
        {
          name: "Вес",
          type: "wb_weigth",
        },
        {
          name: "Цена за грамм",
          type: "wb_price_of_gramm",
        },
        {
          name: "Вставка",
          type: "wb_vstavka",
        },
        {
          name: "Металл",
          type: "wb_metall",
        },
        {
          name: "Нет в наличии",
          type: "wb_sizes",
        },
        {
          name: "Все размеры",
          type: "wb_all_sizes",
        },
        {
          name: "Рейтинг",
          type: "wb_reiting",
        },
      ],
    };
  }

  async exportExcel(e) {
    const self = this;

    if (this.state.checkedBoxes.length > 0) {
      let checkedBoxes = this.state.checkedBoxes;
      const options = {
        headers: { "Content-Type": "application/json" },
        data_header: JSON.stringify(checkedBoxes),
        data: JSON.stringify(this.props.data),
      };

      await axios
        .post(url_ga_server + "export/export_excel.php", options)
        .then(function (response) {
          let path = url_ga_server + "export/files/" + response.data;
          window.location.replace(path);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      alert("Заполните описание");
    }
    e.preventDefault();
  }

  handleCheckbox = (e, s) => {
    const checkedBoxes = [...this.state.checkedBoxes];
    if (e.target.checked) {
      checkedBoxes.push(s);
    } else {
      const index = checkedBoxes.findIndex((ch) => ch.item === s.item);
      checkedBoxes.splice(index, 1);
    }
    this.setState({ checkedBoxes });
  };



  render() {
    if (this.props.isOpen === false) return null;

    return (
      <div>
        <div className="modal">
          <h3>Колонки</h3>
          <div className="parametrs_checkboxes">
            {this.state.parametrs.length > 0
              ? this.state.parametrs.map((item, index) => (
                  <div className="parametr_checkbox" key={index}>
                    <Checkbox
                      id={item.type}
                      name={item.type}
                      type="checkbox"
                      checked={this.state.checkedBoxes.find(
                        (ch) => ch.type === item.type
                      )}
                      onChange={(e) => this.handleCheckbox(e, item)}
                    />
                    {item.name}
                  </div>
                ))
              : ""}
          </div>

          <div className="parametrs_checkboxes_actions">
            <Button
              className="excel_export"
              onClick={(e) => this.exportExcel(e)}
            >
              Экспорт
            </Button>
          </div>
        </div>
        <div className="bg" onClick={(e) => this.close(e)} />
      </div>
    );
  }

  close(e) {
    e.preventDefault();

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}
