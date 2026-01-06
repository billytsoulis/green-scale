"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test
 * Path: packages/ui/src/button.test.tsx
 * * GEM RULE: Imports are commented to prevent preview compiler errors.
 * Logic: This file relies on the global 'expect.extend' configured in 
 * packages/ui/src/test/setup.ts to provide 'toBeInTheDocument' and 'toHaveClass'.
 */

/*
*/
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

/**
 * @ts-ignore - describe is provided globally by Vitest
 */
describe("Button Component", () => {
  /**
   * @ts-ignore - it is provided globally
   */
  it("renders with the correct label text", () => {
    /**
     * @ts-ignore - render and Button are commented for preview safety
     */
    render(<Button>Alpha Test</Button>);
    
    /**
     * @ts-ignore - Using getByText is safer than getByRole when multiple buttons exist in JSDOM
     */
    const buttonElement = screen.getByText(/Alpha Test/i);
    
    /**
     * @ts-ignore - toBeInTheDocument comes from jest-dom matchers in setup.ts
     */
    expect(buttonElement).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("applies the primary brand color by default", () => {
    /**
     * @ts-ignore
     */
    render(<Button>Primary Action</Button>);
    
    /**
     * @ts-ignore
     */
    const buttonElement = screen.getByText(/Primary Action/i);
    
    /**
     * @ts-ignore - #065f46 is our brand-emerald-800 defined in theme.css
     */
    expect(buttonElement).toHaveClass("bg-[#065f46]");
  });

  /**
   * @ts-ignore
   */
  it("applies secondary styles when the variant prop is passed", () => {
    /**
     * @ts-ignore
     */
    render(<Button variant="secondary">Gold Action</Button>);
    
    /**
     * @ts-ignore
     */
    const buttonElement = screen.getByText(/Gold Action/i);
    
    /**
     * @ts-ignore - #f59e0b is our brand-gold-500
     */
    expect(buttonElement).toHaveClass("bg-[#f59e0b]");
  });
});