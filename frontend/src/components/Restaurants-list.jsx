import React, { useState } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

import { fetcher, useRestaurants } from 'utils/utils';

const RestaurantsList = () => {
  const [searchName, setSearchName] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [searchBy, setSearchBy] = useState(null);

  const { data: allRestaurants, error: getRestaurantsError } = useSWR(
    '/restaurants?page=0',
    fetcher
  );
  const { data: cuisines, error: getCuisinesError } = useSWR(
    '/cuisines',
    fetcher
  );
  const { restaurants, isLoading } = useRestaurants(
    searchBy?.by,
    searchBy?.query
  );

  if (getRestaurantsError || getCuisinesError) return <div>Failed to load</div>;
  if (!allRestaurants || !cuisines) return <div>Loading...</div>;

  const onChangeSearchName = e => setSearchName(e.target.value);

  const onChangeSearchZip = e => setSearchZip(e.target.value);

  const onChangeSearchCuisine = e => setSearchCuisine(e.target.value);

  const allCuisines = ['All Cuisines'].concat(cuisines);

  const restaurantsToDisplay = restaurants?.restaurants.length
    ? restaurants
    : isLoading && searchBy
    ? []
    : allRestaurants;

  const find = by => {
    switch (by) {
      case 'name':
        setSearchBy({ by, query: searchName });
        break;
      case 'zipcode':
        setSearchBy({ by, query: searchZip });
        break;
      case 'cuisine':
        setSearchBy({ by, query: searchCuisine });
        break;
      default:
        setSearchBy(null);
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => find('name')}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => find('zipcode')}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchCuisine}>
            {allCuisines.map((cuisine, index) => (
              <option value={cuisine} key={cuisine + index}>
                {cuisine.substr(0, 20)}
              </option>
            ))}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => find('cuisine')}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {restaurantsToDisplay?.restaurants?.map(restaurant => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1" key={restaurant._id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div className="row">
                    <Link
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                      to={`/restaurants/${restaurant._id}`}
                    >
                      View Reviews
                    </Link>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps/place/${address}`}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantsList;
