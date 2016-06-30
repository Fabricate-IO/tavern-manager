import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';
import style from '../styles';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      creating: (this.props.params.id == null), // if creating from scratch (otherwise saving)
      friends: [],
      object: {
        tab: 0,
      },
    };
  },
  componentDidMount: function () {

    if (this.state.creating === false) {

      NetworkRequest('GET', '/api/Patron/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Patron API', status, err.toString());
        }

        this.setState({ object: result });
      });
    }

    NetworkRequest('GET', '/api/Friend', (err, result) => {

      if (err) {
        return console.error('Friend API', status, err.toString());
      }

      this.setState({ friends: result });
    });
  },
  handleSave: function (e) {

    e.preventDefault();
    const object = this.state.object;

    if (object.name == null) {
      return;
    }

    const patron = {
      id: this.props.params.id,
      name: object.name.trim(),
      splitwiseId: object.splitwiseId,
      tab: object.tab,
    };
    let url = '/api/Patron';
    let type = 'POST';

    if (!this.state.creating) { // if we were passed an ID, we're saving instead of creating
      url += '/' + patron.id;
      type = 'PUT';
    }

    this.setState({ object: {} });
    NetworkRequest(type, url, patron, (err, result) => {

      if (err) {
        this.setState({ object: object });
        return console.error('Patron API', status, err.toString());
      }

      hashHistory.push('/patrons');
    });
  },
  handleInputChange: function (e) {
    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleSplitwiseFriendChange: function (event, index, value) {
    this.state.object.splitwiseId = value;
    this.state.object.name = this.state.friends.find((friend) => { return (friend.id === value); }).name;
    this.setState({ object: this.state.object });
  },
  handleCancel: function () {
    hashHistory.push('/patrons');
  },
  handleDelete: function (e) {

    if (window.confirm("Are you sure you want to delete " + this.state.object.name + '?')) {

      NetworkRequest('DELETE', '/api/Patron/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Patron API', status, err.toString());
        }

        hashHistory.push('/patrons');
      });
    }
  },
  render: function () {
// TODO if not creating, render Splitwise user select as disabled

    const friends = this.state.friends.map((friend) => {
      return <MenuItem key={friend.id} value={friend.id} primaryText={friend.name} />;
    });
    const editing = !this.state.creating;

    return (
      <form onSubmit={this.handleSave}>
        <SelectField
          value={this.state.object.splitwiseId}
          onChange={this.handleSplitwiseFriendChange}
          floatingLabelText="Splitwise Friend"
          style={style.textInput}
          disabled={editing}
        >
          {friends}
        </SelectField>
        <br/>
        <TextField
          name="name"
          floatingLabelText="Name"
          floatingLabelFixed={true}
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <br/>
        <TextField
          name="tab"
          type="number"
          floatingLabelText="Tab"
          floatingLabelFixed={true}
          value={this.state.object.tab}
          onChange={this.handleInputChange}
        />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
        <RaisedButton label="Save" type="submit" />
        <br/>
        <RaisedButton label="Delete" onClick={this.handleDelete} />
      </form>
    );
  }
});