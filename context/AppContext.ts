import React, { createContext } from 'react';

export type MessageType = {
  dateTime: number
  message: string
  userId: string
  displayName: string
};

export type AppContextType = {
  displayName: string
  userId: string
  setDisplayName: React.Dispatch<React.SetStateAction<string>>
  messages: MessageType[]
  sendMessage: (message: string) => Promise<void>
  getOlderMessages: () => Promise<void>
}

const AppContext = createContext<AppContextType>({
  displayName: '',
  userId: '',
  messages: [],
  sendMessage: async () => { },
  setDisplayName: () => { },
  getOlderMessages: async () => { }
});

export default AppContext;
