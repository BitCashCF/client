import { ShardClient } from '../client';
import { toCamelCase } from '../utils';


export interface BaseStructureData {
  [key: string]: any,
}

/**
 * The most basic Structure class, every structure extends this
 * @category Structure
 */
export class Structure {
  /** @ignore */
  readonly _keys: ReadonlyArray<string> | null = null;
  /** @ignore */
  readonly _keysMerge: ReadonlyArray<string> | null = null;

  constructor() {
    Object.defineProperties(this, {
      _keys: {enumerable: false},
      _keysMerge: {enumerable: false},
    });
  }

  _getFromSnake(key: string): any {
    return (<any> this)[toCamelCase(key)];
  }

  _setFromSnake(key: string, value: any): any {
    return (<any> this)[toCamelCase(key)] = value;
  }

  difference(key: string, value: any): [boolean, any] {
    if (value !== undefined) {
      const camelKey = toCamelCase(key);
      const old = (<any> this)[camelKey];
      if (old !== undefined && old !== value) {
        return [true, old];
      }
    }
    return [false, null];
  }

  differences(data: BaseStructureData): null | object {
    let hasDifferences = false;
    const obj: BaseStructureData = {};
    for (let key in data) {
      const [hasDifference, difference] = this.difference(key, data[key]);
      if (hasDifference) {
        obj[toCamelCase(key)] = difference;
        hasDifferences = true;
      }
    }
    if (hasDifferences) {
      return obj;
    }
    return null;
  }

  merge(data: BaseStructureData): void {
    if (this._keysMerge !== null) {
      for (let key of this._keysMerge) {
        this.mergeValue(key, data[key]);
      }
    }
    for (let key in data) {
      if (this._keysMerge !== null && this._keysMerge.includes(key)) {
        continue;
      }
      let value = data[key];
      if (value instanceof BaseStructure) {
        this._setFromSnake(key, value);
        continue;
      }
      this.mergeValue(key, value);
    }
  }

  mergeValue(key: string, value: any): void {
    if (value !== undefined) {
      if (this._keys !== null && this._keys.includes(key)) {
        this._setFromSnake(key, value);
      }
    }
  }

  toJSON(): object {
    const obj: BaseStructureData = {};
    if (this._keys !== null) {
      for (let key of this._keys) {
        obj[key] = this._getFromSnake(key);
      }
    }
    return obj;
  }
}


/**
 * Basic Structure class with an added ShardClient attached to it
 * @category Structure
 */
export class BaseStructure extends Structure {
  readonly client: ShardClient;

  constructor(client: ShardClient) {
    super();
    this.client = client;

    Object.defineProperties(this, {
      client: {enumerable: false, writable: false},
    });
  }

  get shardId(): number {
    return this.client.shardId;
  }
}
