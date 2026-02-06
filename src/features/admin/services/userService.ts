import axios from '../../../lib/axios';

export const getUsers = async (params: Record<string, any>) => {
  try {
    const res = await axios.get('/users', { params });
    console.log('[getUsers] response:', res);
    return res;
  } catch (error) {
    console.error('[getUsers] error:', error);
    throw error;
  }
};

export const getUserDetail = (userId: string | number) => {
  return axios.get(`/users/${userId}`);
};

export const createUser = (data: Record<string, any>) => {
  return axios.post('/users', data);
};

export const updateUser = (userId: string | number, data: Record<string, any>) => {
  return axios.put(`/users/${userId}`, data);
};

export const updateUserRole = (userId: string | number, data: Record<string, any>) => {
  return axios.put(`/users/${userId}/role`, data);
};

export const deleteUser = (userId: string | number) => {
  return axios.delete(`/users/${userId}`);
};

export const getMyProfile = () => {
  return axios.get('/users/me');
};

export const editMyProfile = (data: Record<string, any>) => {
  return axios.put('/users/me', data);
};

export const changeMyPassword = (data: Record<string, any>) => {
  return axios.put('/users/me/password', data);
};
