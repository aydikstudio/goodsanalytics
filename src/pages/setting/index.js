import React from "react";
import {
  Checkbox,
  Button,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import axios from "axios";
import "./style.css";
let config = require("../../config/");
let url_ga_server = config.default.url_ga_server;

export class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: localStorage.getItem('company') || "juveros",
      client: localStorage.getItem('client') || "wb ",
      downloadsaleFile: null,
      statusDownloadsaleFile: false,
      statusUpdatesaleFile: false,

      downloadorderFile: null,
      statusDownloadorderFile: false,
      statusUpdateorderFile: false,

      downloadlistwaitingFile: null,
      statusDownloadlistwaitingFile: false,
      statusUpdatelistwaitingFile: false,

      downloaddeficitFile: null,
      statusDownloaddeficitFile: false,
      statusUpdatedeficitFile: false,

      downloadTurnOverFile: null,
      statusDownloadTurnOverFile: false,
      statusUpdateTurnOverFile: false,

    };

    this.onSubmitFileSale = this.onSubmitFileSale.bind(this);
    this.onChangeFileSale = this.onChangeFileSale.bind(this);
    this.uploadChangeFileSale = this.uploadChangeFileSale.bind(this);
    this.updateDataSales = this.updateDataSales.bind(this);

    this.onSubmitFileOrder = this.onSubmitFileOrder.bind(this);
    this.onChangeFileOrder = this.onChangeFileOrder.bind(this);
    this.uploadChangeFileOrder = this.uploadChangeFileOrder.bind(this);
    this.updateDataOrder = this.updateDataOrder.bind(this);

    this.onSubmitWaitingList = this.onSubmitWaitingList.bind(this);
    this.onChangeWaitingList = this.onChangeWaitingList.bind(this);
    this.uploadChangeWaitingList = this.uploadChangeWaitingList.bind(this);
    this.updateDataWaitingList = this.updateDataWaitingList.bind(this);

    this.onSubmitDeficit = this.onSubmitDeficit.bind(this);
    this.onChangeDeficit = this.onChangeDeficit.bind(this);
    this.uploadChangeDeficit = this.uploadChangeDeficit.bind(this);
    this.updateDataDeficit = this.updateDataDeficit.bind(this);


    this.onSubmitTurnOver = this.onSubmitTurnOver.bind(this);
    this.onChangeTurnOver = this.onChangeTurnOver.bind(this);
    this.uploadChangeTurnOver = this.uploadChangeTurnOver.bind(this);
    this.updateDataTurnOver = this.updateDataTurnOver.bind(this);

  }



  //Загрузка продажи

  async componentDidMount() {
    await axios
      .get(url_ga_server + "/status_downloaded.php", {
        params: {
          "name":'preorder'
        }
      })
      .then((res) => {
          if (res.data == 1) {
            this.setState({ statusUpdateorderFile: true});
          }
      });

      await axios
      .get(url_ga_server + "/status_downloaded.php", {
        params: {
          "name":'sale'
        }
      })
      .then((res) => {
          if (res.data == 1) {
            this.setState({ statusUpdatesaleFile: true});
          }
      });
  }

  async onSubmitFileSale(e) {
    e.preventDefault();
    
    let res = await this.uploadChangeFileSale(this.state.downloadsaleFile);
  }

  onChangeFileSale(e) {
    this.setState({ downloadsaleFile: e.target.files[0] });
  }

  async uploadChangeFileSale(downloadsaleFile) {
    this.setState({ statusDownloadsaleFile: true });
    const formData = new FormData();

    formData.append("downloadsalefile", downloadsaleFile);

    return await axios
      .post(url_ga_server + "sale/downloaded.php", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
          if (res.data == "yes") {
            alert("Файл успешно загружен");
            this.setState({ statusDownloadsaleFile: false });
          }
      });
  }

  updateDataSales(e) {
    let ref = this;
    this.setState({ statusUpdatesaleFile: true });
    axios
      .get(url_ga_server + "sale/sale_"+this.state.client+"_"+this.state.company+".php", {
        'company': this.state.company
      })
      .then(function (res) {
        if (res.data === "yes") {
          alert("Данные обновлены");
        }
        ref.setState({ statusUpdatesaleFile: true });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
      });
  }



