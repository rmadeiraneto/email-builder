/**
 * Type declarations for third-party packages without built-in types
 */

declare module 'alwan' {
  export interface AlwanOptions {
    theme?: string;
    toggle?: boolean;
    popover?: boolean;
    color?: string;
    default?: string;
    target?: string | HTMLElement;
    preset?: boolean;
    closeOnScroll?: boolean;
    disabled?: boolean;
    swatches?: string[];
    format?: string;
    singleInput?: boolean;
    inputs?: {
      hex?: boolean;
      rgb?: boolean;
      hsl?: boolean;
    };
    opacity?: boolean;
    preview?: boolean;
    copy?: boolean;
    buttons?: {
      copy?: boolean;
    };
    id?: string;
    classname?: string;
    onChange?: (color: any) => void;
    onOpen?: () => void;
    onClose?: () => void;
  }

  export default class Alwan {
    constructor(element: string | HTMLElement, options?: AlwanOptions);
    setColor(color: string): void;
    open(): void;
    close(): void;
    toggle(): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    destroy(): void;
    getColor(): any;
  }
}

declare module 'color2k' {
  export function parseToRgba(color: string): [number, number, number, number];
  export function rgbaToHex(r: number, g: number, b: number, a?: number): string;
  export function hslaToHex(h: number, s: number, l: number, a?: number): string;
  export function toHex(color: string): string;
  export function toRgba(color: string): string;
  export function toHsla(color: string): string;
  export function getLuminance(color: string): number;
  export function readableColor(color: string): string;
  export function mix(color1: string, color2: string, amount?: number): string;
  export function transparentize(color: string, amount: number): string;
  export function opacify(color: string, amount: number): string;
  export function darken(color: string, amount: number): string;
  export function lighten(color: string, amount: number): string;
  export function saturate(color: string, amount: number): string;
  export function desaturate(color: string, amount: number): string;
  export function parseToHsla(color: string): [number, number, number, number];
  export function parseToRgb(color: string): { r: number; g: number; b: number };
  export function parseToHsl(color: string): { h: number; s: number; l: number };
  export function getContrast(color1: string, color2: string): number;
  export function guard(low: number, high: number, value: number): number;
  export function hasBadContrast(color1: string, color2?: string): boolean;
  export function readableColorIsBlack(color: string): boolean;
}
