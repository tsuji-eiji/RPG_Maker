// @ts-check

import { Editor } from "./src/editor.js";
import { EditorProps } from "./src/EditorProps.js";
import { createMenuBar } from "./src/controllers/menubar.js";
import { simulateKeyInput } from "./src/controllers/virtualInput.js";
import { CONFIG } from "./user/editorConfig.js";
import {
  getCurrentSceneId,
  getModel,
  getSceneIndex,
  getWindowList,
  setWindowTitle,
  swapWindow,
} from "./src/apis/logic.js";
import { DivList, DragList } from "./components/atoms/dragList.js";
import { FolderTreeTable } from "./components/editor/FolderTreeTable.js";
import { initListenners } from "./listenners.js";

// @ts-ignore
Array.prototype.remove = function (element) {
  for (;;) {
    const index = this.indexOf(element);
    if (index >= 0) {
      this.splice(index, 1);
    } else {
      return this;
    }
  }
};
/**
 */

/**@type {SCM_Model} */
// window.$scm = window.opener.$scm;
const IS_BOOTCONSOLE = true;
if (IS_BOOTCONSOLE) {
  console.log("======================");
  console.log("SCM_EDITOR");
  console.log("======================");
}
initListenners();

function updateSceneList() {
  const sceneSelector = document.getElementById("sceneList");
  const currentSceneId = getCurrentSceneId();
  const idx = getSceneIndex(currentSceneId);
  if (idx == -1) {
    console.warn("no window:", currentSceneId);
    $("#window-settings").removeClass("enable").addClass("disable");
    return;
  }
  sceneSelector.value = `Scene${idx}`;
  // 既存シーンを選択しウィンドウを開く
  $("#window-settings").removeClass("disable").addClass("enable");
  const windowList = getModel()?.param?.[idx]?.WindowList;
  const windowData = windowList?.[0] || null;

  Editor.refresh();
  Editor.setData(currentSceneId, windowData);
  // if (CONFIG.AUTO_SCENE_SELECT) openScene(sceneId);
}

// 現在のシーン名の変更を検知する
// 毎フレーム実行される関数を作成
class Main {
  folderTree = null;
  static updateTree = () => {
    if (!this.folderTree) {
      console.warn("no tree");
    }
    const sceneList = getModel().getSceneList();
    /** @type {SCM_Scene[]}*/
    const sceneDataList = [
      ...sceneList.map((e) => getModel().getSceneFromId(e)),
    ];
    sceneDataList.forEach(
      (e) => (e.isActive = getModel().getCurrentSceneId() == e.Id)
    );

    this.folderTree.update(sceneDataList);
  };
  static sceneName = null;
  static createWindowList() {
    // ドラッグで入れ替え可能なウィンドウリスト
    return;
    const sceneId = EditorProps.getCurrentSceneId();
    const winList = getWindowList(sceneId);
    const winListStr = winList.map((e) => e.Id);
    const items = DivList(winListStr);
    // const items = DivList(stringArray);
    // windowList
    const dragList = new DragList(items, (newOrder, fromIndex, toIndex) => {
      // console.log("順序が変更されました:");
      // console.log("新しい順序:", newOrder);
      console.log(`インデックス ${fromIndex} から ${toIndex} へ移動`);
      const newList = swapWindow(sceneId, fromIndex, toIndex);
      console.log(newList);
    });

    const dWinList = document.getElementById("dWinList");
    if (dWinList) {
      dWinList.innerHTML = "";
      dWinList.appendChild(dragList.element);
    } else {
      console.warn('"dWinList" element not found.');
    }
  }
  static start() {
    createMenuBar();
    Editor.init();

    const sceneList = getModel().getSceneList();
    /** @type {SCM_Scene[]}*/
    const sceneDataList = sceneList.map((e) => getModel().getSceneFromId(e));
    // this.folderTree = new FolderTree(sceneDataList);
    this.folderTree = new FolderTreeTable(sceneDataList);
    const sceneTreeElem = document.getElementById("sceneTree");
    if (sceneTreeElem) {
      sceneTreeElem.appendChild(this.folderTree.element);
    } else {
      console.warn('"sceneTree" element not found.');
    }
    this.createWindowList();
    this.update(0);
  }
  static update(delta) {
    const currentSceneId = getCurrentSceneId();
    if (this.sceneName != currentSceneId) {
      // On Scene Change
      console.log("シーンが変更されました:", currentSceneId);
      setWindowTitle();
      this.updateTree();
      this.createWindowList();

      updateSceneList();
      // Editor.setData(currentSceneId.Id, EditorProps.getData());
    }
    this.sceneName = currentSceneId;
    requestAnimationFrame(this.update.bind(this));
  }
}

Main.start();
