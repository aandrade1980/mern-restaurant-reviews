import axios from 'axios';
import useSWR from 'swr';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1/restaurants',
  headers: { 'Content-type': 'application/json' },
});

export const fetcher = url => axiosInstance.get(url).then(res => res.data);

export const useRestaurants = (by, query) => {
  const { data, error } = useSWR(
    !by || !query ? null : `?${by}=${query}`,
    fetcher
  );

  return {
    restaurants: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const deleteReview = (reviewId, userId) =>
  axiosInstance.delete(`/review?id=${reviewId}`, {
    data: { user_id: userId },
  });

export const updateReview = review => axiosInstance.put('/review', review);

export const createReview = review => axiosInstance.post('/review', review);
