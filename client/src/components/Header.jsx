import SearchAndFilter from './SearchAndFilter';
import useAuthStore from '@/store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { Dropdown, Navbar, Container, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useShallow } from 'zustand/react/shallow';

// Render nav bar that contains search bar, dropdown menu, login
export default function Header(props) {
  const {
    setIngredients,
    setCreator,
    setMinTime,
    setMaxTime,
    setName,
    onPageChange,
    page,
    name
  } = props;

  const [user, login, logout] = useAuthStore(
    useShallow((state) => [state.user, state.login, state.logout])
  );
  const location = useLocation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await login(codeResponse.code);
    },
    onError: (e) => {
      console.log('Error has occured while logging in: ' + e);
    },
    flow: 'auth-code'
  });

  const navigate = useNavigate();

  const navigateTo = (route) => {
    switch (route) {
      case 'My Recipes':
        navigate(`/my-recipes`);
        break;
      case 'My Meal Plan':
        navigate(`/my-mealplan`);
        break;
      case 'Sign Out':
        logout();
      // eslint-disable-next-line no-fallthrough
      default:
        navigate('/', { replace: true });
    }
  };

  return (
    <Navbar className="mb-3">
      <Container fluid>
        {location.pathname !== '/my-mealplan' && (
          <SearchAndFilter
            setIngredients={(ingredients) => setIngredients(ingredients)}
            setCreator={(user) => setCreator(user)}
            setMinTime={(time) => setMinTime(time)}
            setMaxTime={(time) => setMaxTime(time)}
            setName={(name) => setName(name)}
            onPageChange={(page) => onPageChange(page)}
            page={page}
            name={name}
          />
        )}
        <div className="justify-content-end">
          {user ? (
            <>
              <Dropdown onSelect={(key) => navigateTo(key)}>
                <Dropdown.Toggle>
                  <img src={user.profile} alt="Profile picture of user" />
                  <span>My Account</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" eventKey="Home">
                    Home
                  </Dropdown.Item>
                  <Dropdown.Item as="button" eventKey="My Recipes">
                    My Recipes
                  </Dropdown.Item>
                  <Dropdown.Item as="button" eventKey="My Meal Plan">
                    My Meal Plan
                  </Dropdown.Item>
                  <Dropdown.Item as="button" eventKey="Sign Out">
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Button onClick={() => googleLogin()} variant="outline-dark">
                <FcGoogle />
                <span className="ms-1">Sign In</span>
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
