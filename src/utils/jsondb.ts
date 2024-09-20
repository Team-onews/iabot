import fs from 'fs';
import { i14a } from '../configs/i14a.js';

/**
 * A simple JSON database class.
 *
 * @class JsonDB
 */
export class JsonDB {
  private path: string;

  /**
   * Creates an instance of JsonDB.
   * @param {string} path - The path to the JSON database file.
   * @memberof JsonDB
   */
  constructor(path?: string) {
    this.path = i14a.env.rootPath + '../../../db/' + path;
  }

  /**
   * Retrieves the data from the JSON database.
   *
   * @return {Promise<any[]>} The data from the JSON database.
   * @memberof JsonDB
   */
  public async get(dataType?: 'array' | 'object'): Promise<any> {
    if (!fs.existsSync(this.path)) {
      return null;
    }
    const data = fs.readFileSync(this.path, 'utf-8');
    if (dataType === 'object') {
      return JSON.parse(data) as Array<any>;
    }
    if (dataType === 'array') {
      return JSON.parse(data) as any[];
    }
    return JSON.parse(data);
  }

  /**
   * Saves the data to the JSON database.
   *
   * @param {any[]} data - The data to save.
   * @return {Promise<void>} A promise that resolves when the data is saved.
   * @memberof JsonDB
   */
  public async set(data: any[]): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.path, json, { encoding: 'utf-8' });
  }

  /**
   * Deletes the JSON database file.
   *
   * @return {Promise<void>} A promise that resolves when the JSON database file is deleted.
   * @memberof JsonDB
   */
  public async delete(): Promise<void> {
    fs.unlinkSync(this.path);
  }

  /**
   * Checks if the JSON database file exists.
   *
   * @return {boolean} True if the JSON database file exists, false otherwise.
   * @memberof JsonDB
   */
  public exists(): boolean {
    return fs.existsSync(this.path);
  }

  /**
   * Creates the JSON database file if it doesn't exist.
   *
   * @return {Promise<void>} A promise that resolves when the JSON database file is created.
   * @memberof JsonDB
   */
  public async create(): Promise<boolean | undefined> {
    const directory = this.path.substring(0, this.path.lastIndexOf('/'));
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]', { encoding: 'utf-8' });
      return true;
    }
    return;
  }
}
