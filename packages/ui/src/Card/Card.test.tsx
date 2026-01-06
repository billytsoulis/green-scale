"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test: Card
 * Path: packages/ui/src/components/Card/Card.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";
import "@testing-library/jest-dom"; 

/**
 * @ts-ignore
 */
describe("Card Component", () => {
  /**
   * @ts-ignore
   */
  it("renders title and children correctly", () => {
    /**
     * @ts-ignore
     */
    render(
      <Card title="Total AUM">
        <span data-testid="child-content">€4.2B</span>
      </Card>
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Total AUM/i)).toBeInTheDocument();
    /**
     * @ts-ignore
     */
    expect(screen.getByTestId("child-content")).toHaveTextContent("€4.2B");
  });

  /**
   * @ts-ignore
   */
  it("renders footer content when provided", () => {
    /**
     * @ts-ignore
     */
    render(
      <Card footer={<div data-testid="footer-node">View Details</div>}>
        Content
      </Card>
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByTestId("footer-node")).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("applies elevated shadow classes by default", () => {
    /**
     * @ts-ignore
     */
    const { container } = render(<Card>Shadow Test</Card>);
    const cardElement = container.firstChild;
    
    /**
     * @ts-ignore
     */
    expect(cardElement).toHaveClass("shadow-[0_10px_40px_-15px_rgba(6,95,70,0.08)]");
  });

  /**
   * @ts-ignore
   */
  it("switches to outline variant styles", () => {
    /**
     * @ts-ignore
     */
    const { container } = render(<Card variant="outline">Outline Test</Card>);
    const cardElement = container.firstChild;
    
    /**
     * @ts-ignore
     */
    expect(cardElement).toHaveClass("bg-transparent");
    /**
     * @ts-ignore
     */
    expect(cardElement).toHaveClass("border-slate-200");
  });
});