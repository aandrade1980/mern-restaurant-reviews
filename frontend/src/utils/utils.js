import axios from 'axios';
import useSWR from 'swr';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_MONGO_REAL_BASE_URL,
  headers: { 'Content-type': 'application/json' },
});

export const fetcher = url => axiosInstance.get(url).then(res => res.data);

export const useRestaurants = (by, query) => {
  const { data, error } = useSWR(
    !by || !query ? null : `/restaurants?${by}=${query}`,
    fetcher
  );

  return {
    restaurants: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const deleteReview = (reviewId, userId) =>
  axiosInstance.delete(`/review-delete?id=${reviewId}`, {
    data: { user_id: userId },
  });

export const updateReview = review => axiosInstance.put('/review-edit', review);

export const createReview = review => axiosInstance.post('/review-new', review);
