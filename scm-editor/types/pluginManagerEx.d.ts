declare class PluginParam {
  private _parameter: any;
  constructor(parameter: any, needParse?: boolean);
  setup(parameter: any): void;
  _createAccessor(paramName: string): void;
  _convert(param: any, paramName: string): any;
  _isStructArray(param: any): boolean;
  _isStruct(param: any): boolean;
  _param(name: string): any;
  _paramReplacer(key: string, value: any): any;
  [key: string]: any;
}

declare class PluginManagerEx {
  static convertVariables(text: string, data?: any): any;
  static convertEscapeCharacters(
    text: string,
    data?: any,
    needEscape?: boolean
  ): string;
  static convertEscapeCharactersEx(text: string, data?: any): string;
  static createParameter(currentScript: any): PluginParam;
  static createCommandArgs(args: any): any;
  static findMetaValue(object: any, nameList: string | string[]): any;
  static findMetaObject(object: any, nameList: string | string[]): PluginParam;
  static findMetaProperty(object: any): any;
  static findPluginName(currentScript: any): string;
  static registerCommand(
    currentScript: any,
    commandName: string,
    funcName: string | Function
  ): void;
  static isExistPlugin(pluginName: string): boolean;
  static generateSelfSwitchKey(eventId: number): void;
  static findClassName(object: any): string;
  static throwError(message: string, currentScript: any): void;
  static escapeXmlTag(text: string): string;
  static findTextParamSuffixList(): RegExp[];
}
