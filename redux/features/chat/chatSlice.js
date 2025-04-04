import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRoom: null,
  activeUsers: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    updateActiveUsers: (state, action) => {
      const { roomId, users } = action.payload;
      state.activeUsers[roomId] = users;
    },
  },
});

export const { setCurrentRoom, clearCurrentRoom, updateActiveUsers } =
  chatSlice.actions;
export default chatSlice.reducer;
