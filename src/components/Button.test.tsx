/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

describe("Button Components", () => {
  it("renders primary button", () => {
    render(<PrimaryButton>Submit</PrimaryButton>);
    const button = screen.getByText("Submit");
    expect(button).toBeInTheDocument();
  });

  it("renders secondary button", () => {
    render(<SecondaryButton>Cancel</SecondaryButton>);
    const button = screen.getByText("Cancel");
    expect(button).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<PrimaryButton disabled>Submit</PrimaryButton>);
    const button = screen.getByText("Submit");
    expect(button).toBeDisabled();
  });
});
