import axios from 'axios';

export interface User {
  login: string;
  id: number;
  avatar_url: string;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  forks: number;
  stargazers_count: number;
  id: number;
}

export const searchUsers = async (username: string): Promise<{ items: User[] }> => {
  try {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${username}&per_page=5`,
    );
    return response.data.items;
  } catch (error) {
    console.error('Error fetching users:', error);
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
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};
