import React from 'react';
import { Link } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { deleteReview, fetcher } from 'utils/utils';

const Restaurant = props => {
  const { id } = props.match.params;

  const { data: restaurant, error } = useSWR(`/id/${id}`, fetcher);

  if (error) return <div>Error getting restaurant...</div>;
  if (!restaurant) return <div>Loading...</div>;

  const handleDeleteReview = async (e, reviewId) => {
    e.preventDefault();
    mutate(
      `/id/${id}`,
      {
        ...restaurant,
        reviews: restaurant.reviews.filter(review => review._id !== reviewId),
      },
      false
    );
    await deleteReview(reviewId, props.user.id);
    mutate(`/id/${id}`);
  };

  return (
    <div>
      <div>
        <h5>{restaurant.name}</h5>
        <p>
          <strong>Cuisine: </strong>
          {restaurant.cuisine}
          <br />
          <strong>Address: </strong>
          {restaurant.address.building} {restaurant.address.street},{' '}
          {restaurant.address.zipcode}
        </p>
        <Link to={`/restaurants/${id}/review`} className="btn btn-primary">
          Add Review
        </Link>
        <h4>Reviews</h4>
        <div className="row">
          {restaurant.reviews.length > 0 ? (
            restaurant.reviews.map((review, index) => (
              <div className="col-lg-4 pb-1" key={index}>
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">
                      {review.text}
                      <br />
                      <strong>User: </strong>

                      {review.name}
                      <br />
                      <strong>Date: </strong>
                      {review.date}
                    </p>
                    {props.user?.id === review.user_id && (
                      <div className="row">
                        <a
                          href=""
                          onClick={e => handleDeleteReview(e, review._id)}
                          className="btn btn-primary col-lg-5 mx-1 mb-1"
                        >
                          Delete
                        </a>
                        <Link
                          to={{
                            pathname: `/restaurants/${id}/review`,
                            state: { currentReview: review },
                          }}
                          className="btn btn-primary col-lg-5 mx-1 mb-1"
                        >
                          Edit{' '}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
