import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { createReview, updateReview } from 'utils/utils';

const AddReview = props => {
  let initialReviewState = '';
  let editing = false;

  if (props.location.state?.currentReview) {
    editing = true;
    initialReviewState = props.location.state.currentReview.text;
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = evt => setReview(evt.target.value);

  const saveReview = async () => {
    const data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id,
    };

    if (editing) {
      try {
        data.review_id = props.location.state.currentReview._id;
        await updateReview(data);
        setSubmitted(true);
      } catch (error) {
        console.log('Error updating review: ', error);
      }
    } else {
      try {
        await createReview(data);
        setSubmitted(true);
      } catch (error) {
        console.log('Error creating review: ', error);
      }
    }
  };

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link
                to={'/restaurants/' + props.match.params.id}
                className="btn btn-success"
              >
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group mb-1">
                <label htmlFor="description">
                  {editing ? 'Edit' : 'Create'} Review
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default AddReview;
