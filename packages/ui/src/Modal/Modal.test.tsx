"use client";

/** @vitest-environment jsdom */
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

/**
 * GreenScale UI Unit Test: Modal
 * Path: packages/ui/src/components/Modal/Modal.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";
import "@testing-library/jest-dom"; 

/**
 * @ts-ignore
 */
describe("Modal Component", () => {
  /**
   * @ts-ignore
   */
  it("does not render when isOpen is false", () => {
    /**
     * @ts-ignore
     */
    const { queryByText } = render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    /**
     * @ts-ignore
     */
    expect(queryByText(/Modal Content/i)).not.toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("renders content and title when isOpen is true", () => {
    /**
     * @ts-ignore
     */
    render(
      <Modal isOpen={true} onClose={() => {}} title="Audit Results">
        Analysis Complete
      </Modal>
    );
    
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Audit Results/i)).toBeInTheDocument();
    /**
     * @ts-ignore
     */
    expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
  });

  /**
   * @ts-ignore
   */
  it("calls onClose when the close button is clicked", () => {
    /**
     * @ts-ignore
     */
    const handleClose = vi.fn();
    /**
     * @ts-ignore
     */
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    /**
     * @ts-ignore
     */
    const closeButton = screen.getByLabelText(/Close modal/i);
    /**
     * @ts-ignore
     */
    fireEvent.click(closeButton);
    
    /**
     * @ts-ignore
     */
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  /**
   * @ts-ignore
   */
  it("applies the correct size class for small modals", () => {
    /**
     * @ts-ignore
     */
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Small Content
      </Modal>
    );
    
    // The modal container is the second child of the root div (after backdrop)
    const modalContainer = container.querySelector('.max-w-md');
    /**
     * @ts-ignore
     */
    expect(modalContainer).toBeInTheDocument();
  });
});