"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test: Input
 * Path: packages/ui/src/components/Input/Input.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";
import "@testing-library/jest-dom"; 

/**
 * @ts-ignore
 */
describe("Input Component", () => {
  /**
   * @ts-ignore
   */
  it("renders with a label and placeholder", () => {
    /**
     * @ts-ignore
     */
    render(
      <Input 
        label="Email Address" 
        placeholder="name@company.com" 
      />
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    /**
     * @ts-ignore
     */
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("displays error messages with the correct red styling", () => {
    /**
     * @ts-ignore
     */
    render(<Input error="Invalid email" />);
    
    /**
     * @ts-ignore
     */
    const errorMessage = screen.getByText(/Invalid email/i);
    /**
     * @ts-ignore
     */
    expect(errorMessage).toHaveClass("text-red-500");
  });

  /**
   * @ts-ignore
   */
  it("calls onChange when the user types", () => {
    /**
     * @ts-ignore
     */
    const handleChange = vi.fn();
    /**
     * @ts-ignore
     */
    render(<Input onChange={handleChange} placeholder="Type here" />);
    
    /**
     * @ts-ignore
     */
    const input = screen.getByPlaceholderText(/Type here/i);
    /**
     * @ts-ignore
     */
    fireEvent.change(input, { target: { value: "test@greenscale.com" } });
    
    /**
     * @ts-ignore
     */
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  /**
   * @ts-ignore
   */
  it("disables the input when the disabled prop is true", () => {
    /**
     * @ts-ignore
     */
    render(<Input disabled placeholder="Locked" />);
    
    /**
     * @ts-ignore
     */
    const input = screen.getByPlaceholderText(/Locked/i);
    /**
     * @ts-ignore
     */
    expect(input).toBeDisabled();
  });
});