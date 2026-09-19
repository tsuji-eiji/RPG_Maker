// @ts-check

import { loadFile, reloadScene, saveFile, saveParams } from "../apis/logic.js";
import { Editor } from "../editor.js";
import {
  CONFIG,
  edidorOptions,
  EditorConfig,
} from "../../user/editorConfig.js";
import { promptEx } from "../../components/inputFields/propModal.js";
import { getModel } from "../apis/logic.js";
const path = require("path");
const fs = require("fs");

export function createMenuBar() {
  // nw.jsのネイティブメニューバーを作成
  const menubar = new nw.Menu({ type: "menubar" });

  // ファイルメニュー
  const fileMenu = new nw.Menu();

  // 既存の機能をnw.jsメニュー項目に変換
  // fileMenu.append(
  //   new nw.MenuItem({
  //     label: "データの初期化",
  //     click: function () {
  //       handleInit();
  //     },
  //   })
  // );

  // fileMenu.append(
  //   new nw.MenuItem({
  //     label: "書き出し(json)",
  //     click: function () {
  //       handleExport();
  //     },
  //   })
  // );

  // fileMenu.append(
  //   new nw.MenuItem({
  //     label: "書き出し(text)",
  //     click: function () {
  //       handleExportText();
  //     },
  //   })
  // );

  // fileMenu.append(
  //   new nw.MenuItem({
  //     label: "セーブファイルを読み込み",
  //     click: function () {
  //       handleImportSaveFile();
  //     },
  //   })
  // );
  const menu_save = new nw.MenuItem({
    label: "保存",
    click: function () {
      handleSave();
    },
    key: "s",
    modifiers: "ctrl", // Ctrl+R ショートカットを追加
  });
  const menu_open = new nw.MenuItem({
    label: "データフォルダを開く",
    click: function () {
      handleOpenFolder();
    },
  });
  fileMenu.append(menu_save);
  fileMenu.append(menu_open);

  // メニューバーにファイルメニューを追加
  menubar.append(
    new nw.MenuItem({
      label: "ファイル",
      submenu: fileMenu,
    })
  );

  // オプション
  const editorOptionMenu = new nw.Menu();

  // 既存の機能をnw.jsメニュー項目に変換
  editorOptionMenu.append(
    new nw.MenuItem({
      label: "エディタ設定",
      click: function () {
        handleOption();
      },
    })
  );

  menubar.append(
    new nw.MenuItem({
      label: "オプション",
      submenu: editorOptionMenu,
    })
  );

  // // シーン編集メニュー(実験的)
  // function setupSceneListMenu(targetMenu) {
  //   // 既存のメニュー項目をクリア
  //   while (targetMenu.items.length > 0) {
  //     targetMenu.removeAt(0);
  //   }
  //   for (let i = 1; i <= 20; i++) {
  //     const sceneIndex = `Scene${i}`;
  //     const sceneId =
  //       window.opener?.$scm?.param?.[sceneIndex]?.Id || "(シーンがありません)";
  //     const label = sceneIndex + "  :  " + sceneId;
  //     targetMenu.append(
  //       new nw.MenuItem({
  //         label,
  //         click: function () {
  //           // シーン選択時の処理をここに記述
  //           EditorProps.setCurrentScene(sceneId, null);
  //           handleSceneSelect();
  //         },
  //       })
  //     );
  //   }
  // }
  // const editMenu = new nw.Menu();
  // setupSceneListMenu(editMenu);

  // menubar.append(
  //   new nw.MenuItem({
  //     label: "シーン編集",
  //     submenu: editMenu,
  //   })
  // );

  const editMenu = new nw.Menu();
  editMenu.append(
    new nw.MenuItem({
      label: "リロード",
      click: function () {
        handleReload();
      },
      key: "r",
      modifiers: "ctrl", // Ctrl+R ショートカットを追加
    })
  );

  menubar.append(
    new nw.MenuItem({
      label: "編集",
      submenu: editMenu,
    })
  );

  // メニューバーを適用
  nw.Window.get().menu = menubar;

  // 空のDIV要素を返す（既存の関数との互換性のため）
  // 実際のUIはnw.jsによって管理されるので、この戻り値は使用されない可能性が高い
  const dummyElement = document.createElement("div");
  return dummyElement;
}

// JSON書き出し
// function handleExport() {
//   const param = getModel().getSerializeData();
//   const sampleData = JSON.stringify(param);
//   saveFile(sampleData, "scmData.json");
// }

// シーン情報をテキスト書き出し(プラグインパラメータに貼り付け可能)
function handleExportText() {
  const param = getModel().encodeToPluginText("Scene1");
  const sampleData = param;
  saveFile(sampleData, "scmScene1Param.text");
}

function handleImportSaveFile() {
  // 使用例
  loadFile((data, filePath) => {
    console.log("ファイルパス:", filePath);
    getModel().loadSaveFile(filePath);
    // const param = JSON.parase(data);
    // console.log(param);
  });
}

function handleImport() {
  // 使用例
  loadFile((data, filePath) => {
    console.log("ファイルパス:", filePath);
    getModel().onLoadJson(data);
    // const param = JSON.parase(data);
    // console.log(param);
  });
}
// EDITOR
function handleSceneSelect() {
  Editor.refresh();
}

function handleReload() {
  reloadScene();
}

export function handleSave() {
  let result = true;
  if (CONFIG.ENABLE_SAVE_ALERT) {
    result = window.confirm("現在の設定を保存します。よろしいですか?");
  }
  // TODO
  if (result) {
    saveParams();
    if (CONFIG.ENABLE_SAVE_ALERT) {
      alert("保存が完了しました");
    }
    // Yesの場合の処理
  } else {
    // Noの場合の処理
  }
}
function handleOpenFolder() {
  // data/ を開く
  const dataDir = path.join(process.cwd(), "data");
  if (fs.existsSync(dataDir)) {
    nw.Shell.openItem(dataDir);
  } else {
    alert("data フォルダが見つかりません。");
  }
}

function handleInit() {
  const result = window.confirm(
    "SceneCustomMenuのプラグインパラメータで初期データを読み込みます。よろしいですか？"
  );
  // TODO
  if (result) {
    // 初期化
    alert("初期データを読み込みました。保存はされていません。");
    getModel().initialize();
    Editor.refresh();
  } else {
    console.log("Noが選択されました");
  }
}

async function handleOption() {
  const result = await promptEx(CONFIG, "CONFIG", edidorOptions);
  EditorConfig.save(result);
  Editor.refresh();
}
