import ReviewsDAO from '../dao/reviewsDAO.js';

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const { restaurant_id, text, name, user_id: _id } = req.body;
      const userInfo = {
        name,
        _id,
      };
      const date = new Date();

      await ReviewsDAO.addReview(restaurant_id, userInfo, text, date);

      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const { review_id: reviewId, text, user_id } = req.body;
      const date = new Date();

      console.log(reviewId, text, user_id);
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        user_id,
        text,
        date
      );

      const { error } = reviewResponse;

      if (error) {
        res.status(400).json({ error });
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          'Unable to update review - user may not be original poster'
        );
      }

      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id;

      await ReviewsDAO.deleteReview(reviewId, userId);

      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: e.message });
    }
  }
}
