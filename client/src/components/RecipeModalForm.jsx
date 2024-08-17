import { useState } from 'react';
import { Form, Modal, InputGroup, Button } from 'react-bootstrap';

const initialRender = (mode, data) => {
  return {
    name: mode === 'edit' ? data.name : '',
    ingredients: mode === 'edit' ? data.ingredients : [''],
    method: mode === 'edit' ? data.method : [''],
    imageUrl: mode === 'edit' ? data.imageUrl : null,
    cookTime: mode === 'edit' ? data.time : 0
  };
};

// Renders form to add, modify, or delete recipe
export default function RecipeModalForm(props) {
  const { modal, setModal, user, token, mode, data } = props;
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState(() => initialRender(mode, data));

  const onSubmit = (event) => {
    const form = document.getElementById('recipe-form');
    if (form.checkValidity()) {
      let form = new FormData();
      let endpoint = '/api/recipes';
      let headers = {
        Authorization: token
      };
      if (mode !== 'add') {
        endpoint += `/${data._id}`;
      }
      if (mode !== 'delete') {
        form.append('name', formData.name);
        form.append('ingredients', formData.ingredients);
        form.append('method', formData.method);
        form.append('time', formData.cookTime);
        form.append('createdBy', user.name);
        form.append('file', formData.imageUrl);
      }

      fetch(endpoint, {
        method: mode === 'edit' ? 'PUT' : mode === 'add' ? 'POST' : 'DELETE',
        headers: headers,
        body: form
      }).catch((err) => console.log(`Error in ${mode}ing recipe: ` + err));
      setModal(false);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <Modal show={modal} onHide={() => setModal(false)} centered size="lg">
      <Modal.Header closeButton />
      <Modal.Body>
        <Form id="recipe-form" noValidate validated={validated}>
          {mode !== 'delete' ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Recipe Name"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData((current) => {
                      return { ...current, name: e.target.value };
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Name can't be empty!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  name="file"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  required
                  onChange={(e) => {
                    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
                    if (!allowedExtensions.exec(e.target.files[0].name)) {
                      alert(
                        'Invalid file type! Must be either png, jpg, or jpeg.'
                      );
                      e.target.value = '';
                      return;
                    }
                    setFormData((current) => {
                      return { ...current, imageUrl: e.target.files[0] };
                    });
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Need to upload an image that's either png, jpg or jpeg!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Ingredients</Form.Label>
                  <Button
                    type="button"
                    variant="outline-dark"
                    size="sm"
                    onClick={() =>
                      setFormData((current) => {
                        return {
                          ...current,
                          ingredients: [...current.ingredients, '']
                        };
                      })
                    }
                  >
                    Add
                  </Button>
                </div>
                {formData.ingredients.map((ingredient, index) => (
                  <>
                    <Form.Label>Ingredient {index + 1}</Form.Label>
                    <InputGroup key={index} hasValidation>
                      <Form.Control
                        type="text"
                        placeholder={`Ingredient ${index + 1}`}
                        value={ingredient}
                        required
                        onChange={(e) =>
                          setFormData((current) => {
                            const newIngredients = current.ingredients.map(
                              (val, idx) => {
                                return idx === index ? e.target.value : val;
                              }
                            );
                            return { ...current, ingredients: newIngredients };
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline-dark"
                        onClick={() =>
                          setFormData((current) => {
                            const newIngredients = current.ingredients.filter(
                              (c, idx) => idx !== index
                            );
                            return { ...current, ingredients: newIngredients };
                          })
                        }
                      >
                        Remove
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        Ingredient {index + 1} can't be empty!
                      </Form.Control.Feedback>
                    </InputGroup>
                  </>
                ))}
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Procedure</Form.Label>
                  <Button
                    type="button"
                    variant="outline-dark"
                    size="sm"
                    onClick={() =>
                      setFormData((current) => {
                        return {
                          ...current,
                          method: [...current.method, '']
                        };
                      })
                    }
                  >
                    Add
                  </Button>
                </div>
                {formData.method.map((method, index) => (
                  <>
                    <Form.Label>Step {index + 1}</Form.Label>
                    <InputGroup key={index} hasValidation>
                      <Form.Control
                        type="text"
                        placeholder={`Step ${index + 1}`}
                        value={method}
                        required
                        onChange={(e) =>
                          setFormData((current) => {
                            const newProcedure = current.method.map(
                              (val, idx) => {
                                return idx === index ? e.target.value : val;
                              }
                            );
                            return { ...current, method: newProcedure };
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline-dark"
                        onClick={() =>
                          setFormData((current) => {
                            const newProcedure = current.method.filter(
                              (c, idx) => idx !== index
                            );
                            return { ...current, method: newProcedure };
                          })
                        }
                      >
                        Remove
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        Step {index + 1} can't be empty!
                      </Form.Control.Feedback>
                    </InputGroup>
                  </>
                ))}
              </Form.Group>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Cooking Time</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) =>
                    setFormData((current) => {
                      return { ...current, cookTime: e.target.value };
                    })
                  }
                  min="1"
                  placeholder="0"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Cooking time must not be empty and must be greater than 0!
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button type="button" onClick={onSubmit}>
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <p>Are you sure you want to remove this recipe?</p>
              </div>
              <div className="d-flex justify-content-around">
                <Button type="button" onClick={onSubmit}>
                  Yes
                </Button>
                <Button type="button" onClick={() => setModal(false)}>
                  No
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
