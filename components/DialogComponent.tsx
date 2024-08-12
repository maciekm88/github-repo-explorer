import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface DialogComponentProps {
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({ dialogVisible, setDialogVisible }) => {
  return (
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
          <Button textColor="#8000ff" onPress={() => setDialogVisible(false)}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogComponent;

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#aaf',
  },
});
