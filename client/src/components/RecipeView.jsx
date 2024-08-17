import Pagination from './Pagination';
import Recipe from './Recipe';
import '@/styles/RecipeView.css';
import { Row, Col } from 'react-bootstrap';

// Displays recipes in a grid, contains control of how many per page and pagination
export default function RecipeView(props) {
  const {
    onPageChange,
    data,
    currentPage,
    totalCount,
    pageSize,
    setPageSize,
    setCheckedRecipe
  } = props;

  return (
    <div className="container">
      <Row xs={1} sm={3} md={5} className="g-4">
        {data.map((recipe, idx) => {
          return setCheckedRecipe ? (
            <Col key={idx}>
              <Recipe
                data={recipe}
                key={recipe._id}
                setCheckedRecipe={(recipe) => setCheckedRecipe(recipe)}
              />
            </Col>
          ) : (
            <Col key={idx}>
              <Recipe data={recipe} key={recipe._id} />
            </Col>
          );
        })}
      </Row>
      <div className="d-flex justify-content-around mt-3">
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={(page) => onPageChange(page)}
        />
        <div>
          <span style={{ marginRight: '5px' }}>Items per page:</span>
          <select onChange={(e) => setPageSize(e.target.value)}>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}
