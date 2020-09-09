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
let config = require("../../../config/");
let url_ga_server = config.default.url_ga_server;

export class Add_sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadreportFile: null,
      statusdownloadreportFile: false,
      statusUpdatereportFile: false,
      startDate: '',
      date: ''
    };

    this.onSubmitFileOrder = this.onSubmitFileOrder.bind(this);
    this.onChangeFileOrder = this.onChangeFileOrder.bind(this);
    this.uploadChangeFileOrder = this.uploadChangeFileOrder.bind(this);
  }

  async onSubmitFileOrder(e) {
    e.preventDefault();
    this.setState({ statusdownloadreportFile: true });
    let res = await this.uploadChangeFileOrder(this.state.downloadreportFile);
  }

  onChangeFileOrder(e) {
    this.setState({ downloadreportFile: e.target.files[0] });
  }

  async uploadChangeFileOrder(downloadreportFile) {
    const formData = new FormData();
    formData.append("downloadreportFile", downloadreportFile);
    formData.append("date", this.state.date);
    formData.append("type", "sale");

    return await axios
      .post(url_ga_server + "report/report.php", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data == "yes") {
          alert("Файл успешно загружен");
        }
        this.setState({ statusdownloadreportFile: false });
      });
  }

  setStartDate = (date) => {
    let date1 = this.formatDate(date);
    this.setState({
      date: date1,
      startDate: date
    });
  };


   formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
}

  render() {
    return (
      <div>
        <h1>Добавить продажи </h1>

        <div class="block_downloaded">
          <form onSubmit={this.onSubmitFileOrder}>
            <DatePicker
              onChange={this.setStartDate}
              format="dd/MM/yy"
              value={this.state.startDate}
            />
            <input type="file" onChange={this.onChangeFileOrder} />

            {this.state.statusUpdatereportFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузить
              </button>
            ) : (
              "Обновляются данные"
            )}
          </form>
          <a
            href="https://goodsanalytics.aydikstudio.ru/file/preorder_example.xlsx"
            target="_blank"
            className="downloaded_ref"
          >
            Скачать пример для загрузки
          </a>
        </div>
      </div>
    );
  }
}
