

export namespace MathUtils {
    export function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    export function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    export function fposmod(a: number, b: number) {
        return ((a % b) + b) % b;
    }
}