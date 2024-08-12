import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Avatar, TouchableRipple, Icon } from 'react-native-paper';
import { Repository, User } from '../app/types';
import RepoFlashList from './RepoFlashList';

interface UserCardProps {
  user: User;
  expanded: boolean;
  repos: Repository[];
  handleFetchRepos: (user: User) => void;
  handleLoadMoreRepos: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  expanded,
  repos,
  handleFetchRepos,
  handleLoadMoreRepos,
}) => {
  return (
    <Card
      style={styles.card}
      accessibilityLabel="User card"
      accessibilityHint="Displays details of a GitHub user"
      accessibilityRole="button">
      <TouchableRipple
        onPress={() => handleFetchRepos(user)}
        style={styles.userButton}
        accessibilityLabel={
          expanded ? `Collapse repositories for ${user.login}` : `Repositories for ${user.login}`
        }
        accessibilityHint={
          expanded
            ? `Tap to collapse repositories for ${user.login}`
            : `Tap to fetch and display repositories for ${user.login}`
        }>
        <View style={styles.userButtonContent}>
          <Avatar.Image
            size={50}
            source={{ uri: user.avatar_url }}
            accessibilityLabel={`Avatar of ${user.login}`}
            accessibilityRole="image"
          />
          <Text style={styles.userText}>{user.login}</Text>
          <Icon source={expanded ? 'chevron-up' : 'chevron-down'} color={'#8000ff'} size={24} />
        </View>
      </TouchableRipple>

      {expanded && repos && repos.length > 0 && (
        <RepoFlashList repos={repos} user={user} handleLoadMoreRepos={handleLoadMoreRepos} />
      )}
    </Card>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: '#0a9',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: '#000',
  },
  userButton: {
    backgroundColor: 'transparent',
  },
  userButtonContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginRight: 20,
  },
  userText: {
    width: '75%',
    marginLeft: 20,
    fontSize: 24,
  },
});
