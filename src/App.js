import './App.css';
import React from 'react';
import SearchAndFilter from './components/SearchAndFilter';
import jwt_decode from "jwt-decode";
import {Dropdown, DropdownButton}  from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import MyRecipes from './components/MyRecipes';
import MyMealPlan from './components/MyMealPlan';
import RecipeView from "./components/RecipeView";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user: null,
      recipes: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 100,
      page: "Home"
    };
  }

  handleCallbackResponse = (response) => {
    this.setState({ token: response.credential });
    let userObject = jwt_decode(response.credential);
    this.setState({ user: userObject });
    document.getElementById("signInDiv").hidden = true;
  }

  handleLogout = () => {
    this.setState({user: null, page: "Home"});
    document.getElementById("signInDiv").hidden = false;
  }

  async componentDidMount() {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: this.handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    fetch(`/recipes?page=${this.state.currentPage}&limit=${this.state.pageSize}`, {
      method: "GET",
      headers: {
        "Accept": "applicatiohn/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ recipes: data.recipes, totalCount: data.count }));
  }

  navigateTo = (route, event) => {
    this.setState({ page: route }, () => {
      if (this.state.page == "Sign out") {
        this.handleLogout();
      }
    });
  }

  searchRender = () => {
    let { page } = this.state;
    switch (page) {
      case "My Recipes":
        return (
          <React.Fragment>
            <SearchAndFilter 
              page={this.state.currentPage} 
              limit={this.state.pageSize}
              setRecipes={recipes => this.setRecipes(recipes)} 
            />
            <MyRecipes />
          </React.Fragment>
        );
      case "My Meal Plan":
        return <MyMealPlan />;
      default:
        return (
          <React.Fragment>
            <SearchAndFilter 
              page={this.state.currentPage} 
              limit={this.state.pageSize}
              setRecipes={recipes => this.setRecipes(recipes)} 
            />
            <RecipeView
              data={this.state.recipes}
              currentPage={this.state.currentPage}
              total={this.state.totalCount}
              pageSize={this.state.pageSize}
              onPageChange={page => this.setCurrentPage(page)}
              setRecipes={recipes => this.setRecipes(recipes)}
            />
          </React.Fragment>
        );
    }
  }
  
  getMenu = () => {
    if (this.state.user) {
      return (
        <div className="Account-Menu">
          <DropdownButton title="My Account" menuRole="menu" onSelect={(eventKey, event) => this.navigateTo(eventKey, event)}>
            <Dropdown.Item as="button" eventKey="Home">Home</Dropdown.Item>
            <Dropdown.Item as="button" eventKey="My Recipes">My Recipes</Dropdown.Item>
            <Dropdown.Item as="button" eventKey="My Meal Plan">My Meal Plan</Dropdown.Item>
            <Dropdown.Item as="button" eventKey="Sign out">Sign out</Dropdown.Item>
          </DropdownButton>
        </div>
      )
    }
    return <React.Fragment></React.Fragment>
  }

  setCurrentPage = (page) => {
    this.setState({ currentPage: page });
  }

  setRecipes = (recipes) => {
    this.setState({ recipes: recipes });
  }

  render() {
    return (
      <div>
        {this.getMenu()}
        <div id="signInDiv" className="Account-Menu"></div>
        {this.searchRender()}
      </div>
    );
  }
}

export default App;
