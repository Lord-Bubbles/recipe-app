import React from "react";
import { Card, Modal } from "react-bootstrap";
import "../styles/Recipe.css";

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  setModal = (flag) => {
    this.setState({modal: flag});
  }

  displayIngredients = () => {
    let ingredList = [];
    const {ingredients} = this.props.data;
    for (let i in ingredients) {
      ingredList.push(<li key={i}>{ingredients[i]}</li>);
    }
    return ingredList;
  }

  displayProcedure = () => {
    let procList = [];
    const {method} = this.props.data;
    for (let i in method) {
      procList.push(<li key={i}>{method[i]}</li>);
    }
    return procList;
  }

  // TODO (issue 26): Card/Modal image
  render() {
    return (
      <div className="container">
        <div className="rounded-border d-inline p-1 bg-light">
          <Card border="dark">
            <Card.Img variant="top" src=""/>
            <Card.Title>
              <button className="card-title" onClick={() => this.setModal(true)}>
                <strong>{this.props.data.name}</strong>
              </button>
            </Card.Title>
            <Card.Body>
              <div>Time: {this.props.data.time} min</div>
              <div>Created by: {this.props.data.createdBy}</div>
            </Card.Body>
          </Card>
        </div>
        <Modal
          show={this.state.modal}
          onHide={() => this.setModal(false)}
          centered="true"
          size="lg"
        >
          <Modal.Header closeButton>
              <Modal.Title>{this.props.data.name}</Modal.Title>
              <Modal.Title className="modalTitle">{this.props.data.time} min</Modal.Title>
          </Modal.Header>
          <img 
              src="" 
              alt={`${this.props.data.name}`}
          />
          <Modal.Body>
            <div className="modal-box">
              Ingredients:
              <ul>{this.displayIngredients()}</ul>
            </div>
            <div className="modal-box">
              Procedure:
              <ol>{this.displayProcedure()}</ol>
            </div>
            <div>Created By: {this.props.data.createdBy}</div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Recipe;
