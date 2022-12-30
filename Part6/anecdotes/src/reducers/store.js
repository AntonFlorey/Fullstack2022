import anecdoteReducer from "./anecdoteReducer"
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer
  }
})

export default store