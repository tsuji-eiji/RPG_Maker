//@ts-check

const fs = require("fs");
const path = require("path");

const CONFIG_FILE = "data/scm_config.json";

const DEFALT_CONFIG = {
  AUTO_SCENE_SELECT: true, //シーンを自動で開く
  ENABLE_SYNTAX: true, // シンタックスハイライトを有効化(動作が不安定になる場合があり)
  ADVANCE_OPTIONS: true, // 高度な設定を表示
  GAME_PROCESS_MODE: true, // ゲームを実行状態にする
  VIRTUAL_INPUT: false, // フォーカスせずともゲーム画面が操作されます
  IS_COMBO_MODE: true, // コンボボックスの表示モード
  ENABLE_SAVE_ALERT: false, //保存時にアラートを表示する
};
const configPath = path.join(process.cwd(), CONFIG_FILE);

class FileIoUtil {
  static saveToFile(data, fileName) {
    if (data === null) {
      console.error("DATA IS INVALID");
      return;
    }
    if (!fileName) {
      console.error("NO FILENAME");
      return;
    }
    // Use process.cwd() as an alternative to __dirname in environments where __dirname is not defined
    const configPath = path.join(process.cwd(), fileName);
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Config saved to ${fileName}`);
  }
}
export class EditorConfig {
  static resetData() {
    FileIoUtil.saveToFile(DEFALT_CONFIG, CONFIG_FILE);
  }
  static getData() {
    try {
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, "utf-8"));
      } else {
        // ファイルが無ければデフォルト設定を保存して返す
        FileIoUtil.saveToFile(DEFALT_CONFIG, CONFIG_FILE);
        console.warn("設定ファイルが見つかりません。初期設定が適用されます。");
        return { ...DEFALT_CONFIG };
      }
    } catch (e) {
      console.error("設定ファイルの読み込みに失敗しました:", e);
      return { ...DEFALT_CONFIG };
    }
  }
  static save(config) {
    for (let key in config) {
      CONFIG[key] = config[key];
    }
    console.log("NOT IMP");
    // FileIoUtil を使って config.json に config を保存する
    FileIoUtil.saveToFile(config, CONFIG_FILE);
  }
}
export const CONFIG = EditorConfig.getData();

export const edidorOptions = [
  {
    text: "保存時にアラートを表示する",
    param: "ENABLE_SAVE_ALERT",
    desc: "エディタでの保存時にアラートを表示します。",
    defaultValue: true,
    propType: "boolean",
  },
  {
    text: "シンタックスハイライトを有効化",
    param: "ENABLE_SYNTAX",
    desc: "テキストフィールドのシンタックスハイライトを有効にします。動作が不安定になる場合は無効にしてください。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "スクリプトを選択式にする",
    param: "IS_COMBO_MODE",
    desc: "「項目描画スクリプト」以外のスクリプトを選択方式にします。",
    defaultValue: true,
    propType: "boolean",
  },
  // {
  //   text: "イベント",
  //   param: "DecisionEvent",
  //   desc: "表示する",
  //   defaultValue: {},
  //   propType: "struct<ANY>",
  // },
  // {
  //   text: "高度な設定を表示する",
  //   param: "ADVANCE_OPTIONS",
  //   desc: "ウィンドウの高度な設定を表示します",
  //   defaultValue: true,
  //   propType: "boolean",
  // },
];

window.EditorConfig = EditorConfig;
