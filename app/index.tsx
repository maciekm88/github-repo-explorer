import { FlatList, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from './api/github';
import {
  Provider as PaperProvider,
  Avatar,
  Button,
  Card,
  HelperText,
  Text,
  TextInput,
  Icon,
  Divider,
  Portal,
  Dialog,
  TouchableRipple,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, clearUsers } from './redux/usersSlice';
import { fetchUserRepos, clearRepos } from './redux/reposSlice';
import { RootState, store } from './redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import { setSearchQuery } from './redux/searchSlice';

const Index = () => {
  const [username, setUsername] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.data);
  const repos = useSelector((state: RootState) => state.repos.data);
  const [expandedUser, setExpandedUser] = useState<{ [key: string]: boolean }>({});
  const searchQuery = useSelector((state) => state.search.query);

  const handleSearchUsers = async () => {
    dispatch(setSearchQuery(username));
    dispatch(clearUsers());
    dispatch(clearRepos());
    try {
      await dispatch(fetchUsers(username)).unwrap();
      const usersData = store.getState().users.data;
      if (usersData.length === 0) {
        setDialogVisible(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFetchRepos = async (user: User) => {
    if (expandedUser[user.login]) {
      setExpandedUser((prev) => ({ ...prev, [user.login]: !prev[user.login] }));
    } else {
      try {
        dispatch(clearRepos());
        const existingRepos = store.getState().repos[user.login];
        if (!existingRepos || existingRepos.length === 0) {
          await dispatch(fetchUserRepos({ username: user.login, page: 1 })).unwrap();
        }
        setExpandedUser((prev) => ({ ...prev, [user.login]: true }));
        setPage(existingRepos ? Math.ceil(existingRepos.length / 5) : 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLoadMoreRepos = async (user: User) => {
    try {
      const nextPage = page + 1;
      await dispatch(fetchUserRepos({ username: user.login, page: nextPage })).unwrap();
      setPage(nextPage);
    } catch (error) {
      console.error(`Error loading more repos for user ${user.login}:`, error);
    }
  };

  const hasErrors = (username?: string) => {
    if (!username) {
      return true;
    }
    const regex = /^[a-zA-Z0-9-]+$/;
    return !regex.test(username);
  };

  const renderItem = ({ item }: { item: User }) => (
    <Card style={styles.card}>
      <TouchableRipple onPress={() => handleFetchRepos(item)} style={styles.userButton}>
        <View style={styles.userButtonContent}>
          <Avatar.Image size={50} source={{ uri: item.avatar_url }} />
          <Text style={styles.userText}>{item.login}</Text>
        </View>
      </TouchableRipple>

      {expandedUser[item.login] && repos[item.login] && (
        <FlatList
          data={repos[item.login]}
          keyExtractor={(repo) => repo.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.repoItem}>
              <Text style={styles.repoTitle}>{item.name}</Text>
              <Divider />
              <Text style={styles.repoData}>{item.description}</Text>
              <Text style={styles.repoData}>Language: {item.language}</Text>
              <View style={styles.repoStats}>
                <Text style={styles.repoData}>
                  {item.forks} <Icon source="source-branch" color={'blue'} size={18} />
                </Text>
                <Text style={styles.repoData}>
                  {item.stargazers_count} <Icon source="star" color={'gold'} size={18} />
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={() =>
            repos[item.login].length % 5 === 0 &&
            repos[item.login].length > 0 && (
              <Button onPress={() => handleLoadMoreRepos(item)}>Load more...</Button>
            )
          }
        />
      )}
    </Card>
  );

  const flashlistHeaderComponent = () => {
    if (!searchQuery || users.length === 0) {
      return null;
    }
    return <Text>Showing users of "{searchQuery}":</Text>;
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          mode="outlined"
          right={<TextInput.Icon icon="account-search" />}
          label="GitHub username"
          style={styles.input}
          outlineColor="#0d9"
          activeOutlineColor="#0d9"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <HelperText type="error" visible={username.length > 0 && hasErrors(username)}>
          Username can only contain alphanumeric characters and dashes (-).
        </HelperText>
        <Button
          icon="magnify"
          mode="elevated"
          buttonColor="#0d9"
          rippleColor="gold"
          style={styles.button}
          onPress={handleSearchUsers}
          disabled={hasErrors(username)}>
          <Text>Search</Text>
        </Button>
        <FlatList
          data={users}
          keyExtractor={(user) => user.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={flashlistHeaderComponent}
        />
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title>Username does not exist</Dialog.Title>
            <Dialog.Content>
              <Text>The username you entered does not exist on GitHub. Please search again.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const App = () => (
  <ReduxProvider store={store}>
    <Index />
  </ReduxProvider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#828b85',
  },
  button: {
    marginBottom: 10,
  },
  userButton: {
    backgroundColor: 'transparent',
  },
  userButtonContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
  },
  userText: {
    width: '75%',
    marginLeft: 20,
    fontSize: 24,
  },
  input: {
    backgroundColor: '#828b85',
  },
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
  userHeader: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  dialog: {
    backgroundColor: '#aaf',
  },
});
