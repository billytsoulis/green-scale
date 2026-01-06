"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test: AuthLayout
 * Path: packages/ui/src/components/AuthLayout/AuthLayout.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthLayout } from "./AuthLayout";
import "@testing-library/jest-dom"; 

/**
 * @ts-ignore
 */
describe("AuthLayout Component", () => {
  /**
   * @ts-ignore
   */
  it("renders the title and description correctly", () => {
    /**
     * @ts-ignore
     */
    render(
      <AuthLayout title="Test Title" description="Test Description">
        <div data-testid="child">Child Content</div>
      </AuthLayout>
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    /**
     * @ts-ignore
     */
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("renders the footer when provided", () => {
    /**
     * @ts-ignore
     */
    render(
      <AuthLayout title="T" description="D" footer={<span>Footer Link</span>}>
        Content
      </AuthLayout>
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Footer Link/i)).toBeInTheDocument();
  });
});