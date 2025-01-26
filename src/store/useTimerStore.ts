import {
  configureStore,
  createSlice,
  Dispatch,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

const storedTimers = localStorage.getItem("timers");
const initialState = {
  timers: storedTimers
    ? (JSON.parse(storedTimers) as Timer[])
    : ([] as Timer[]),
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer) => timer.id !== action.payload
      );
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    updateTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer && timer.isRunning && timer.remainingTime > 0) {
        timer.remainingTime -= 1;
      }
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(
        (timer) => timer.id === action.payload.id
      );
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
  },
});

type RootState = ReturnType<typeof timerSlice.reducer>;

export const store = configureStore({
  reducer: timerSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      (store: MiddlewareAPI<Dispatch, RootState>) => (next) => (action) => {
        const result = next(action);
        const state = store.getState();
        localStorage.setItem("timers", JSON.stringify(state.timers));
        return result;
      }
    ),
});

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) =>
      dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) =>
      dispatch(editTimer({ id, updates })),
  };
};
