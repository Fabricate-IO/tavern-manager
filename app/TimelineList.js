import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';


const OrderTransaction = React.createClass({
  getInitialState: function () {
    return {
      Recipe: {},
      User: {},
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/User/' + this.props.transaction.userId, (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ User: result });
    });

    NetworkRequest('GET', '/api/Recipe/' + this.props.transaction.recipeId, (err, result) => {

      if (err) {
        return console.error('Recipe API', status, err.toString());
      }

      this.setState({ Recipe: result });
    });
  },
  render: function () {
    const transaction = this.props.transaction;
    const primaryText = this.state.User.name + ' ordered a ' + this.state.Recipe.name;
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const RestockTransaction = React.createClass({
  render: function () {
    const transaction = this.props.transaction;
    const primaryText = "Restocked " + transaction.name;
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const SettleTransaction = React.createClass({
  getInitialState: function () {
    return {
      User: {},
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/User/' + this.props.transaction.userId, (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ User: result });
    });
  },
  render: function () {
    const transaction = this.props.transaction;
    const primaryText = this.state.User.name + ' settled via ' + transaction.settlementPlatform;
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const Transaction = React.createClass({
  render: function () {
    switch (this.props.transaction.type) {
      case 'order': return <OrderTransaction transaction={this.props.transaction}/>; break;
      case 'restock': return <RestockTransaction transaction={this.props.transaction}/>; break;
      case 'settle': return <SettleTransaction transaction={this.props.transaction}/>; break;
      default: return <ListItem>TODO {this.props.transaction.type}</ListItem>; break;
    }
  },
});


module.exports = React.createClass({
  getInitialState: function () {
    return {
      Transactions: [],
    };
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Transaction', (err, result) => {

      if (err) {
        return console.error('Transaction API', status, err.toString());
      }

      result = result.map((transaction) => {
        transaction.monetaryValueFormatted = utils.formatPrice(transaction.monetaryValue);
        return transaction;
      });

      this.setState({ Transactions: result });
    });
  },
  render: function () {

    const searched = this.state.Transactions.filter((element) => {
      return utils.search(this.props.search, [element.name]);
    });

    const transactions = searched.map((transaction) => {
      return <Transaction
        key={transaction.id}
        transaction={transaction}
      />;
    });

    return (
      <div>
        <List>
          {transactions}
        </List>
      </div>
    );
  },
});