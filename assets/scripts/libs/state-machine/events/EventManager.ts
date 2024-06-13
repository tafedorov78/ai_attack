type EventCallback = (...args: any[]) => void;

export default class EventManager {
    private static eventListeners: { [key: string]: EventCallback[] } = {};

    private constructor() {}

    public static add(eventName: string, callback: EventCallback): void {
        if (!EventManager.eventListeners[eventName]) {
            EventManager.eventListeners[eventName] = [];
        }
        EventManager.eventListeners[eventName].push(callback);
    }

    public static addOnce(eventName: string, callback: EventCallback): void {
        EventManager.remove(eventName, callback);
        EventManager.add(eventName, callback);
    }

    public static remove(eventName: string, callback: EventCallback): void {
        const listeners = EventManager.eventListeners[eventName];
        if (!listeners) {
            return;
        }
        
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    public static dispatch(eventName: string, ...args: any[]): void {
        const listeners = EventManager.eventListeners[eventName];
        if (!listeners) {
            return;
        }
        for (const callback of listeners) {
            callback(...args);
        }
    }
}