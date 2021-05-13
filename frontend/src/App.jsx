import React, { useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from 'components/Add-Review';
import Restaurant from 'components/Restaurant';
import RestaurantsList from 'components/Restaurants-list';
import Login from 'components/Login';

const LOCALSTORAGE_USER_KEY = 'restaurant-user';

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(LOCALSTORAGE_USER_KEY)) || null
  );

  const login = (user = null) => {
    setUser(user);
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem(LOCALSTORAGE_USER_KEY, null);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <a href="/restaurants" className="navbar-brand">
          Restaurants Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/restaurants" className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <a
                className="nav-link"
                style={{ cursor: 'pointer' }}
                onClick={logout}
              >
                Logout {user.name}
              </a>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route
            exact
            path={['/', '/restaurants']}
            component={RestaurantsList}
          />
          <Route
            path="/restaurants/:id/review"
            render={props => <AddReview {...props} user={user} />}
          />
          <Route
            path="/restaurants/:id"
            render={props => <Restaurant {...props} user={user} />}
          />
          <Route
            path="/login"
            render={props => <Login {...props} login={login} />}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
