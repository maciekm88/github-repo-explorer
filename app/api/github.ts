import axios from 'axios';
import { User } from '../types';
import { Repository } from '../types';

export const searchUsers = async (username: string): Promise<{ items: User[] }> => {
  try {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${username}&per_page=5`,
    );
    return response.data.items;
  } catch (error: any) {
    if (error.response) {
      console.error('Error fetching users:', {
        message: error.message,
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('No response received:', {
        message: error.message,
        request: error.request,
      });
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

export const fetchRepos = async (username: string, page: number = 1): Promise<Repository[]> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      params: {
        per_page: 5,
        page,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error fetching repositories:', {
        message: error.message,
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('No response received:', {
        message: error.message,
        request: error.request,
      });
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};
