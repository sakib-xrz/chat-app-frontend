import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedThread: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedThread: (state, action) => {
      state.selectedThread = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setSelectedThread, setMessages } = chatSlice.actions;

export default chatSlice.reducer;

export const getMessages = (state) => state.chat.messages;
