import React from 'react';
import { FlatList, Text } from 'react-native';
import UserCard from './UserCard';
import { Repository, User } from '../app/types';

interface UsersListProps {
  users: User[];
  expandedUser: { [key: string]: boolean };
  repos: { [key: string]: Repository[] };
  handleFetchRepos: (user: User) => void;
  handleLoadMoreRepos: (user: User) => void;
  searchQuery: string;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  expandedUser,
  repos,
  handleFetchRepos,
  handleLoadMoreRepos,
  searchQuery,
}) => {
  const flashlistHeaderComponent = () => {
    if (!searchQuery || users.length === 0) {
      return null;
    }
    return (
      <Text accessibilityLabel={`Showing users for query ${searchQuery}`}>
        Showing users of "{searchQuery}":
      </Text>
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(user) => user.id.toString()}
      renderItem={({ item }) => (
        <UserCard
          user={item}
          expanded={expandedUser[item.login]}
          repos={repos[item.login] || []}
          handleFetchRepos={handleFetchRepos}
          handleLoadMoreRepos={handleLoadMoreRepos}
        />
      )}
      ListHeaderComponent={flashlistHeaderComponent}
      role="list"
      accessibilityLabel="Users list"
      accessibilityHint="Displays a list of GitHub users based on search query"
    />
  );
};

export default UsersList;
