import type { GridOptionsService } from '../gridOptionsService';
/**
 * If the key was passed before, then doesn't execute the func
 * @param {Function} func
 * @param {string} key
 */
export declare function _doOnce(func: () => void, key: string): void;
export declare function _logIfDebug(gos: GridOptionsService, message: string, ...args: any[]): void;
export declare function _warnOnce(msg: string, ...args: any[]): void;
export declare function _errorOnce(msg: string, ...args: any[]): void;
export declare function _executeNextVMTurn(func: () => void): void;
/**
 * Creates a debounced function a function, and attach it to a bean for lifecycle
 * @param {Function} func The function to be debounced
 * @param {number} delay The time in ms to debounce
 * @return {Function} The debounced function
 */
export declare function _debounce(bean: {
    isAlive(): boolean;
}, func: (...args: any[]) => void, delay: number): (...args: any[]) => void;
/**
 * @param {Function} func The function to be throttled
 * @param {number} wait The time in ms to throttle
 * @return {Function} The throttled function
 */
export declare function _throttle(func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
export declare function _waitUntil(condition: () => boolean, callback: () => void, timeout?: number, timeoutMessage?: string): void;
