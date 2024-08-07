import { FlatList, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchUsers, fetchRepos, User, Repository } from './api/github';
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
} from 'react-native-paper';

export default function Index() {
  const [username, setUsername] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [repos, setRepos] = useState<{ [key: string]: Repository[] }>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [expandedUser, setExpandedUser] = useState<{ [key: string]: boolean }>({});

  const handleSearchUsers = async () => {
    try {
      const usersData = await searchUsers(username);
      console.log('usersData: ', usersData);
      if (usersData.length === 0) {
        setDialogVisible(true);
      } else {
        setUsers(usersData);
        setRepos({});
        setSelectedUser(null);
        setExpandedUser({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchRepos = async (user: User) => {
    if (expandedUser[user.login]) {
      setExpandedUser((prev) => ({ ...prev, [user.login]: !prev[user.login] }));
    } else {
      try {
        const reposData = await fetchRepos(user.login);
        setRepos((prevRepos) => ({ ...prevRepos, [user.login]: reposData }));
        setSelectedUser(user.login);
        setPage(1);
        setExpandedUser((prev) => ({ ...prev, [user.login]: true }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLoadMoreRepos = async (user: User) => {
    try {
      const nextPage = page + 1;
      const reposData = await fetchRepos(user.login, nextPage);
      setRepos((prevRepos) => ({
        ...prevRepos,
        [user.login]: [...prevRepos[user.login], ...reposData],
      }));
      setPage(nextPage);
    } catch (error) {
      console.error(error);
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
      <Button
        mode="contained-tonal"
        style={styles.userButton}
        onPress={() => handleFetchRepos(item)}>
        <View style={styles.userButtonContent}>
          <Avatar.Image size={50} source={{ uri: item.avatar_url }} />
          <Text style={styles.userText}>{item.login}</Text>
        </View>
      </Button>

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
    if (!username) {
      return null;
    }
    return <Text>Showing users of "{username}":</Text>;
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
}

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
  },
  userText: {
    width: '75%',
    marginLeft: 20,
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