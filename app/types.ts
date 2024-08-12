export interface User {
  id: number;
  login: string;
  avatar_url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  forks: number;
  stargazers_count: number;
}
