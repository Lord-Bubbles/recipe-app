import { useState } from 'react';
import { Card, Modal, Form } from 'react-bootstrap';
import '@/styles/Recipe.css';

// Renders each recipe as a card
export default function Recipe(props) {
  const { setCheckedRecipe, data } = props;
  const [modal, setModal] = useState(false);
  const { _id, method, ingredients, name, createdBy, time, imageUrl } = data;

  const onCheckbox = (target) => {
    setCheckedRecipe((current) => {
      // If current is not null, uncheck previously selected recipe
      if (current) {
        current.target.checked = false;
        // If current checkbox and selected checkbox is same, we no longer have
        // a selected recipe
        if (current.target === target) {
          return null;
        }
      }
      // Otherwise, return an object with the checkbox and id of recipe
      return { target: target, id: _id };
    });
  };

  // TODO (issue 26): Card/Modal image
  return (
    <>
      <Card border="dark" bg="light" className="d-flex rounded-border">
        {setCheckedRecipe && (
          <div className="d-flex justify-content-end p-2">
            <Form.Check
              aria-label="selected_recipe"
              onChange={(event) => onCheckbox(event.target)}
            />
          </div>
        )}
        <button className="card-button" onClick={() => setModal(true)}>
          <Card.Img variant="top" src={imageUrl} style={{ height: '20vh', maxWidth: '100%' }} />
          <Card.Title>{name}</Card.Title>
        </button>
      </Card>
      <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
          <Modal.Title className="modal-time">{time}</Modal.Title>
        </Modal.Header>
        <img src={imageUrl} alt={name} style={{ height: '50vh', maxWidth: '100%' }} />
        <Modal.Body>
          <div className="modal-box">
            Ingredients:
            <ul>
              {ingredients.map((ingredient, index) => {
                return <li key={index}>{ingredient}</li>;
              })}
            </ul>
          </div>
          <div className="modal-box">
            Procedure:
            <ol>
              {method.map((m, index) => {
                return <li key={index}>{m}</li>;
              })}
            </ol>
          </div>
          <span>Created By: {createdBy}</span>
        </Modal.Body>
      </Modal>
    </>
  );
}
