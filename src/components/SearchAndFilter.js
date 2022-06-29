import React from "react";
import {Container, InputGroup, Modal, Button, Form, FormControl} from "react-bootstrap";
import {BsSearch} from "react-icons/bs";
import "../styles/SearchAndFilter.css";

class SearchAndFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      name: "",
      ingredients: [],
      minTime: 0,
      maxTime: 0,
      createdBy: "",
      inputFields: []
    };
  }

  // Determines whether modal window is open or not
  setModal = (flag) => {
    this.setState({ modalOpen: flag });
  }

  // Keeps track of the user input for recipe name
  setName = (event) => {
    this.setState({ name: event.target.value })
  }

  // Handles getting the ingredients the user inputted to filter on
  setIngredient = (index, event) => {
    const ingredients = [...this.state.ingredients];
    if (!ingredients[index]) {
      ingredients.push(event.target.value);
    } else {
      ingredients[index] = event.target.value;
    }
    this.setState({ ingredients: ingredients });
  }

  // Handles creating a new input field with an option to add more every time the user clicks the plus button
  addInput = () => {
    const { inputFields, ingredients } = this.state;
    const inputs = [...inputFields];
    const length = inputFields.length;
    inputs.push(
      <React.Fragment key={length}>
        <label>Ingredient:
          <input type="text" value={ingredients[length]} onChange={(event) => this.setIngredient(length, event)}/>
        </label>
        <button id={`form-add-${length}`} onClick={this.addInput} type="button">+</button>
        <br></br>
      </React.Fragment>
    )
    this.setState({ inputFields: inputs }, () => {
      if (length != 0) {
        document.getElementById(`form-add-${length-1}`).classList.add("hidden");
      }
    });
    document.getElementById("form-add").classList.add("hidden");
  }

  // Keeps track of the user input for min time
  setMin = (event) => {
    this.setState({ minTime: event.target.value });
  }

  // Keeps track of the user input for max time
  setMax = (event) => {
    this.setState({ maxTime: event.target.value });
  }

  // Keeps track of the user input for created by
  setCreator = (event) => {
    this.setState({ createdBy: event.target.value });
  }

  // Returns a valid query parameter string depending on the ingredients state
  createIngredientQueryParam = () => {
    let res = "";
    let { ingredients } = this.state;
    for (let i in ingredients) {
      res += `ingredients=${ingredients[i]}&`
    }
    return res;
  }

  // Filters what gets displayed based on the user inputs
  filterRecipes = async () => {
    fetch(`/recipes?page=${this.props.page}&limit=${this.props.limit}&
      ${this.createIngredientQueryParam()}name=${this.state.name}&min=${this.state.minTime}&
      max=${this.state.maxTime}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => this.props.setRecipes(data));
  }

  // Used by the search bar to filter the recipes displayed
  onSearch = async (event) => {
    this.setState({ name: event.target.value }, await this.filterRecipes());
  }

  // Used by the submit button to filter the recipes displayed and closes modal window
  onSubmit = async () => {
    await this.filterRecipes();
    this.setState({ modalOpen: false });
  }

  render() {
    return (
      <Container>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={this.onSearch}
          />
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
        </InputGroup>
        <Button onClick={() => this.setModal(true)} type="button">Advanced Search</Button>
        <Modal
          show={this.state.modalOpen}
          onHide={() => this.setModal(false)}
          centered="true"
          size="lg"
        >
          <Modal.Body className="formBody">
            <Form>
              <label>Name: 
                <input type="text" value={this.state.name} onChange={this.setName} />
              </label>
              <br></br>
              <label>Ingredients: </label>
              <button id="form-add" onClick={this.addInput} type="button">+</button>
              <br></br>
              {this.state.inputFields}
              <br></br>
              <label>Min Time:
                <input type="number" value={this.state.minTime} onChange={this.setMin} />
              </label>
              <br></br>
              <label>Max Time:
                <input type="number" value={this.state.maxTime} onChange={this.setMax} />
              </label>
              <br></br>
              <label>Created By:
                <input type="text" value={this.state.createdBy} onChange={this.setCreator} />
              </label>
            </Form>
          </Modal.Body>
          <Modal.Footer className="formBody">
            <Button onClick={this.onSubmit} type="submit">Submit</Button>
            <Button onClick={() => this.setModal(false)} type="button">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default SearchAndFilter;
