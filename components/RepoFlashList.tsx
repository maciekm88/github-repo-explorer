import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Divider, Icon } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { Repository, User } from '../app/types';

interface RepoFlashListProps {
  repos: Repository[];
  user: User;
  handleLoadMoreRepos: (user: User) => void;
}

const RepoFlashList: React.FC<RepoFlashListProps> = ({ repos, user, handleLoadMoreRepos }) => {
  // keyExtractor solution according to: https://github.com/Shopify/flash-list/issues/730#issuecomment-1741385659
  const keyExtractor = useCallback((repo: Repository, index: number) => `${index}-${repo.id}`, []);

  return (
    <FlashList
      data={repos}
      keyExtractor={keyExtractor}
      estimatedItemSize={156}
      renderItem={({ item }) => (
        <View style={styles.repoItem}>
          <Text style={styles.repoTitle} accessibilityLabel={`Repository name ${item.name}`}>
            {item.name}
          </Text>
          <Divider />
          <Text style={styles.repoData} accessibilityLabel={`Description: ${item.description}`}>
            {item.description}
          </Text>
          <Text style={styles.repoData} accessibilityLabel={`Language: ${item.language}`}>
            Language: {item.language}
          </Text>
          <View style={styles.repoStats}>
            <Text style={styles.repoData} accessibilityLabel={`Forks: ${item.forks}`}>
              {item.forks} <Icon source="source-branch" color={'#00f'} size={18} />
            </Text>
            <Text style={styles.repoData} accessibilityLabel={`Stars: ${item.stargazers_count}`}>
              {item.stargazers_count} <Icon source="star" color={'#ff0'} size={18} />
            </Text>
          </View>
        </View>
      )}
      ListFooterComponent={() =>
        repos.length % 5 === 0 &&
        repos.length > 0 && (
          <Button
            accessibilityLabel="Load more button"
            accessibilityHint="Loads more repositories from GitHub"
            accessibilityRole="button"
            textColor="#8000ff"
            onPress={() => handleLoadMoreRepos(user)}>
            Load more...
          </Button>
        )
      }
      role="list"
      accessibilityLabel="Repositories list"
      accessibilityHint="Displays a list of selected user's repositories"
    />
  );
};

export default RepoFlashList;

const styles = StyleSheet.create({
  repoItem: {
    backgroundColor: '#828b85',
    flex: 1,
    marginTop: 5,
    marginBottom: 2,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  repoTitle: {
    color: '#0d9',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 2,
    paddingBottom: 5,
  },
  repoData: {
    padding: 5,
    fontSize: 15,
  },
  repoStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
