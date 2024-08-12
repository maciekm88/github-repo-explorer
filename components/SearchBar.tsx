import React from 'react';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface SearchBarProps {
  username: string;
  setUsername: (text: string) => void;
  hasErrors: (username?: string) => boolean;
  handleSearchUsers: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  username,
  setUsername,
  hasErrors,
  handleSearchUsers,
}) => {
  return (
    <View>
      <TextInput
        mode="outlined"
        right={<TextInput.Icon color="#0d9" icon="account-search" />}
        label="GitHub username"
        style={styles.input}
        outlineColor="#0d9"
        activeOutlineColor="#0d9"
        value={username}
        onChangeText={setUsername}
      />
      <HelperText type="error" visible={username.length > 0 && hasErrors(username)}>
        Username can only contain alphanumeric characters and dashes (-).
      </HelperText>
      <Button
        icon="magnify"
        mode="elevated"
        buttonColor="#0d9"
        rippleColor="#ffbf00"
        textColor="#8000ff"
        style={styles.button}
        onPress={handleSearchUsers}
        disabled={hasErrors(username)}>
        Search
      </Button>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#828b85',
  },
  button: {
    marginBottom: 10,
  },
});
