import React from "react";
import { Sales } from "../../pages/sales/";
import { Good } from "../../pages/good/";
import { Choosed } from "../../pages/choosed/";
import { Setting } from "../../pages/setting/";
import { Report } from "../../pages/report/";
import { Sale_report } from "../../pages/report/sale";
import { Shipment_report } from "../../pages/report/shipment";
import { Return_report } from "../../pages/report/return";
import { Add_return } from "../../pages/report/return/add_return";
import { Add_shipment } from "../../pages/report/shipment/add_shipment";
import { Add_sale } from "../../pages/report/sale/add_sale";
import {Deleted_models} from '../../pages/deleted_model/';
import {Basket} from '../../pages/basket/';
import {Order} from '../../pages/order/';
import {Orders} from '../../pages/orders/';
import {Hypothesis} from '../../pages/hypothesis/'
import { Hypothesis_add } from "../../pages/good/hypothesis_add";
import { Hypothesis_item } from "../../pages/good/hypothesis_item";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./main.css";

export const Main = () => (
  <div>
    <div id="main">
      <Router>
        <Switch>
          <Route  path="/" exact component={Sales} />
          <Route  path="/good/:id" exact component={Good} />
          <Route  path="/choosed" exact component={Choosed} />
          <Route  path="/setting" exact component={Setting} />
          <Route  path="/deleted_model" exact component={Deleted_models} />
          <Route  path="/hypothesis" exact component={Hypothesis} />
          <Route  path="/reports" exact component={Report} />
          <Route  path="/shipment_report" exact component={Shipment_report} />
          <Route  path="/sale_report" exact component={Sale_report} />
          <Route  path="/return_report" exact component={Return_report} />
          <Route  path="/add_return" exact component={Add_return} />
          <Route  path="/add_shipment" exact component={Add_shipment} />
          <Route  path="/add_sale" exact component={Add_sale} />
          <Route  path="/hypothesis_add/:id" exact component={Hypothesis_add} />
          <Route  path="/hypothesis_item/:id" exact component={Hypothesis_item} />
          <Route  path="/basket" exact component={Basket} />
          <Route  path="/order" exact component={Order} />
          <Route  path="/order/:id" exact component={Order} />
          <Route  path="/orders" exact component={Orders} />
        </Switch>
      </Router>
    </div>
  </div>
);
