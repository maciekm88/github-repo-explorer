import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './redux/store';
import { fetchUsers, clearUsers } from './redux/usersSlice';
import { fetchUserRepos, clearRepos } from './redux/reposSlice';
import { setSearchQuery } from './redux/searchSlice';
import SearchBar from '../components/SearchBar';
import UsersList from '../components/UsersList';
import DialogComponent from '../components/DialogComponent';
import { User } from './types';

const Index = () => {
  const [username, setUsername] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.data);
  const repos = useSelector((state: RootState) => state.repos.data);
  const [expandedUser, setExpandedUser] = useState<{ [key: string]: boolean }>({});
  const searchQuery = useSelector((state: RootState) => state.search.query);

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
        setExpandedUser({ [user.login]: true });
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

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        username={username}
        setUsername={setUsername}
        hasErrors={hasErrors}
        handleSearchUsers={handleSearchUsers}
      />
      <UsersList
        users={users}
        expandedUser={expandedUser}
        repos={repos}
        handleFetchRepos={handleFetchRepos}
        handleLoadMoreRepos={handleLoadMoreRepos}
        searchQuery={searchQuery}
      />
      <DialogComponent dialogVisible={dialogVisible} setDialogVisible={setDialogVisible} />
    </SafeAreaView>
  );
};

const App = () => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <Index />
    </PaperProvider>
  </ReduxProvider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#828b85',
  },
});
