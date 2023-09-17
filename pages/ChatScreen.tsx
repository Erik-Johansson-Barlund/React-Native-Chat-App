import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Dimensions, Platform, Pressable, FlatList, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AppContext, { MessageType } from '../context/AppContext';

const windowHeight = Dimensions.get('window').height;

/**
 * Displays a single formatted message, for use in FlatList
 */
const Message = (item: MessageType, userId: string): React.JSX.Element => (
  <View style={[styles.message, item.userId === userId ? styles.leftAligned : styles.rightAligned]}>
    <Text>{item.displayName}</Text>
    <View style={styles.textBackground}>
      <View style={styles.messageTextWrapper}>
        <Text>
          {item.message}
        </Text>
      </View>
    </View>
  </View>
);

/**
 * Displays a separator between messages, for use in FlatList
 */
const Separator = (): React.JSX.Element => (
  <View style={styles.separator} />
);

/**
 * Displays the chat screen
 */
function ChatScreen(): React.JSX.Element {
  const [messageText, setMessageText] = useState('');
  const { userId, messages, sendMessage, getOlderMessages } = useContext(AppContext);

  /**
   * checks message validity, triggers the sendMessage logic in context and clears the input field
   */
  const handleSendMessage = async (): Promise<void> => {
    if (messageText.trim().length === 0) {
      return;
    }

    Haptics.selectionAsync();
    const unloadText = messageText;
    setMessageText('');

    await sendMessage(unloadText);
  };

  return (
    <View style={styles.baseContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={windowHeight * 0.075}
      >
        <View style={styles.container}>
          <View style={styles.messageContainer}>
            <FlatList
              data={messages}
              renderItem={({ item }): React.JSX.Element => Message(item, userId)}
              ItemSeparatorComponent={Separator}
              keyExtractor={(item, index): string => index.toString()}
              onEndReached={getOlderMessages}
              inverted
            />
          </View>
          <View style={styles.footer}>
            <Pressable onPress={(): void => Keyboard.dismiss()}>
              <Ionicons name="chevron-down" size={20} color="rgb(50, 50, 50)" />
            </Pressable>
            <TextInput
              placeholder="Write something.."
              value={messageText}
              onChangeText={(newText): void => setMessageText(newText)}
              style={styles.textInput}
            />
            <View>
              <Pressable
                onPress={handleSendMessage}>
                <View>
                  <Ionicons name="send-sharp" size={30} color="rgb(40, 39, 39)" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  baseContainer: {
    height: windowHeight,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    marginBottom: windowHeight * 0.11,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgb(255, 233, 226)',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    width: '95%',
  },
  message: {
    maxWidth: '95%',
  },
  textBackground: {
    backgroundColor: 'rbg(0, 0, 0)'
  },
  messageTextWrapper: {
    backgroundColor: 'rgb(244, 199, 185)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  leftAligned: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  rightAligned: {
    marginLeft: 'auto',
    marginRight: 0,
    alignItems: 'flex-end',
  },
  separator: {
    height: 20,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: windowHeight * 0.03,
    width: '100%',
    minHeight: windowHeight * 0.1,
    maxHeight: windowHeight * 0.1,
    borderTopColor: 'rgb(248, 223, 215)',
    borderTopWidth: 1,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    width: '80%',
  },
});