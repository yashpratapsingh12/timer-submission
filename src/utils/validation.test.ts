import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateTimerForm } from "./validation";

vi.mock("sonner");

describe("Timer Form Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates title length", () => {
    const result = validateTimerForm({
      title: "",
      description: "",
      hours: 1,
      minutes: 0,
      seconds: 0,
    });
    expect(result).toBe(false);
  });

  it("validates duration", () => {
    const result = validateTimerForm({
      title: "Test",
      description: "",
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(result).toBe(false);
  });

  it("passes valid data", () => {
    const result = validateTimerForm({
      title: "Test Timer",
      description: "",
      hours: 1,
      minutes: 30,
      seconds: 0,
    });
    expect(result).toBe(true);
  });
});
