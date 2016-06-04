var hashHistory = ReactRouter.hashHistory;

module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  handlePost: function (e) {
    e.preventDefault();
    var state = this.state;
    var recipe = {
      name: this.state.name.trim(),
    };
    if (!recipe.name) {
      return;
    }
    this.setState({ name: '' });
    $.ajax({
      url: '/api/Recipe',
      dataType: 'json',
      type: 'POST',
      data: recipe,
      success: function (data) {
        // already updated state, we're good to go
        hashHistory.push('/');
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState(state);
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  handleInputChange: function (e) {
    var object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  render: function () {
    return (
      <form onSubmit={this.handlePost}>
        <input
          type="text"
          name="name"
          placeholder="Drink name"
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <input type="submit" value="Add" />
      </form>
    );
  }
});