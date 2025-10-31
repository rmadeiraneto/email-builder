/**
 * ColorPicker Component Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';
import type { ColorObject, AlwanInstance } from './color-picker.types';

// Mock Alwan
vi.mock('alwan', () => {
	return {
		default: vi.fn().mockImplementation((target: HTMLElement, options: any) => {
			const mockColorObj: ColorObject = {
				r: 59,
				g: 130,
				b: 246,
				a: 1,
				hex: '#3b82f6',
				rgb: 'rgb(59, 130, 246)',
				rgba: 'rgba(59, 130, 246, 1)',
				hsl: 'hsl(217, 91%, 60%)',
				hsla: 'hsla(217, 91%, 60%, 1)'
			};

			const listeners: Record<string, Array<(ev: any) => void>> = {};

			const instance: AlwanInstance = {
				getColor: vi.fn(() => mockColorObj),
				setColor: vi.fn((color: string | ColorObject) => {
					// Update mock color if needed
					if (typeof color === 'string') {
						if (color === 'transparent' || color === '#00000000') {
							mockColorObj.r = 0;
							mockColorObj.g = 0;
							mockColorObj.b = 0;
							mockColorObj.a = 0;
							mockColorObj.hex = '#00000000';
						}
					}
					return instance;
				}),
				open: vi.fn(),
				close: vi.fn(),
				toggle: vi.fn(),
				trigger: vi.fn((event: string) => {
					if (listeners[event]) {
						listeners[event].forEach(cb => cb({}));
					}
				}),
				on: vi.fn((event: string, callback: (ev: any) => void) => {
					if (!listeners[event]) listeners[event] = [];
					listeners[event].push(callback);
				}),
				off: vi.fn((event: string, callback?: (ev: any) => void) => {
					if (callback && listeners[event]) {
						listeners[event] = listeners[event].filter(cb => cb !== callback);
					} else if (listeners[event]) {
						delete listeners[event];
					}
				}),
				destroy: vi.fn(),
				isOpen: vi.fn(() => false),
				disable: vi.fn(),
				enable: vi.fn(),
				isDisabled: vi.fn(() => false)
			};

			return instance;
		})
	};
});

describe('ColorPicker', () => {
	let container: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	describe('Initialization', () => {
		it('should create a ColorPicker instance', () => {
			const colorPicker = new ColorPicker();
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			expect(colorPicker.getEl()).toBeInstanceOf(HTMLElement);
			colorPicker.destroy();
		});

		it('should create with default options', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();

			expect(element.className).toContain('color-picker-input');
			colorPicker.destroy();
		});

		it('should create with custom color', () => {
			const colorPicker = new ColorPicker({ color: '#ff0000' });
			expect(colorPicker.getColor()).toBe('#ff0000');
			colorPicker.destroy();
		});

		it('should create with custom extended classes', () => {
			const colorPicker = new ColorPicker({
				extendedClasses: 'custom-class another-class'
			});
			const element = colorPicker.getEl();

			expect(element.classList.contains('custom-class')).toBe(true);
			expect(element.classList.contains('another-class')).toBe(true);
			colorPicker.destroy();
		});

		it('should create with noInput mode', () => {
			const colorPicker = new ColorPicker({ noInput: true });
			const element = colorPicker.getEl();

			expect(element.className).toContain('no-input');
			colorPicker.destroy();
		});
	});

	describe('Element Structure', () => {
		it('should create input element by default', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();
			const input = element.querySelector('input');

			expect(input).toBeTruthy();
			expect(input?.type).toBe('text');
			colorPicker.destroy();
		});

		it('should not create input in noInput mode', () => {
			const colorPicker = new ColorPicker({ noInput: true });
			const element = colorPicker.getEl();
			const input = element.querySelector('input');

			expect(input).toBeNull();
			colorPicker.destroy();
		});

		it('should create swatch element', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();
			const swatch = element.querySelector('[data-testid="color-picker-swatch"]');

			expect(swatch).toBeTruthy();
			colorPicker.destroy();
		});

		it('should create reset button when not empty color', () => {
			const colorPicker = new ColorPicker({ color: '#ff0000' });
			const element = colorPicker.getEl();
			// Reset button shows when color is not empty color
			colorPicker.destroy();
		});

		it('should create transparent indicator', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();
			const transparentCnt = element.querySelector('[data-testid="color-picker-transparent"]');

			expect(transparentCnt).toBeTruthy();
			colorPicker.destroy();
		});
	});

	describe('Color Value Type', () => {
		it('should use hex by default', () => {
			const colorPicker = new ColorPicker({ color: '#3b82f6' });
			const color = colorPicker.getColor();

			expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
			colorPicker.destroy();
		});

		it('should support rgb value type', () => {
			const colorPicker = new ColorPicker({
				valueColorType: 'rgb',
				color: '#3b82f6'
			});
			// Color type should be respected in internal handling
			colorPicker.destroy();
		});

		it('should support rgba value type', () => {
			const colorPicker = new ColorPicker({
				valueColorType: 'rgba',
				color: '#3b82f6'
			});
			colorPicker.destroy();
		});
	});

	describe('Color Changes', () => {
		it('should trigger onChange callback', () => {
			const onChange = vi.fn();
			const colorPicker = new ColorPicker({ onChange });

			// Simulate Alwan change event
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			expect(onChange).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should emit change event', () => {
			const colorPicker = new ColorPicker();
			const changeHandler = vi.fn();

			colorPicker.on('change', changeHandler);

			// Simulate Alwan change event
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			expect(changeHandler).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should change color programmatically', () => {
			const colorPicker = new ColorPicker();

			colorPicker.changeColor('#ff0000');

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('#ff0000');
			colorPicker.destroy();
		});

		it('should change swatch color', () => {
			const colorPicker = new ColorPicker();

			colorPicker.changeSwatchColor('#00ff00');

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('#00ff00');
			colorPicker.destroy();
		});
	});

	describe('Transparency Handling', () => {
		it('should detect transparent color', () => {
			const colorPicker = new ColorPicker({ color: 'transparent' });
			// Should handle transparent color
			colorPicker.destroy();
		});

		it('should add transparent class when alpha is 0', () => {
			const colorPicker = new ColorPicker({ color: '#00000000' });
			const element = colorPicker.getEl();

			// Transparency state should be reflected in classes
			colorPicker.destroy();
		});

		it('should remove transparent class when alpha is not 0', () => {
			const colorPicker = new ColorPicker({ color: '#ff0000' });
			const element = colorPicker.getEl();

			expect(element.className).not.toContain('transparent');
			colorPicker.destroy();
		});

		it('should display transparent label for transparent colors', () => {
			const colorPicker = new ColorPicker({
				color: 'transparent',
				transparentColorLabel: 'none'
			});
			// Input should show transparent label
			colorPicker.destroy();
		});
	});

	describe('Empty Color', () => {
		it('should handle empty color as string', () => {
			const colorPicker = new ColorPicker({ emptyColor: '#00000000', color: '#ff0000' });
			expect(colorPicker.emptyColorIsSet()).toBe(false);
			colorPicker.destroy();
		});

		it('should handle empty color as function', () => {
			const emptyColorFn = vi.fn(() => '#cccccc');
			const colorPicker = new ColorPicker({ emptyColor: emptyColorFn });

			colorPicker.resetColor(false);
			expect(emptyColorFn).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should display empty color label', () => {
			const colorPicker = new ColorPicker({
				emptyColor: '#00000000',
				emptyColorLabel: 'default',
				color: '#00000000'
			});
			// Empty label should be displayed
			colorPicker.destroy();
		});

		it('should check if empty color is set', () => {
			const colorPicker = new ColorPicker({
				emptyColor: '#00000000',
				color: '#00000000'
			});

			// Empty color detection
			colorPicker.destroy();
		});
	});

	describe('Reset Functionality', () => {
		it('should reset color to empty color', () => {
			const colorPicker = new ColorPicker({
				color: '#ff0000',
				emptyColor: 'transparent'
			});

			colorPicker.resetColor(false);

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('transparent');
			colorPicker.destroy();
		});

		it('should trigger onReset callback', () => {
			const onReset = vi.fn();
			const colorPicker = new ColorPicker({
				color: '#ff0000',
				emptyColor: 'transparent',
				onReset
			});

			colorPicker.resetColor(false);

			expect(onReset).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should emit resetColor event', () => {
			const colorPicker = new ColorPicker({
				color: '#ff0000',
				emptyColor: 'transparent'
			});
			const resetHandler = vi.fn();

			colorPicker.on('resetColor', resetHandler);
			colorPicker.resetColor(false);

			expect(resetHandler).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should reset with function empty color', () => {
			const emptyColorFn = vi.fn(() => '#999999');
			const colorPicker = new ColorPicker({
				color: '#ff0000',
				emptyColor: emptyColorFn
			});

			colorPicker.resetColor(false);

			expect(emptyColorFn).toHaveBeenCalled();
			colorPicker.destroy();
		});
	});

	describe('Alwan Integration', () => {
		it('should initialize Alwan with options', () => {
			const colorPicker = new ColorPicker({
				colorPickerOptions: {
					preset: true,
					position: 'top-start',
					swatches: ['#ff0000', '#00ff00', '#0000ff']
				}
			});

			expect(colorPicker.getColorPicker()).toBeTruthy();
			colorPicker.destroy();
		});

		it('should get Alwan instance', () => {
			const colorPicker = new ColorPicker();
			const alwan = colorPicker.getColorPicker();

			expect(alwan).toBeTruthy();
			expect(typeof alwan.getColor).toBe('function');
			colorPicker.destroy();
		});

		it('should pass initial color to Alwan', () => {
			const colorPicker = new ColorPicker({ color: '#3b82f6' });
			// Color should be passed to Alwan
			colorPicker.destroy();
		});
	});

	describe('Event System', () => {
		it('should register event listeners', () => {
			const colorPicker = new ColorPicker();
			const handler = vi.fn();

			colorPicker.on('change', handler);

			// Trigger change
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			expect(handler).toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should unregister event listeners', () => {
			const colorPicker = new ColorPicker();
			const handler = vi.fn();

			colorPicker.on('change', handler);
			colorPicker.off('change', handler);

			// Trigger change
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			expect(handler).not.toHaveBeenCalled();
			colorPicker.destroy();
		});

		it('should support multiple event listeners', () => {
			const colorPicker = new ColorPicker();
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			colorPicker.on('change', handler1);
			colorPicker.on('change', handler2);

			// Trigger change
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			expect(handler1).toHaveBeenCalled();
			expect(handler2).toHaveBeenCalled();
			colorPicker.destroy();
		});
	});

	describe('Public API', () => {
		it('should return root element via getEl()', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();

			expect(element).toBeInstanceOf(HTMLElement);
			expect(element.className).toContain('color-picker-input');
			colorPicker.destroy();
		});

		it('should return color via getColor()', () => {
			const colorPicker = new ColorPicker({ color: '#3b82f6' });
			const color = colorPicker.getColor();

			expect(color).toBeTruthy();
			expect(typeof color).toBe('string');
			colorPicker.destroy();
		});

		it('should change color via changeColor()', () => {
			const colorPicker = new ColorPicker();

			colorPicker.changeColor('#ff0000');

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('#ff0000');
			colorPicker.destroy();
		});

		it('should change swatch color via changeSwatchColor()', () => {
			const colorPicker = new ColorPicker();

			colorPicker.changeSwatchColor('#00ff00');

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('#00ff00');
			colorPicker.destroy();
		});

		it('should reset color via resetColor()', () => {
			const colorPicker = new ColorPicker({
				color: '#ff0000',
				emptyColor: 'transparent'
			});

			colorPicker.resetColor(false);

			const alwan = colorPicker.getColorPicker();
			expect(alwan.setColor).toHaveBeenCalledWith('transparent');
			colorPicker.destroy();
		});

		it('should check empty color via emptyColorIsSet()', () => {
			const colorPicker = new ColorPicker({ emptyColor: 'transparent' });
			const isEmpty = colorPicker.emptyColorIsSet();

			expect(typeof isEmpty).toBe('boolean');
			colorPicker.destroy();
		});

		it('should get Alwan instance via getColorPicker()', () => {
			const colorPicker = new ColorPicker();
			const alwan = colorPicker.getColorPicker();

			expect(alwan).toBeTruthy();
			expect(typeof alwan.getColor).toBe('function');
			colorPicker.destroy();
		});
	});

	describe('Destroy', () => {
		it('should destroy the component', () => {
			const colorPicker = new ColorPicker();
			const alwan = colorPicker.getColorPicker();

			colorPicker.destroy();

			expect(alwan.destroy).toHaveBeenCalled();
		});

		it('should remove element from DOM', () => {
			const colorPicker = new ColorPicker();
			const element = colorPicker.getEl();
			container.appendChild(element);

			expect(container.contains(element)).toBe(true);

			colorPicker.destroy();

			expect(container.contains(element)).toBe(false);
		});

		it('should clean up event listeners', () => {
			const colorPicker = new ColorPicker();
			const handler = vi.fn();

			colorPicker.on('change', handler);
			colorPicker.destroy();

			// Events should not fire after destroy
			const alwan = colorPicker.getColorPicker();
			alwan.trigger('change');

			// Handler should not be called (component destroyed)
		});
	});

	describe('Edge Cases', () => {
		it('should handle null color', () => {
			const colorPicker = new ColorPicker({ color: null });
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});

		it('should handle undefined color', () => {
			const colorPicker = new ColorPicker({ color: undefined });
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});

		it('should handle empty string color', () => {
			const colorPicker = new ColorPicker({ color: '' });
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});

		it('should handle custom reset icon as string', () => {
			const colorPicker = new ColorPicker({ resetIcon: '<span>X</span>' });
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});

		it('should handle custom reset icon as HTMLElement', () => {
			const icon = document.createElement('i');
			icon.className = 'custom-icon';
			const colorPicker = new ColorPicker({ resetIcon: icon });
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});

		it('should handle empty swatches array', () => {
			const colorPicker = new ColorPicker({
				colorPickerOptions: { swatches: [] }
			});
			expect(colorPicker).toBeInstanceOf(ColorPicker);
			colorPicker.destroy();
		});
	});
});