//Загрузка заказа

  async onSubmitFileOrder(e) {
    e.preventDefault();
    this.setState({ statusDownloadorderFile: true });
    let res = await this.uploadChangeFileOrder(this.state.downloadorderFile);
  }

  onChangeFileOrder(e) {
    this.setState({downloadorderFile: e.target.files[0] });
  }

  async uploadChangeFileOrder(downloadorderFile) {
    
    const formData = new FormData();
    formData.append("downloadorderfile", downloadorderFile);

    return await axios
      .post(url_ga_server + "preorder/downloaded.php", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
          if (res.data == "yes") {
            alert("Файл успешно загружен");
          }
          this.setState({ statusDownloadorderFile: false });
      })
  }

  updateDataOrder(e) {
    let ref = this;
    this.setState({ statusUpdateorderFile: true });
    axios
      .get(url_ga_server + "preorder/order.php", {
        params: {
          company: this.state.company,
          client: this.state.client
        }
      })
      .then(function (res) {
        if (res.data == "yes") {
          alert("Данные обновлены");
        }
        ref.setState({ statusUpdateorderFile: false });
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  //Загрузка лист ожидания

  
  async onSubmitWaitingList(e) {
    e.preventDefault();
    this.setState({ statusDownloadlistwaitingFile: true });
    let res = await this.uploadChangeWaitingList(this.state.downloadlistwaitingFile);
  }

  onChangeWaitingList(e) {
    this.setState({downloadlistwaitingFile: e.target.files[0] });
  }

  async uploadChangeWaitingList(downloadlistwaitingFile) {
    
    const formData = new FormData();
    let ref = this;
    formData.append("downloadlistwaitingFile", downloadlistwaitingFile);

    return await axios
      .post(url_ga_server + "waitinglist/downloaded.php", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
          if (res.data == "yes") {
            ref.setState({ statusDownloadlistwaitingFile: false });
            alert("Файл успешно загружен");
          }
      })
  }

  updateDataWaitingList(e) {
    let ref = this;
    this.setState({ statusUpdatelistwaitingFile: true });
    axios
      .get(url_ga_server + "waitinglist/waitinglist.php", {
        params: {
          company: this.state.company,
          client: this.state.client
        }
      })
      .then(function (res) {
        if (res.data == "yes") {
          ref.setState({ statusUpdatelistwaitingFile: false });
          alert("Данные обновлены");
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }



    //Загрузка дефицита
    
    async onSubmitDeficit(e) {
      e.preventDefault();
      this.setState({statusDownloaddeficitFile: true });
      let res = await this.uploadChangeDeficit(this.state.downloaddeficitFile);
    }
  
    onChangeDeficit(e) {
      this.setState({downloaddeficitFile: e.target.files[0] });
    }
  
    async uploadChangeDeficit(downloaddeficitFile) {
      
      const formData = new FormData();
      let ref = this;
      formData.append("downloaddeficitFile", downloaddeficitFile);
  
      return await axios
        .post(url_ga_server + "deficit/downloaded.php", formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
            if (res.data == "yes") {
              ref.setState({ statusDownloaddeficitFile: false });
              alert("Файл успешно загружен");
            }
        })
    }
  

    updateDataDeficit(e) {
      let ref = this;
      this.setState({ statusUpdatedeficitFile: true });
      axios
        .get(url_ga_server + "deficit/deficit.php", {
          params: {
            company: this.state.company,
            client: this.state.client
          }
        })
        .then(function (res) {
          if (res.data == "yes") {
            ref.setState({ statusUpdatedeficitFile: false });
            alert("Данные обновлены");
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }



    //Загрузка оборачиваемости
    
    async onSubmitTurnOver(e) {
      e.preventDefault();
      this.setState({statusDownloadTurnOverFile: true });
      let res = await this.uploadChangeTurnOver(this.state.downloadTurnOverFile);
    }
  
    onChangeTurnOver(e) {
      this.setState({downloadTurnOverFile: e.target.files[0] });
    }
  
    async uploadChangeTurnOver(downloadTurnOverFile) {
      
      const formData = new FormData();
      let ref = this;
      formData.append("downloadTurnOverFile", downloadTurnOverFile);
  
      return await axios
        .post(url_ga_server + "turnover/downloaded.php", formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
            if (res.data == "yes") {
              ref.setState({ statusDownloadTurnOverFile: false });
              alert("Файл успешно загружен");
            }
        })
    }
  

    updateDataTurnOver(e) {
      let ref = this;
      this.setState({ statusUpdateTurnOverFile: true });
      axios
        .get(url_ga_server + "turnover/turnover.php", {
          params: {
            company: this.state.company,
            client: this.state.client
          }
        })
        .then(function (res) {
          console.log(res.data);
          if (res.data == "yes") {
            console.log('ok');
            ref.setState({ statusUpdateTurnOverFile: false });
            alert("Данные обновлены");
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }

  render() {
    return (
      <div>
        <h1>Настройка</h1>
        {/* <div class="block_downloaded">
          <form onSubmit={this.onSubmitFileSale}>
            <h1>Загрузка файла с продажами</h1>
            <br />
            <input type="file" onChange={this.onChangeFileSale} />
            {this.state.statusDownloadsaleFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузка файлов
              </button>
            ) : (
              "Файл грузиться"
            )}
          </form>
          {this.state.statusUpdatesaleFile === false ? (
            <button
              type="submit"
              className="downloadedButton"
              onClick={this.updateDataSales}
            >
              Обновить
            </button>
          ) : (
            "Обновляются данные"
          )} 
          <a href="https://goodsanalytics.aydikstudio.ru/file/sale_example.xlsx" target="_blank" className="downloaded_ref">Скачать пример для загрузки</a>
        </div> */}



          <div class="block_downloaded">
          <form onSubmit={this.onSubmitFileOrder}>
            <h1>Загрузка файла с заказами</h1>
            <br />
            <input type="file" onChange={this.onChangeFileOrder} />
            {this.state.statusDownloadorderFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузка файлов
              </button>
            ) : (
              "Файл грузиться"
            )}
          </form>
          {this.state.statusUpdateorderFile === false ? (
            <button
              type="submit"
              className="downloadedButton"
              onClick={this.updateDataOrder}
            >
              Обновить
            </button>
          ) : (
            "Обновляются данные"
          )}
          <a href="https://goodsanalytics.aydikstudio.ru/file/preorder_example.xlsx" target="_blank" className="downloaded_ref">Скачать пример для загрузки</a>
        </div>



     

        <div class="block_downloaded">
          <form onSubmit={this.onSubmitWaitingList}>
            <h1>Загрузка файла "Лист ожидания"</h1>
            <br />
            <input type="file" onChange={this.onChangeWaitingList} />
            {this.state.statusDownloadlistwaitingFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузка файлов
              </button>
            ) : (
              "Файл грузиться"
            )}
          </form>
          {this.state.statusUpdatelistwaitingFile === false ? (
            <button
              type="submit"
              className="downloadedButton"
              onClick={this.updateDataWaitingList}
            >
              Обновить
            </button> 
          ) : (
            "Обновляются данные"
          )}
          <a href="https://goodsanalytics.aydikstudio.ru/file/deficit_example.xlsx" target="_blank" className="downloaded_ref">Скачать пример для загрузки</a>
        </div>



        <div class="block_downloaded">
          <form onSubmit={this.onSubmitDeficit}>
            <h1>Загрузка файла "Дефицит"</h1>
            <br />
            <input type="file" onChange={this.onChangeDeficit} />
            {this.state.statusDownloaddeficitFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузка файлов
              </button>
            ) : (
              "Файл грузиться"
            )}
          </form>
          {this.state.statusUpdatedeficitFile === false ? (
            <button
              type="submit"
              className="downloadedButton"
              onClick={this.updateDataDeficit}
            >
              Обновить
            </button> 
          ) : (
            "Обновляются данные"
          )}
          <a href="https://goodsanalytics.aydikstudio.ru/file/deficit_example.xlsx" target="_blank" className="downloaded_ref">Скачать пример для загрузки</a>
        </div>

        <div class="block_downloaded">
          <form onSubmit={this.onSubmitTurnOver}>
            <h1>Загрузка файла "Оборачиваемости"</h1>
            <br />
            <input type="file" onChange={this.onChangeTurnOver} />
            {this.state.statusDownloadTurnOverFile === false ? (
              <button type="submit" className="downloadedButton">
                Загрузка файлов
              </button>
            ) : (
              "Файл грузиться"
            )}
          </form>
          {this.state.statusUpdateTurnOverFile === false ? (
            <button
              type="submit"
              className="downloadedButton"
              onClick={this.updateDataTurnOver}
            >
              Обновить
            </button> 
          ) : (
            "Обновляются данные"
          )}
        </div>
      </div>
    );
  }
}
