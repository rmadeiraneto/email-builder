/**
 * AI Agent Testing Demonstration
 *
 * This file demonstrates how an AI agent would actually use the testing infrastructure
 * to discover, interact with, and verify the email builder components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import {
  getAllTestIds,
  getAllActions,
  getByTestId,
  getByAction,
  debugTestAttributes
} from '../test-utils';
import { Button } from '../atoms/Button/Button';
import { Input } from '../atoms/Input/Input';
import { Label } from '../atoms/Label/Label';
import { Icon } from '../atoms/Icon/Icon';

describe('AI Agent Capabilities Demo', () => {
  describe('Discovery: AI finds all testable elements', () => {
    it('should discover all test IDs in a form', () => {
      render(() => (
        <div>
          <Label testId="email-label" htmlFor="email">Email</Label>
          <Input testId="email-input" type="email" id="email" />
          <Button testId="submit-button" action="submit-form" type="submit">
            Submit
          </Button>
        </div>
      ));

      // AI agent discovers what's available
      const testIds = getAllTestIds();

      console.log('🤖 AI Agent discovered test IDs:', testIds);

      expect(testIds).toContain('email-label');
      expect(testIds).toContain('email-input');
      expect(testIds).toContain('submit-button');
      expect(testIds.length).toBe(3);
    });

    it('should discover all actions available', () => {
      render(() => (
        <div>
          <Button action="save-template">Save</Button>
          <Button action="export-html">Export</Button>
          <Button action="preview-template">Preview</Button>
        </div>
      ));

      // AI agent finds all possible actions
      const actions = getAllActions();

      console.log('🤖 AI Agent discovered actions:', actions);

      expect(actions).toContain('save-template');
      expect(actions).toContain('export-html');
      expect(actions).toContain('preview-template');
    });

    it('should use debug utility to see all test attributes', () => {
      render(() => (
        <div>
          <Button testId="btn-1" action="click-me">Click</Button>
          <Input testId="input-1" placeholder="Type here" />
        </div>
      ));

      // AI agent uses debug utility
      console.log('🤖 AI Agent debugging test attributes:');
      debugTestAttributes();

      // This would log:
      // === Test IDs ===
      // ['btn-1', 'input-1']
      // === Actions ===
      // ['click-me']
    });
  });

  describe('Interaction: AI interacts with elements', () => {
    it('should find element by testId and click it', () => {
      const handleClick = vi.fn();

      render(() => (
        <Button testId="ai-button" onClick={handleClick}>
          AI Click Me
        </Button>
      ));

      // AI agent: "Find element with testId='ai-button'"
      const button = getByTestId(document.body, 'ai-button');
      expect(button).toBeInTheDocument();

      // AI agent: "Click the button"
      button.click();

      // AI agent: "Verify click was registered"
      expect(handleClick).toHaveBeenCalledTimes(1);

      console.log('✅ AI Agent successfully clicked button');
    });

    it('should find element by action and interact', () => {
      const handleClick = vi.fn();

      render(() => (
        <Button action="save-template" onClick={handleClick}>
          Save
        </Button>
      ));

      // AI agent: "Find element with action='save-template'"
      const saveButton = getByAction(document.body, 'save-template');
      expect(saveButton).toBeInTheDocument();

      // AI agent: "Click it"
      saveButton.click();

      expect(handleClick).toHaveBeenCalled();
      console.log('✅ AI Agent successfully used action attribute');
    });

    it('should type into input using testId', () => {
      const handleInput = vi.fn();

      render(() => (
        <Input
          testId="ai-input"
          placeholder="Enter email"
          onInput={handleInput}
        />
      ));

      // AI agent: "Find input with testId='ai-input'"
      const input = getByTestId(document.body, 'ai-input') as HTMLInputElement;

      // AI agent: "Type 'test@example.com' into it"
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // AI agent: "Verify the value"
      expect(input.value).toBe('test@example.com');
      expect(handleInput).toHaveBeenCalled();

      console.log('✅ AI Agent successfully typed into input');
    });
  });

  describe('Verification: AI verifies states and attributes', () => {
    it('should verify button is disabled', () => {
      render(() => (
        <Button testId="disabled-btn" disabled>
          Disabled
        </Button>
      ));

      // AI agent: "Find button and check if disabled"
      const button = getByTestId(document.body, 'disabled-btn') as HTMLButtonElement;

      expect(button.disabled).toBe(true);
      expect(button).toHaveAttribute('aria-disabled', 'true');

      console.log('✅ AI Agent verified button is disabled');
    });

    it('should verify accessibility attributes', () => {
      render(() => (
        <div>
          <Label testId="username-label" htmlFor="username" required>
            Username
          </Label>
          <Input
            testId="username-input"
            id="username"
            required
            ariaLabel="Enter your username"
          />
        </div>
      ));

      // AI agent verifies label has correct attributes
      const label = getByTestId(document.body, 'username-label');
      expect(label).toHaveAttribute('for', 'username');

      // AI agent verifies input is accessible
      const input = getByTestId(document.body, 'username-input');
      expect(input).toHaveAttribute('aria-label', 'Enter your username');
      expect(input).toHaveAttribute('aria-required', 'true');

      console.log('✅ AI Agent verified accessibility attributes');
    });

    it('should verify icon properties', () => {
      render(() => (
        <Icon
          testId="save-icon"
          name="save"
          size="large"
          color="#ff0000"
          ariaLabel="Save icon"
        />
      ));

      // AI agent verifies icon
      const icon = getByTestId(document.body, 'save-icon') as HTMLElement;

      expect(icon.className).toContain('ri-save');
      expect(icon).toHaveAttribute('aria-label', 'Save icon');
      expect(icon).toHaveAttribute('role', 'img');

      const styles = window.getComputedStyle(icon);
      expect(styles.fontSize).toBe('32px'); // large = 32px
      expect(styles.color).toBe('rgb(255, 0, 0)'); // #ff0000

      console.log('✅ AI Agent verified icon properties');
    });
  });

  describe('Complete Workflow: AI performs multi-step tasks', () => {
    it('should complete a form submission workflow', async () => {
      const handleSubmit = vi.fn();

      render(() => (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Label testId="email-label" htmlFor="email">Email</Label>
          <Input testId="email-input" type="email" id="email" />

          <Label testId="password-label" htmlFor="password">Password</Label>
          <Input testId="password-input" type="password" id="password" />

          <Button testId="submit-btn" action="submit-form" type="submit">
            Submit
          </Button>
        </form>
      ));

      console.log('🤖 AI Agent starting form submission workflow...');

      // Step 1: AI discovers the form fields
      const testIds = getAllTestIds();
      console.log('   Step 1: Discovered fields:', testIds);
      expect(testIds).toContain('email-input');
      expect(testIds).toContain('password-input');

      // Step 2: AI fills in email
      const emailInput = getByTestId(document.body, 'email-input') as HTMLInputElement;
      emailInput.value = 'ai@example.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('   Step 2: Filled email:', emailInput.value);

      // Step 3: AI fills in password
      const passwordInput = getByTestId(document.body, 'password-input') as HTMLInputElement;
      passwordInput.value = 'secure-password-123';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('   Step 3: Filled password: ********');

      // Step 4: AI verifies form is ready
      expect(emailInput.value).toBe('ai@example.com');
      expect(passwordInput.value).toBe('secure-password-123');
      console.log('   Step 4: Verified form data');

      // Step 5: AI clicks submit
      const submitButton = getByAction(document.body, 'submit-form');
      submitButton.click();
      console.log('   Step 5: Clicked submit button');

      // Step 6: AI verifies submission
      expect(handleSubmit).toHaveBeenCalled();
      console.log('✅ AI Agent completed form submission workflow');
    });

    it('should handle conditional UI based on state', () => {
      const { unmount } = render(() => (
        <Button testId="save-btn" action="save-template" disabled>
          Save (Disabled)
        </Button>
      ));

      console.log('🤖 AI Agent testing conditional states...');

      // AI checks initial state
      let button = getByTestId(document.body, 'save-btn') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      console.log('   Initial state: Button is disabled');

      unmount();

      // Render with different state
      render(() => (
        <Button testId="save-btn" action="save-template">
          Save (Enabled)
        </Button>
      ));

      // AI checks new state
      button = getByTestId(document.body, 'save-btn') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
      console.log('   New state: Button is enabled');
      console.log('✅ AI Agent handled conditional UI states');
    });
  });

  describe('Error Handling: AI handles edge cases', () => {
    it('should gracefully handle missing elements', () => {
      render(() => <div>Empty container</div>);

      // AI tries to find non-existent element
      const element = document.querySelector('[data-testid="non-existent"]');
      expect(element).toBeNull();

      console.log('✅ AI Agent handled missing element gracefully');
    });

    it('should work with multiple identical actions', () => {
      render(() => (
        <div>
          <Button testId="btn-1" action="delete">Delete Item 1</Button>
          <Button testId="btn-2" action="delete">Delete Item 2</Button>
          <Button testId="btn-3" action="delete">Delete Item 3</Button>
        </div>
      ));

      // AI finds all delete buttons
      const deleteButtons = document.querySelectorAll('[data-action="delete"]');
      expect(deleteButtons.length).toBe(3);

      // AI can target specific one by testId
      const specificButton = getByTestId(document.body, 'btn-2');
      expect(specificButton.textContent).toContain('Delete Item 2');

      console.log('✅ AI Agent handled multiple identical actions');
    });
  });

  describe('Performance: AI measures interaction speed', () => {
    it('should quickly find elements by testId', () => {
      render(() => (
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Button key={i} testId={`btn-${i}`}>Button {i}</Button>
          ))}
        </div>
      ));

      const startTime = performance.now();

      // AI finds specific button among 100
      const button = getByTestId(document.body, 'btn-50');

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain('Button 50');

      console.log(`✅ AI Agent found element in ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });
});
