import { useState } from 'react';
import { useFetchRecipes } from '@/components/useFetchRecipes';
import { IoAddSharp } from 'react-icons/io5';
import { GrEdit } from 'react-icons/gr';
import { BsTrash3Fill } from 'react-icons/bs';
import RecipeView from '@/components/RecipeView';
import Header from '@/components/Header';
import '@/styles/MyRecipes.css';
import RecipeModalForm from '@/components/RecipeModalForm';
import useAuthStore from '@/store/authStore';

// Renders the my recipe page when user selects it under dropdown menu
export default function MyRecipes() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [checkedRecipe, setCheckedRecipe] = useState(null);
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState('');

  const user = useAuthStore((state) => state.user);

  const { recipes, totalCount } = useFetchRecipes(
    currentPage,
    pageSize,
    ingredients,
    name,
    minTime,
    maxTime,
    user?.name
  );

  const onClick = (mode) => {
    setModal(true);
    setMode(mode);
  };

  return (
    <>
      <Header
        setName={(name) => setName(name)}
        setIngredients={(array) => setIngredients(array)}
        setMinTime={(time) => setMinTime(time)}
        setMaxTime={(time) => setMaxTime(time)}
        onPageChange={(page) => setCurrentPage(page)}
        user={user}
        page={currentPage}
        name={name}
      />
      <RecipeView
        data={recipes}
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        setPageSize={(size) => setPageSize(size)}
        setCheckedRecipe={(recipe) => setCheckedRecipe(recipe)}
      />
      <button
        type="button"
        className="circular-button"
        id="add-recipe-button"
        onClick={() => onClick('add')}
      >
        <IoAddSharp className="button-icon" />
      </button>
      {checkedRecipe && (
        <>
          <button
            type="button"
            className="circular-button"
            onClick={() => onClick('edit')}
            id="edit-recipe-button"
          >
            <GrEdit className="button-icon" />
          </button>
          <button
            type="button"
            className="circular-button"
            id="del-recipe-button"
            onClick={() => onClick('delete')}
          >
            <BsTrash3Fill className="button-icon" />
          </button>
        </>
      )}
      {modal && (
        <RecipeModalForm
          modal={modal}
          setModal={(flag) => setModal(flag)}
          user={user}
          data={
            checkedRecipe
              ? recipes.filter((s) => s._id === checkedRecipe.id)[0]
              : checkedRecipe
          }
          mode={mode}
        />
      )}
    </>
  );
}
