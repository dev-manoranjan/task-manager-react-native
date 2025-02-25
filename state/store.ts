import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import slices here
import authSlice from "./slices/auth";

// import services here
import { authService } from "./services/auth";
import { taskService } from "./services/tasks";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [authService.reducerPath]: authService.reducer,
  [taskService.reducerPath]: taskService.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(authService.middleware, taskService.middleware),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
