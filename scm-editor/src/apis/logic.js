// @ts-check

import { Editor } from "../editor.js";

const fs = require("fs");
const path = require("path");

export const getParentWindow = () => {
  return window.opener;
};
export const getModel = () => {
  return getParentWindow().$scm;
};
export const getEditor = () => {
  return getParentWindow().SCM_Editor;
};

export function saveParams() {
  const content = {
    type: "savePluginParams",
    data: null,
  };
  getParentWindow().postMessage(content, "*");
}

// 変更をリセットする関数
export function resetChanges() {
  if (confirm("編集中の変更をリセットしますか？")) {
    // 現在のURLをリロード
    window.location.reload();
  }
}

// 親ウィンドウにデータを送信する関数
// note : 実質的に再描画のみを行っている
export function sendToParentWindow(sceneId, windowData) {
  if (!windowData) {
    alert("送信するデータがありません。");
    return;
  }
  const content = {
    type: "setWindowParam",
    data: { sceneId: sceneId, windowData: windowData },
  };

  try {
    getParentWindow().postMessage(content, "*");
  } catch (error) {
    console.error("データ送信エラー:", error);
    alert("データ送信中にエラーが発生しました: " + error.message);
  }
}

// 保存ダイアログを表示してデータを保存
export function saveFile(data, defaultFileName = "data.json") {
  const chooser = document.createElement("input");
  chooser.type = "file";
  chooser.setAttribute("nwsaveas", defaultFileName); // デフォルトのファイル名

  chooser.addEventListener("change", () => {
    if (chooser.value) {
      const filePath = chooser.value;
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          console.error("保存に失敗しました:", err);
          alert("保存に失敗しました！");
        } else {
          console.log(`保存完了: ${filePath}`);
          alert(`保存しました！\n${filePath}`);
        }
      });
    }
  });
  chooser.click();
}

// ファイルを選択して読み込む
export function loadFile(callback) {
  const chooser = document.createElement("input");
  chooser.type = "file";
  chooser.accept = ".json,.txt"; // 読み込み可能な拡張子を指定

  chooser.addEventListener("change", () => {
    if (chooser.files.length > 0) {
      const file = chooser.files[0]; // 選択したファイル
      const filePath = file.path;

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("読み込みに失敗しました:", err);
          alert("読み込みに失敗しました！");
        } else {
          console.log(`読み込み完了: ${filePath}`);
          console.log("データ:", data);
          alert(`読み込み完了！\n${filePath}`);

          // コールバックでデータを返す
          if (callback) callback(data, filePath);
        }
      });
    }
  });

  chooser.click();
}

// if (Utils.isNwjs()) {
//   const fs = require("fs");
//   const path = require("path");
//   const projectPath = path.dirname(process.mainModule.filename);
//   const pluginsPath = path.join(projectPath, "js/plugins.js");

//   const content = `
//                 /*:
//                  * プラグイン設定
//                  */
//                 const $plugins = ${JSON.stringify($plugins, null, 2)};
//                 `;

//   fs.writeFileSync(pluginsPath, content, "utf8");
//   console.log("plugins.jsに保存完了");
// } else {
//   console.warn("nw.js以外ではファイル書き込みできません");
// }

export function setWindowTitle() {
  getEditor().setWindowTitle();
}
export function getCurrentSceneId() {
  //TODO
  const sceneId =
    getParentWindow().SceneManager._scene?.constructor.name || null;
  return sceneId;
}

/**
 * @param {SceneId} sceneId
 * @returns {SCM_Scene}
 */
export function getSceneFromId(sceneId) {
  return getModel().getSceneFromId(sceneId);
}

export function getSceneList() {
  return getModel().getSceneList();
}

/**
 * @returns {SceneIndexString}
 */
export function getSceneIndexString(sceneId) {
  return "Scene" + getSceneIndex(sceneId);
}
export function getSceneIndex(sceneId) {
  return getModel().getSceneIndex(sceneId);
}

/**
 * @param {SceneId} sceneId
 * @returns {SCM_Window[]}
 */
export function getWindowList(sceneId) {
  // console.log(sceneId);
  return getModel().getWindowList(sceneId);
}

export function swapWindow(sceneId, fromIndex, toIndex) {
  return getModel().swapWindow(sceneId, fromIndex, toIndex);
}
/**
 *
 * @param {SceneId} sceneId
 * @param {string} windowId
 * @returns {number|null}
 */
export function getWindowIndex(sceneId, windowId) {
  const windowList = getWindowList(sceneId);
  const index = windowList.findIndex((e) => e.Id === windowId);
  console.assert(index >= 0, `ウィンドウIDが見つかりません: ${windowId}`);
  return index;
}

// "Scene1" -> "Scene_ActorList"
export function getSceneIdByIndexText(sceneIndex) {
  return getModel().param[sceneIndex]?.Id;
}

export function setEditWindow(windowId) {
  getParentWindow().SceneManager._scene.setEditWindow(windowId);
}

// ゲームを停止/実行
export function setGameActive(isActive) {
  // getParentWindow().SceneManager.isGameActive = () => !!isActive;
}
export function reloadScene() {
  const sceneId = getCurrentSceneId();
  if (sceneId) {
    openScene(sceneId);
  } else {
    console.error("シーンIDが不正です。読み込みに失敗しました。", sceneId);
  }
}

export function openScene(sceneId) {
  // try {
  //   if (getParentWindow().SceneManager.isCustomScene(sceneId)) {
  getParentWindow().SceneManager.trashScene(); // 元のシーン情報を破棄する
  getParentWindow().SceneManager.callCustomMenu(sceneId);
  getParentWindow().SceneManager.trashScene(); // 元のシーン情報を破棄する
  //   } else {
  //     console.log("not custom scene:");
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
}
export function changeWindowId(sceneId, oldWinId, newWinId) {
  getModel().changeWindowId(sceneId, oldWinId, newWinId);
}
export function closeScene() {
  getParentWindow().SceneManager._scene.popScene();
}

//　すべてリロード
// export function forceRefresh() {
//   Editor.ForceSendToParentWindow();
//   Editor.refresh();
//   reloadScene();
// }

// シーン設定の編集時
// SceneIndexString : "Scene1~Scene20 str"
export function editSceneData(sceneIndexString, sceneData) {
  const oldSceneData = getModel().param[sceneIndexString];
  Object.assign(oldSceneData, sceneData);
  Editor.refresh();
  openScene(sceneData.Id);
}

// export function addWindow() {
//   const newWindowData = { ...defaultWindow };
//   const newWindowId = prompt(
//     "新規ウィンドウを作成します。シーン内で重複しないIdを入力してください"
//   );
//   // const newWindow = await promptEx(newWindowData, windowProperties);
//   if (!newWindowId || newWindowId == "null") {
//     alert("IDが不正です。");
//     return;
//   }
//   newWindowData.Id = newWindowId;

//   const sceneIndex = $("#sceneList")[0].value;
//   const sceneData = getModel().param[sceneIndex];
//   sceneData.WindowList.push(newWindowData);
// }
