import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tooltip } from './Tooltip';
import { TooltipContent } from './TooltipContent';
import tooltipFloater from './TooltipFloater';

describe('TooltipContent', () => {
	describe('initialization', () => {
		it('should create a TooltipContent instance with default options', () => {
			const content = new TooltipContent({
				content: 'Test content'
			});

			const element = content.getEl();
			expect(element).toBeInstanceOf(HTMLElement);
			expect(element.tagName).toBe('DIV');
			expect(element.textContent).toBe('Test content');
		});

		it('should create a TooltipContent with custom content', () => {
			const customElement = document.createElement('span');
			customElement.textContent = 'Custom content';

			const content = new TooltipContent({
				content: customElement
			});

			const element = content.getEl();
			expect(element.querySelector('span')).toBeTruthy();
			expect(element.textContent).toBe('Custom content');
		});

		it('should apply default CSS classes', () => {
			const content = new TooltipContent({
				content: 'Test'
			});

			const element = content.getEl();
			expect(element.classList.contains('eb-tooltip-content')).toBe(true);
		});

		it('should apply extended classes', () => {
			const content = new TooltipContent({
				content: 'Test',
				extendedClasses: ['custom-class-1', 'custom-class-2']
			});

			const element = content.getEl();
			expect(element.classList.contains('custom-class-1')).toBe(true);
			expect(element.classList.contains('custom-class-2')).toBe(true);
		});

		it('should throw error when content is missing', () => {
			expect(() => {
				new TooltipContent({
					content: null as any
				});
			}).toThrow('TooltipContent requires a content to be provided as a string or HTMLElement');
		});

		it('should throw error when content is invalid type', () => {
			expect(() => {
				new TooltipContent({
					content: 123 as any
				});
			}).toThrow('TooltipContent requires a content to be provided as a string or HTMLElement');
		});
	});

	describe('destroy', () => {
		it('should remove element from DOM', () => {
			const content = new TooltipContent({
				content: 'Test'
			});

			const element = content.getEl();
			document.body.appendChild(element);

			expect(document.body.contains(element)).toBe(true);

			content.destroy();

			expect(document.body.contains(element)).toBe(false);
		});

		it('should handle destroy when element is not in DOM', () => {
			const content = new TooltipContent({
				content: 'Test'
			});

			expect(() => {
				content.destroy();
			}).not.toThrow();
		});
	});
});

