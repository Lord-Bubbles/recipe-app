import React from "react";
import Pagination from "./Pagination";
import Recipe from "./Recipe";

class RecipeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  createRecipes = () => {
    const recipes = this.props.data.map((recipe) => {
      return <Recipe data={recipe} key={recipe.id}/>;
    })
    return recipes;
  }

  render() {
    return (
      <div>
        {this.createRecipes()}
        <Pagination />
      </div>
    );
  }
}

export default RecipeView;
