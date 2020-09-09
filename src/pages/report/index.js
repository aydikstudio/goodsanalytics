import React from "react";

export class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Отчеты</h1>
        <a href="/shipment_report">
          <div className="report">
            <p>Отгрузка</p>
          </div>
        </a>
        <a href="/sale_report">
          <div className="report">
            <p>Продажи</p>
          </div>
        </a>
        <a href="/return_report">
          <div className="report">
            <p>Возвраты</p>
          </div>
        </a>
      </div>
    );
  }
}
