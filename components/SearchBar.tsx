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
        accessibilityLabel="GitHub username"
        accessibilityHint="Enter the GitHub username to search"
        accessibilityRole="search"
        testID="search-input"
      />
      <HelperText
        type="error"
        visible={username.length > 0 && hasErrors(username)}
        accessibilityLabel="Username can only contain alphanumeric characters and dashes"
        accessibilityHint="Displays an error if the username contains invalid characters">
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
        disabled={hasErrors(username)}
        accessibilityLabel="Search button"
        accessibilityHint="Search for the GitHub username entered"
        accessibilityRole="button"
        testID="search-button">
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
