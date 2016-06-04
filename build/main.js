(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeLayout.js":[function(require,module,exports){
var Recipe = React.createClass({displayName: "Recipe",
  render: function () {
    return (
      React.createElement("div", {className: "recipe"}, 
        React.createElement("h2", null, 
          this.props.recipe.name
        ), 
        this.props.children
      )
    );
  }
});

var RecipeList = React.createClass({displayName: "RecipeList",
  render: function () {
    var recipes = this.props.data.map(function (recipe) {
      return React.createElement(Recipe, {key: recipe.name, recipe: recipe});
    });
    return (
      React.createElement("ul", null, 
        recipes
      )
    );
  }
});


module.exports = React.createClass({displayName: "exports",
  loadCommentsFromServer: function () {
    $.ajax({
      url: '/api/Recipe',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    // comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return {
      page: 'Drinks',
      data: [],
    };
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
  },
  render: function () {
// TODO have Drinks menu have submenu for drink types
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Recipes"), 
        React.createElement(RecipeList, {data: this.state.data})
      )
    );
  }
});

// <CommentForm onCommentSubmit={this.handleCommentSubmit} />

},{}],"C:\\Users\\Todd\\bar-dojo\\app\\app.js":[function(require,module,exports){
// var Router = ReactRouter;
// var Route = Router.Route, DefaultRoute = Router.DefaultRoute,
//   Link=Router.Link, RouteHandler = Router.RouteHandler, browserHistory = Router.browserHistory;

var ReactRouter = window.ReactRouter;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var RecipeLayout = require('./Recipe/RecipeLayout');


// var CommentForm = React.createClass({
//   getInitialState: function () {
//     return {author: '', text: ''};
//   },
//   handleAuthorChange: function (e) {
//     this.setState({author: e.target.value});
//   },
//   handleTextChange: function (e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function (e) {
//     e.preventDefault();
//     var author = this.state.author.trim();
//     var text = this.state.text.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({name: author, unitType: text});
//     this.setState({author: '', text: ''});
//   },
//   render: function () {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={this.state.author}
//           onChange={this.handleAuthorChange}
//         />
//         <input
//           type="text"
//           placeholder="Say something..."
//           value={this.state.text}
//           onChange={this.handleTextChange}
//         />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });



var PatronLayout = React.createClass({displayName: "PatronLayout",
  render: function () {
    return (
      React.createElement("div", null, "TODO")
    );
  }
});


var AppLayout = React.createClass({displayName: "AppLayout",
  render: function () {
    return (
      React.createElement("div", {id: "page"}, 
        React.createElement("ul", {className: "navbar"}, 
          React.createElement("li", null, React.createElement(Link, {to: "/"}, "Drinks")), 
          React.createElement("li", null, React.createElement(Link, {to: "/patrons"}, "Patrons")), 
          React.createElement("li", null, React.createElement(Link, {to: "/inventory"}, "Inventory")), 
          React.createElement("li", null, "Shopping List"), 
          React.createElement("li", null, "History")
        ), 
        React.createElement("div", {id: "content"}, 
          this.props.children
        )
      )
    );
  }
});


ReactDOM.render(
  // <App url="/api/Recipe" />,
  React.createElement(Router, {history: hashHistory}, 
    React.createElement(Route, {component: AppLayout}, 
      React.createElement(Route, {path: "/", component: RecipeLayout}), 
      React.createElement(Route, {path: "/patrons", component: PatronLayout})
    )
  ),
  document.getElementById('app')
);

/*
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
        <Route path="widgets" component={WidgetList} />
      </Route>
*/

/* ===== NETWORK HELPERS ===== */

function deleteOne (modelName, id, callback) {}

function getOne (modelName, id, callback) {}

function patchOne (modelName, id, delta, callback) {}

function postOne (modelName, object, callback) {}

function putOne (modelName, object, callback) {}



/*
Recipe.schema = {
  name: Joi.string().required(),
  tags: Joi.array().items(Joi.string()), // tag name
  instructions: Joi.array().items(Joi.string()), // optional
  ingredients: Joi.array().items(Joi.object().keys({
    stockTypeId: Joi.string(),
    quantity: Joi.number(),
  })),

  created: Joi.date().timestamp(),
  archived: Joi.boolean().default(false),
};
*/

},{"./Recipe/RecipeLayout":"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeLayout.js"}]},{},["C:\\Users\\Todd\\bar-dojo\\app\\app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXFRvZGRcXGJhci1kb2pvXFxhcHBcXFJlY2lwZVxcUmVjaXBlTGF5b3V0LmpzIiwiQzpcXFVzZXJzXFxUb2RkXFxiYXItZG9qb1xcYXBwXFxhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFJLDRCQUE0QixzQkFBQTtFQUM5QixNQUFNLEVBQUUsWUFBWTtJQUNsQjtNQUNFLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsUUFBUyxDQUFBLEVBQUE7UUFDdEIsb0JBQUEsSUFBRyxFQUFBLElBQUMsRUFBQTtVQUNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUs7UUFDckIsQ0FBQSxFQUFBO1FBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFTO01BQ2pCLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsSUFBSSxnQ0FBZ0MsMEJBQUE7RUFDbEMsTUFBTSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsTUFBTSxFQUFFO01BQ2xELE9BQU8sb0JBQUMsTUFBTSxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxNQUFNLENBQUMsSUFBSSxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUUsTUFBUSxDQUFTLENBQUEsQ0FBQztLQUM1RCxDQUFDLENBQUM7SUFDSDtNQUNFLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUE7UUFDRCxPQUFRO01BQ04sQ0FBQTtNQUNMO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIOztBQUVBLG9DQUFvQyx1QkFBQTtFQUNsQyxzQkFBc0IsRUFBRSxZQUFZO0lBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUM7TUFDTCxHQUFHLEVBQUUsYUFBYTtNQUNsQixRQUFR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RUFBRTs7QUFFRixpQ0FBaUM7O0FBRWpDLFNBQVMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7O0FBRS9DLFNBQVMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7O0FBRTVDLFNBQVMsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFOztBQUVyRCxTQUFTLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFOztBQUVqRCxTQUFTLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWNpcGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlY2lwZVwiPlxyXG4gICAgICAgIDxoMj5cclxuICAgICAgICAgIHt0aGlzLnByb3BzLnJlY2lwZS5uYW1lfVxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG5cclxudmFyIFJlY2lwZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcmVjaXBlcyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24gKHJlY2lwZSkge1xyXG4gICAgICByZXR1cm4gPFJlY2lwZSBrZXk9e3JlY2lwZS5uYW1lfSByZWNpcGU9e3JlY2lwZX0+PC9SZWNpcGU+O1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8dWw+XHJcbiAgICAgICAge3JlY2lwZXN9XHJcbiAgICAgIDwvdWw+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgbG9hZENvbW1lbnRzRnJvbVNlcnZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiAnL2FwaS9SZWNpcGUnLFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YTogZGF0YX0pO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9LmJpbmQodGhpcylcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgaGFuZGxlQ29tbWVudFN1Ym1pdDogZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgIHZhciBjb21tZW50cyA9IHRoaXMuc3RhdGUuZGF0YTtcclxuICAgIC8vIE9wdGltaXN0aWNhbGx5IHNldCBhbiBpZCBvbiB0aGUgbmV3IGNvbW1lbnQuIEl0IHdpbGwgYmUgcmVwbGFjZWQgYnkgYW5cclxuICAgIC8vIGlkIGdlbmVyYXRlZCBieSB0aGUgc2VydmVyLiBJbiBhIHByb2R1Y3Rpb24gYXBwbGljYXRpb24geW91IHdvdWxkIGxpa2VseVxyXG4gICAgLy8gbm90IHVzZSBEYXRlLm5vdygpIGZvciB0aGlzIGFuZCB3b3VsZCBoYXZlIGEgbW9yZSByb2J1c3Qgc3lzdGVtIGluIHBsYWNlLlxyXG4gICAgLy8gY29tbWVudC5pZCA9IERhdGUubm93KCk7XHJcbiAgICB2YXIgbmV3Q29tbWVudHMgPSBjb21tZW50cy5jb25jYXQoW2NvbW1lbnRdKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IG5ld0NvbW1lbnRzfSk7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHRoaXMucHJvcHMudXJsLFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgIGRhdGE6IGNvbW1lbnQsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGF0YTogZGF0YX0pO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IGNvbW1lbnRzfSk7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhZ2U6ICdEcmlua3MnLFxyXG4gICAgICBkYXRhOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5sb2FkQ29tbWVudHNGcm9tU2VydmVyKCk7XHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuLy8gVE9ETyBoYXZlIERyaW5rcyBtZW51IGhhdmUgc3VibWVudSBmb3IgZHJpbmsgdHlwZXNcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGgxPlJlY2lwZXM8L2gxPlxyXG4gICAgICAgIDxSZWNpcGVMaXN0IGRhdGE9e3RoaXMuc3RhdGUuZGF0YX0gLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyA8Q29tbWVudEZvcm0gb25Db21tZW50U3VibWl0PXt0aGlzLmhhbmRsZUNvbW1lbnRTdWJtaXR9IC8+IiwiLy8gdmFyIFJvdXRlciA9IFJlYWN0Um91dGVyO1xyXG4vLyB2YXIgUm91dGUgPSBSb3V0ZXIuUm91dGUsIERlZmF1bHRSb3V0ZSA9IFJvdXRlci5EZWZhdWx0Um91dGUsXHJcbi8vICAgTGluaz1Sb3V0ZXIuTGluaywgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlciwgYnJvd3Nlckhpc3RvcnkgPSBSb3V0ZXIuYnJvd3Nlckhpc3Rvcnk7XHJcblxyXG52YXIgUmVhY3RSb3V0ZXIgPSB3aW5kb3cuUmVhY3RSb3V0ZXI7XHJcbnZhciBSb3V0ZXIgPSBSZWFjdFJvdXRlci5Sb3V0ZXI7XHJcbnZhciBSb3V0ZSA9IFJlYWN0Um91dGVyLlJvdXRlO1xyXG52YXIgTGluayA9IFJlYWN0Um91dGVyLkxpbms7XHJcbnZhciBoYXNoSGlzdG9yeSA9IFJlYWN0Um91dGVyLmhhc2hIaXN0b3J5O1xyXG5cclxudmFyIFJlY2lwZUxheW91dCA9IHJlcXVpcmUoJy4vUmVjaXBlL1JlY2lwZUxheW91dCcpO1xyXG5cclxuXHJcbi8vIHZhciBDb21tZW50Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuLy8gICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIHJldHVybiB7YXV0aG9yOiAnJywgdGV4dDogJyd9O1xyXG4vLyAgIH0sXHJcbi8vICAgaGFuZGxlQXV0aG9yQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xyXG4vLyAgICAgdGhpcy5zZXRTdGF0ZSh7YXV0aG9yOiBlLnRhcmdldC52YWx1ZX0pO1xyXG4vLyAgIH0sXHJcbi8vICAgaGFuZGxlVGV4dENoYW5nZTogZnVuY3Rpb24gKGUpIHtcclxuLy8gICAgIHRoaXMuc2V0U3RhdGUoe3RleHQ6IGUudGFyZ2V0LnZhbHVlfSk7XHJcbi8vICAgfSxcclxuLy8gICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XHJcbi8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vICAgICB2YXIgYXV0aG9yID0gdGhpcy5zdGF0ZS5hdXRob3IudHJpbSgpO1xyXG4vLyAgICAgdmFyIHRleHQgPSB0aGlzLnN0YXRlLnRleHQudHJpbSgpO1xyXG4vLyAgICAgaWYgKCF0ZXh0IHx8ICFhdXRob3IpIHtcclxuLy8gICAgICAgcmV0dXJuO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgdGhpcy5wcm9wcy5vbkNvbW1lbnRTdWJtaXQoe25hbWU6IGF1dGhvciwgdW5pdFR5cGU6IHRleHR9KTtcclxuLy8gICAgIHRoaXMuc2V0U3RhdGUoe2F1dGhvcjogJycsIHRleHQ6ICcnfSk7XHJcbi8vICAgfSxcclxuLy8gICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIHJldHVybiAoXHJcbi8vICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImNvbW1lbnRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cclxuLy8gICAgICAgICA8aW5wdXRcclxuLy8gICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuLy8gICAgICAgICAgIHBsYWNlaG9sZGVyPVwiWW91ciBuYW1lXCJcclxuLy8gICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmF1dGhvcn1cclxuLy8gICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUF1dGhvckNoYW5nZX1cclxuLy8gICAgICAgICAvPlxyXG4vLyAgICAgICAgIDxpbnB1dFxyXG4vLyAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4vLyAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTYXkgc29tZXRoaW5nLi4uXCJcclxuLy8gICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRleHR9XHJcbi8vICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfVxyXG4vLyAgICAgICAgIC8+XHJcbi8vICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlBvc3RcIiAvPlxyXG4vLyAgICAgICA8L2Zvcm0+XHJcbi8vICAgICApO1xyXG4vLyAgIH1cclxuLy8gfSk7XHJcblxyXG5cclxuXHJcbnZhciBQYXRyb25MYXlvdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2PlRPRE88L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG52YXIgQXBwTGF5b3V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBpZD1cInBhZ2VcIj5cclxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2YmFyXCI+XHJcbiAgICAgICAgICA8bGk+PExpbmsgdG89XCIvXCI+RHJpbmtzPC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICA8bGk+PExpbmsgdG89XCIvcGF0cm9uc1wiPlBhdHJvbnM8L0xpbms+PC9saT5cclxuICAgICAgICAgIDxsaT48TGluayB0bz1cIi9pbnZlbnRvcnlcIj5JbnZlbnRvcnk8L0xpbms+PC9saT5cclxuICAgICAgICAgIDxsaT5TaG9wcGluZyBMaXN0PC9saT5cclxuICAgICAgICAgIDxsaT5IaXN0b3J5PC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJjb250ZW50XCI+XHJcbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gIC8vIDxBcHAgdXJsPVwiL2FwaS9SZWNpcGVcIiAvPixcclxuICA8Um91dGVyIGhpc3Rvcnk9e2hhc2hIaXN0b3J5fT5cclxuICAgIDxSb3V0ZSBjb21wb25lbnQ9e0FwcExheW91dH0+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17UmVjaXBlTGF5b3V0fSAvPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9wYXRyb25zXCIgY29tcG9uZW50PXtQYXRyb25MYXlvdXR9IC8+XHJcbiAgICA8L1JvdXRlPlxyXG4gIDwvUm91dGVyPixcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTtcclxuXHJcbi8qXHJcbiAgICAgIDxSb3V0ZSBjb21wb25lbnQ9e1NlYXJjaExheW91dH0+XHJcbiAgICAgICAgPFJvdXRlIHBhdGg9XCJ1c2Vyc1wiIGNvbXBvbmVudD17VXNlckxpc3R9IC8+XHJcbiAgICAgICAgPFJvdXRlIHBhdGg9XCJ3aWRnZXRzXCIgY29tcG9uZW50PXtXaWRnZXRMaXN0fSAvPlxyXG4gICAgICA8L1JvdXRlPlxyXG4qL1xyXG5cclxuLyogPT09PT0gTkVUV09SSyBIRUxQRVJTID09PT09ICovXHJcblxyXG5mdW5jdGlvbiBkZWxldGVPbmUgKG1vZGVsTmFtZSwgaWQsIGNhbGxiYWNrKSB7fVxyXG5cclxuZnVuY3Rpb24gZ2V0T25lIChtb2RlbE5hbWUsIGlkLCBjYWxsYmFjaykge31cclxuXHJcbmZ1bmN0aW9uIHBhdGNoT25lIChtb2RlbE5hbWUsIGlkLCBkZWx0YSwgY2FsbGJhY2spIHt9XHJcblxyXG5mdW5jdGlvbiBwb3N0T25lIChtb2RlbE5hbWUsIG9iamVjdCwgY2FsbGJhY2spIHt9XHJcblxyXG5mdW5jdGlvbiBwdXRPbmUgKG1vZGVsTmFtZSwgb2JqZWN0LCBjYWxsYmFjaykge31cclxuXHJcblxyXG5cclxuLypcclxuUmVjaXBlLnNjaGVtYSA9IHtcclxuICBuYW1lOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcclxuICB0YWdzOiBKb2kuYXJyYXkoKS5pdGVtcyhKb2kuc3RyaW5nKCkpLCAvLyB0YWcgbmFtZVxyXG4gIGluc3RydWN0aW9uczogSm9pLmFycmF5KCkuaXRlbXMoSm9pLnN0cmluZygpKSwgLy8gb3B0aW9uYWxcclxuICBpbmdyZWRpZW50czogSm9pLmFycmF5KCkuaXRlbXMoSm9pLm9iamVjdCgpLmtleXMoe1xyXG4gICAgc3RvY2tUeXBlSWQ6IEpvaS5zdHJpbmcoKSxcclxuICAgIHF1YW50aXR5OiBKb2kubnVtYmVyKCksXHJcbiAgfSkpLFxyXG5cclxuICBjcmVhdGVkOiBKb2kuZGF0ZSgpLnRpbWVzdGFtcCgpLFxyXG4gIGFyY2hpdmVkOiBKb2kuYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxyXG59O1xyXG4qLyJdfQ==