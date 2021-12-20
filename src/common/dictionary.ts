/* eslint-disable no-prototype-builtins */
//Courtsey: DOMINIK MARCINISZYN: https://codetain.com/blog/dictionary-in-typescript

export interface IKeyCollection<T> {
    add(key: string, value: T);
    containsKey(key: string): boolean;
    size(): number;
    getItem(key: string): T;
    removeItem(key: string): T;
    getKeys(): string[];
    values(): T[];
}

export default class Dictionary<T> implements IKeyCollection<T> {
    
    private items: { [index: string]: T } = {};

    private count = 0;

    add(key: string, value: T) {
        if (!this.items.hasOwnProperty(key)) {
            this.count++;
        }

        this.items[key] = value;
    }

    containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    size(): number {
        return this.count;
    }

    getItem(key: string): T {
        return this.items[key];
    }

    removeItem(key: string): T {
        const value = this.items[key];

        delete this.items[key];
        this.count--;

        return value;
    }

    getKeys(): string[] {
        var keySet: string[] = [];

        for (var property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                keySet.push(property);
            }
        }

        return keySet;
    }

    values(): T[] {
        var values: T[] = [];

        for (var property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                values.push(this.items[property]);
            }
        }

        return values;
    }

}
