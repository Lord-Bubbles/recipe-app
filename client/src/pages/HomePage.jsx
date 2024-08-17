import { useState } from 'react';
import { useFetchRecipes } from '@/components/useFetchRecipes';
import RecipeView from '@/components/RecipeView';
import Header from '@/components/Header';

export default function HomePage() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [creator, setCreator] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { recipes, totalCount } = useFetchRecipes(
    currentPage,
    pageSize,
    ingredients,
    name,
    minTime,
    maxTime,
    creator
  );

  return (
    <>
      <Header
        setName={(name) => setName(name)}
        setIngredients={(array) => setIngredients(array)}
        setMinTime={(time) => setMinTime(time)}
        setMaxTime={(time) => setMaxTime(time)}
        setCreator={(name) => setCreator(name)}
        onPageChange={(page) => setCurrentPage(page)}
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
      />
    </>
  );
}
