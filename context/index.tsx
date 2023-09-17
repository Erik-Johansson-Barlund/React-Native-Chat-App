/* eslint-disable no-console */
import React, { useState, useMemo, useEffect } from 'react';
import AppContext, { AppContextType, MessageType } from './AppContext';
import app from '../firebase/firebaseConfig';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  getDocs,
  limitToLast,
  orderBy,
  getCountFromServer,
  endAt,
} from 'firebase/firestore';

const COLLECTION_NAME = 'ErikJohanssonTestAppCollection';
const FILTER_DATETIME = 'dateTime';
const MESSAGES_LIMIT = 25;

/**
 * App context provider, talks to firebase and stores values 
 */
function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const firestoreDB = getFirestore(app);

  useEffect(() => {
    setUserId(uuid());
  }, []);

  /**
   * Mount a listener that listens to changes in message collection and updates the state
   */
  useEffect(() => {
    const q = query(collection(firestoreDB, COLLECTION_NAME), orderBy(FILTER_DATETIME), limitToLast(MESSAGES_LIMIT));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setMessages((previousMessages) => [change.doc.data() as MessageType, ...previousMessages]);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Send a new message to the DB
   */
  async function sendMessage(message: string): Promise<void> {
    const newDoc = {
      displayName,
      userId,
      message,
      dateTime: `-${new Date().getTime()}`,
    };

    try {
      await setDoc(doc(firestoreDB, COLLECTION_NAME, uuid()), newDoc);
    } catch (error) {
      console.error('Something went wrong when uploading message ', error);
    }
  }

  /**
   * Gets new messages that are not loaded in yet in batches of 25 and adds to the messages state
   */
  async function getOlderMessages(): Promise<void> {
    if (messages.length < MESSAGES_LIMIT) {
      return;
    }
    const snapshot = await getCountFromServer(collection(firestoreDB, COLLECTION_NAME));
    const messagesToGet = snapshot.data().count > messages.length + MESSAGES_LIMIT
      ? MESSAGES_LIMIT
      : snapshot.data().count - messages.length;

    if (messagesToGet === 0) {
      return;
    }

    const olderMessages: MessageType[] = [];

    const batch = query(collection(firestoreDB, COLLECTION_NAME),
      orderBy(FILTER_DATETIME),
      endAt(messages[messages.length - 1].dateTime),
      limitToLast(messagesToGet + 1),
    );

    const querySnapshot = await getDocs(batch);

    querySnapshot.forEach((doc) => {
      if (doc.data().dateTime !== messages[messages.length - 1].dateTime) {
        olderMessages.unshift(doc.data() as MessageType);
      }
    });

    setMessages((previousMessages) => [...previousMessages, ...olderMessages]);
  }

  const api: AppContextType = useMemo((): AppContextType => ({
    displayName,
    userId,
    setDisplayName,
    messages,
    sendMessage,
    getOlderMessages,
  }), [displayName, userId, messages]);

  return (
    <AppContext.Provider value={api}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;