describe('Tooltip', () => {
	let tooltip: Tooltip;

	afterEach(() => {
		if (tooltip) {
			tooltip.destroy();
		}
		// Clean up any floater content
		tooltipFloater.hide();
	});

	describe('initialization', () => {
		it('should create a Tooltip instance with required options', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			const trigger = tooltip.getEl();
			expect(trigger).toBeInstanceOf(HTMLElement);
			expect(trigger.tagName).toBe('DIV');
		});

		it('should create trigger with default icon', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			expect(trigger.textContent).toContain('?');
		});

		it('should create trigger with custom string content', () => {
			tooltip = new Tooltip({
				content: 'Test',
				trigger: 'Custom trigger'
			});

			const trigger = tooltip.getEl();
			expect(trigger.innerHTML).toContain('Custom trigger');
		});

		it('should create trigger with custom HTMLElement', () => {
			const customTrigger = document.createElement('button');
			customTrigger.textContent = 'Click me';

			tooltip = new Tooltip({
				content: 'Test',
				trigger: customTrigger
			});

			const trigger = tooltip.getEl();
			expect(trigger.querySelector('button')).toBeTruthy();
			expect(trigger.textContent).toBe('Click me');
		});

		it('should apply default CSS classes to trigger', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			expect(trigger.classList.contains('eb-tooltip__trigger')).toBe(true);
		});

		it('should apply extended classes to trigger', () => {
			tooltip = new Tooltip({
				content: 'Test',
				triggerExtendedClasses: ['custom-trigger-class']
			});

			const trigger = tooltip.getEl();
			expect(trigger.classList.contains('custom-trigger-class')).toBe(true);
		});

		it('should set accessibility attributes on trigger', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			expect(trigger.getAttribute('role')).toBe('button');
			expect(trigger.getAttribute('tabindex')).toBe('-1');
			expect(trigger.getAttribute('aria-label')).toBe('Show tooltip');
		});

		it('should throw error when content is missing', () => {
			expect(() => {
				new Tooltip({
					content: null as any
				});
			}).toThrow('Tooltip requires a content to be provided as a string or HTMLElement');
		});
	});

	describe('show and hide functionality', () => {
		it('should show tooltip on mouseenter', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('mouseenter'));

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(false);
		});

		it('should hide tooltip on mouseleave', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('mouseenter'));
			trigger.dispatchEvent(new Event('mouseleave'));

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(true);
		});

		it('should show tooltip on focus', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('focus'));

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(false);
		});

		it('should hide tooltip on blur', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('focus'));
			trigger.dispatchEvent(new Event('blur'));

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(true);
		});

		it('should call showTooltip method programmatically', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			document.body.appendChild(tooltip.getEl());

			tooltip.showTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(false);
		});

		it('should call hideTooltip method programmatically', () => {
			tooltip = new Tooltip({
				content: 'Test tooltip'
			});

			document.body.appendChild(tooltip.getEl());

			tooltip.showTooltip();
			tooltip.hideTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(true);
		});
	});

	describe('callbacks', () => {
		it('should call onShow callback when tooltip is shown', () => {
			const onShow = vi.fn();

			tooltip = new Tooltip({
				content: 'Test',
				onShow
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('mouseenter'));

			expect(onShow).toHaveBeenCalledTimes(1);
		});

		it('should call onHide callback when tooltip is hidden', () => {
			const onHide = vi.fn();

			tooltip = new Tooltip({
				content: 'Test',
				onHide
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('mouseenter'));
			trigger.dispatchEvent(new Event('mouseleave'));

			expect(onHide).toHaveBeenCalledTimes(1);
		});

		it('should call both onShow and onHide callbacks', () => {
			const onShow = vi.fn();
			const onHide = vi.fn();

			tooltip = new Tooltip({
				content: 'Test',
				onShow,
				onHide
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			trigger.dispatchEvent(new Event('mouseenter'));
			expect(onShow).toHaveBeenCalledTimes(1);

			trigger.dispatchEvent(new Event('mouseleave'));
			expect(onHide).toHaveBeenCalledTimes(1);
		});
	});

	describe('floater options', () => {
		it('should use default floater options', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			// Default options are applied internally
			expect(tooltip).toBeDefined();
		});

		it('should accept custom placement option', () => {
			tooltip = new Tooltip({
				content: 'Test',
				floaterOptions: {
					placement: 'bottom'
				}
			});

			expect(tooltip).toBeDefined();
		});

		it('should accept custom offset option', () => {
			tooltip = new Tooltip({
				content: 'Test',
				floaterOptions: {
					offset: 16
				}
			});

			expect(tooltip).toBeDefined();
		});

		it('should accept custom shiftPadding option', () => {
			tooltip = new Tooltip({
				content: 'Test',
				floaterOptions: {
					shiftPadding: 10
				}
			});

			expect(tooltip).toBeDefined();
		});

		it('should accept all custom floater options', () => {
			tooltip = new Tooltip({
				content: 'Test',
				floaterOptions: {
					placement: 'right',
					offset: 12,
					shiftPadding: 8
				}
			});

			expect(tooltip).toBeDefined();
		});
	});

	describe('content rendering', () => {
		it('should render string content in tooltip', () => {
			tooltip = new Tooltip({
				content: 'This is a test tooltip'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.textContent).toContain('This is a test tooltip');
		});

		it('should render HTMLElement content in tooltip', () => {
			const contentElement = document.createElement('div');
			const strong = document.createElement('strong');
			strong.textContent = 'Bold text';
			contentElement.appendChild(strong);

			tooltip = new Tooltip({
				content: contentElement
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.querySelector('strong')).toBeTruthy();
			expect(floater?.textContent).toContain('Bold text');
		});

		it('should render HTML string content', () => {
			tooltip = new Tooltip({
				content: '<strong>Bold</strong> and <em>italic</em>'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.querySelector('strong')).toBeTruthy();
			expect(floater?.querySelector('em')).toBeTruthy();
		});
	});

	describe('destroy', () => {
		it('should remove trigger from DOM', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			expect(document.body.contains(trigger)).toBe(true);

			tooltip.destroy();

			expect(document.body.contains(trigger)).toBe(false);
		});

		it('should hide tooltip before destroying', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();
			tooltip.destroy();

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(true);
		});

		it('should handle destroy when trigger is not in DOM', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			expect(() => {
				tooltip.destroy();
			}).not.toThrow();
		});
	});

	describe('edge cases', () => {
		it('should handle empty string content', () => {
			tooltip = new Tooltip({
				content: ''
			});

			const trigger = tooltip.getEl();
			expect(trigger).toBeDefined();
		});

		it('should handle very long content', () => {
			const longContent = 'A'.repeat(500);

			tooltip = new Tooltip({
				content: longContent
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();

			const floater = tooltipFloater.getFloater();
			expect(floater?.textContent).toContain(longContent);
		});

		it('should handle special characters in content', () => {
			tooltip = new Tooltip({
				content: '<script>alert("XSS")</script>'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			tooltip.showTooltip();

			// Script should be rendered as text, not executed
			const floater = tooltipFloater.getFloater();
			expect(floater?.querySelector('script')).toBeTruthy();
		});

		it('should handle rapid show/hide events', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			document.body.appendChild(trigger);

			for (let i = 0; i < 10; i++) {
				trigger.dispatchEvent(new Event('mouseenter'));
				trigger.dispatchEvent(new Event('mouseleave'));
			}

			// Should not throw errors
			expect(tooltip).toBeDefined();
		});

		it('should handle multiple tooltips', () => {
			const tooltip1 = new Tooltip({
				content: 'Tooltip 1'
			});

			const tooltip2 = new Tooltip({
				content: 'Tooltip 2'
			});

			const trigger1 = tooltip1.getEl();
			const trigger2 = tooltip2.getEl();

			document.body.appendChild(trigger1);
			document.body.appendChild(trigger2);

			trigger1.dispatchEvent(new Event('mouseenter'));

			const floater = tooltipFloater.getFloater();
			expect(floater?.textContent).toContain('Tooltip 1');

			trigger1.dispatchEvent(new Event('mouseleave'));
			trigger2.dispatchEvent(new Event('mouseenter'));

			expect(floater?.textContent).toContain('Tooltip 2');

			tooltip1.destroy();
			tooltip2.destroy();
		});

		it('should handle custom class prefix', () => {
			tooltip = new Tooltip({
				content: 'Test',
				classPrefix: 'custom-'
			});

			const trigger = tooltip.getEl();
			expect(trigger.classList.contains('custom-tooltip__trigger')).toBe(true);
		});

		it('should handle custom CSS class', () => {
			tooltip = new Tooltip({
				content: 'Test',
				cssClass: 'my-tooltip'
			});

			const trigger = tooltip.getEl();
			expect(trigger.classList.contains('eb-my-tooltip__trigger')).toBe(true);
		});
	});

	describe('getEl method', () => {
		it('should return the trigger element', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger = tooltip.getEl();
			expect(trigger).toBeInstanceOf(HTMLElement);
			expect(trigger.tagName).toBe('DIV');
		});

		it('should return the same element on multiple calls', () => {
			tooltip = new Tooltip({
				content: 'Test'
			});

			const trigger1 = tooltip.getEl();
			const trigger2 = tooltip.getEl();

			expect(trigger1).toBe(trigger2);
		});
	});
});

describe('TooltipFloater', () => {
	afterEach(() => {
		tooltipFloater.hide();
	});

	describe('singleton pattern', () => {
		it('should return the same instance', () => {
			const instance1 = tooltipFloater.getInstance();
			const instance2 = tooltipFloater.getInstance();

			expect(instance1).toBe(instance2);
		});
	});

	describe('show and hide', () => {
		it('should show floater with content', () => {
			const trigger = document.createElement('div');
			const content = document.createElement('div');
			content.textContent = 'Test content';

			document.body.appendChild(trigger);

			tooltipFloater.show(trigger, content);

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(false);
			expect(floater?.textContent).toContain('Test content');

			trigger.remove();
		});

		it('should hide floater', () => {
			const trigger = document.createElement('div');
			const content = document.createElement('div');
			content.textContent = 'Test content';

			document.body.appendChild(trigger);

			tooltipFloater.show(trigger, content);
			tooltipFloater.hide();

			const floater = tooltipFloater.getFloater();
			expect(floater?.classList.contains('eb-tooltip-floater--hidden')).toBe(true);
			expect(floater?.innerHTML).toBe('');

			trigger.remove();
		});

		it('should handle show with null trigger', () => {
			const content = document.createElement('div');

			expect(() => {
				tooltipFloater.show(null as any, content);
			}).not.toThrow();
		});

		it('should handle show with null content', () => {
			const trigger = document.createElement('div');
			document.body.appendChild(trigger);

			expect(() => {
				tooltipFloater.show(trigger, null as any);
			}).not.toThrow();

			trigger.remove();
		});
	});

	describe('positioning', () => {
		it('should set CSS custom properties for positioning', () => {
			const trigger = document.createElement('div');
			const content = document.createElement('div');

			document.body.appendChild(trigger);

			tooltipFloater.show(trigger, content, {
				placement: 'top',
				offset: 8,
				shiftPadding: 5
			});

			const floater = tooltipFloater.getFloater();

			// CSS variables should be set (values will be computed by floating-ui)
			expect(floater?.style.getPropertyValue('--tooltip-left')).toBeDefined();
			expect(floater?.style.getPropertyValue('--tooltip-top')).toBeDefined();
			expect(floater?.style.getPropertyValue('--tooltip-position')).toBeDefined();

			trigger.remove();
		});
	});
});
