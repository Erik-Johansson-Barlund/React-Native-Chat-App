import React, { useState } from 'react';
import { View, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import AppContext from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Start', 'Chat'>;

/**
 * Displays the app landing screen
 */
function StartScreen({ navigation }: Props): React.JSX.Element {
  const { setDisplayName } = React.useContext(AppContext);
  const [newDisplayName, setNewDisplayName] = useState('');

  /**
   * Checks displayName validity, sets displayName in context and navigates to the chat screen
   */
  const setupUser = (): void => {
    if (newDisplayName.trim().length === 0) {
      return;
    }

    Haptics.selectionAsync();
    setDisplayName(newDisplayName);
    navigation.navigate('Chat');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logoText}
        source={require('../assets/logo.png')}
      />
      <View style={styles.shape} />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Input display name"
          value={newDisplayName}
          onChangeText={(newText): void => setNewDisplayName(newText)}
          style={styles.textInput}
        />
        <Pressable
          onPress={setupUser}>
          <View>
            <Ionicons name="send-sharp" size={30} color="rgb(40, 39, 39)" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 233, 226)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  shape: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgb(244, 128, 92)',
  },
  inputRow: {
    backgroundColor: 'rgb(244, 199, 185)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '84%',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#807d7d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  textInput: {
    fontSize: 24,
    minWidth: 100,
  },
});