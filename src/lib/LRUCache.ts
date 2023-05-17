import { LRUCache as LRU } from "lru-cache";
import fs from "fs";
import path from "path";
import { exists } from "utils/fs-util";
import log from "lib/Logger";

export default class LRUCache {
  private cache: LRU<string, string>;
  private dumpFrequency: number;
  private itemsAdded: number;
  private cacheFilePath: string;

  constructor(maxItems: number, dumpFrequency = 100, cacheFilePath: string) {
    this.cache = new LRU<string, string>({
      max: maxItems,
    });

    this.dumpFrequency = dumpFrequency;
    this.itemsAdded = 0;
    this.cacheFilePath = cacheFilePath;
  }

  async load(file?: string) {
    const filePath = path.join(process.cwd(), file || this.cacheFilePath);
    log.blue("load", `cache from ${filePath}`);
    if (!(await exists(filePath))) return;
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      this.cache.load(JSON.parse(data));
      log.green("loaded cache", `: ${this.cache.size} from ${this.cacheFilePath}`);
    } catch (error) {
      log.red("cache", `could not be loaded from ${this.cacheFilePath}`, error);
    }
  }

  save(filePath: string) {
    try {
      const data = JSON.stringify(this.cache.dump());
      fs.writeFileSync(filePath, data, "utf-8");
      log.green("saved cache", `to ${filePath}`);
    } catch (error) {
      log.red("cache", `could not be saved to ${filePath}`, error);
    }
  }

  set(key: string, value: string) {
    if (!value) {
      throw new Error(`value is undefined for key ${key}`);
    }
    // if (this.cache.get(key) === value) return;
    // log.out('key', key, 'value', value, 'existing', this.cache.get(key));

    this.cache.set(key, value);
    this.itemsAdded++;

    if (this.itemsAdded > this.dumpFrequency) {
      this.itemsAdded = 0;
      this.save(this.cacheFilePath);
    }
  }

  get(key: string) {
    return this.cache.get(key);
  }
}
