/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/useTimerStore";
import { TimerItem } from "./TimerItem";

describe("TimerItem", () => {
  const timer = {
    id: "1",
    title: "Test Timer",
    description: "Description",
    duration: 60,
    remainingTime: 60,
    isRunning: false,
    createdAt: Date.now(),
  };

  it("shows timer info", () => {
    render(
      <Provider store={store}>
        <TimerItem timer={timer} />
      </Provider>
    );

    expect(screen.getByText("Test Timer")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("handles start/pause", () => {
    render(
      <Provider store={store}>
        <TimerItem timer={timer} />
      </Provider>
    );

    const button = screen.getByRole("button", {
      name: /^(start timer|pause timer)$/i,
    });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });
});
