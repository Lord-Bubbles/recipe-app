import React, { useState } from 'react';
import { InputGroup, Button, FormControl, Container } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import ModalForm from './ModalForm';

export default function SearchAndFilter(props) {
  const {
    setIngredients,
    setCreator,
    setName,
    setMinTime,
    setMaxTime,
    onPageChange,
    name,
  } = props;
  const [modalOpen, setModal] = useState(false);

  // Render the modal form if modal is open; otherwise render nothing
  const renderForm = () => {
    if (modalOpen) {
      return (
        <ModalForm
          setModal={(flag) => setModal(flag)}
          setName={(name) => setName(name)}
          modalOpen={modalOpen}
          setIngredients={(ingredients) => setIngredients(ingredients)}
          setCreator={(user) => setCreator(user)}
          setMinTime={(time) => setMinTime(time)}
          setMaxTime={(time) => setMaxTime(time)}
          onPageChange={(page) => onPageChange(page)}
        />
      );
    }
    return null;
  };

  const sendName = (name) => {
    setName(name);
    onPageChange(1);
  };

  return (
    <Container>
      <InputGroup>
        <FormControl
          as="input"
          type="text"
          placeholder="Search"
          onInput={(event) => sendName(event.target.value)}
          value={name}
        />
        {/*<input className="col-11" type="search" value={this.state.name} onChange={this.onSearch}/>*/}
        <Button variant="outline-dark" onClick={() => onPageChange(1)}>
          <BsSearch />
        </Button>
      </InputGroup>
      <Button onClick={() => setModal(true)} type="button">
        Advanced Search
      </Button>
      {renderForm()}
    </Container>
  );
};
