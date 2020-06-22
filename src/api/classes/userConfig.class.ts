export interface UserConfigBackModel {
  _darkMode: boolean;
  _language: string;
}

export class UserConfig {
  public darkMode: boolean = true;

  public language: string = '';

  public temp(): string {
    return 'ok';
  }

  public static New(datas: Partial<UserConfig>): UserConfig {
    return Object.assign(new UserConfig(), datas);
  }

  public static fromBack(datas: UserConfigBackModel) {
    let newObj = new UserConfig();

    newObj.darkMode = datas._darkMode;
    newObj.language = datas._language;

    return newObj;
  }

  public static CompareArrays(arr1: UserConfig[], arr2: UserConfig[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => UserConfig.CompareObjects(e, arr2[i]))
    );
  }
  public static CompareObjects(obj1: UserConfig, obj2: UserConfig): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.darkMode === obj2.darkMode &&
      obj1.language === obj2.language
    );
  }
}
