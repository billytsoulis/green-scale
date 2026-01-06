"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test: Badge
 * Path: packages/ui/src/components/Badge/Badge.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";
import "@testing-library/jest-dom"; 

/**
 * @ts-ignore
 */
describe("Badge Component", () => {
  /**
   * @ts-ignore
   */
  it("renders with the provided child content", () => {
    /**
     * @ts-ignore
     */
    render(<Badge>Verified</Badge>);
    
    /**
     * @ts-ignore
     */
    const badgeElement = screen.getByText(/Verified/i);
    /**
     * @ts-ignore
     */
    expect(badgeElement).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("renders a status dot when showDot is true", () => {
    /**
     * @ts-ignore
     */
    const { container } = render(<Badge showDot>Status</Badge>);
    
    // Check for the presence of a span with the width/height of our dot
    const dot = container.querySelector('.w-1\\.5');
    /**
     * @ts-ignore
     */
    expect(dot).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("applies the pulse animation class when animate is true", () => {
    /**
     * @ts-ignore
     */
    const { container } = render(<Badge showDot animate>Critical</Badge>);
    
    const dot = container.querySelector('.animate-pulse');
    /**
     * @ts-ignore
     */
    expect(dot).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("applies the correct CSS classes for the gold variant", () => {
    /**
     * @ts-ignore
     */
    render(<Badge variant="gold">Premium</Badge>);
    
    /**
     * @ts-ignore
     */
    const badgeElement = screen.getByText(/Premium/i);
    /**
     * @ts-ignore
     */
    expect(badgeElement).toHaveClass("bg-brand-gold-50");
  });
});