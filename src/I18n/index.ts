import en from "./en";

type LanguageFiles = typeof en;

/**
 * I18n class to handle translations
 */
export class I18n {
  public static readonly trad: I18n = new I18n(en);

  private primary: LanguageFiles;
  // private secondary: LanguageFiles;

  public get: LanguageFiles;

  constructor(primary: LanguageFiles) {
    this.primary = primary;
    // this.secondary = secondary;
    this.get = this.createProxy(this.primary);
  }

  // proxy to handle typing autocompletion
  private createProxy<T extends object>(obj: T): T {
    return new Proxy(obj, {
      get: (target, prop) => {
        const value = target[prop as keyof T];
        if (typeof value === "object" && value !== null) {
          return this.createProxy(value as object);
        }
        return value;
      },
    });
  }
}
