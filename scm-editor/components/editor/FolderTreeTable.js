// @ts-check

import { openScene } from "../../src/apis/logic.js";
import { setUpContextMenu } from "../inputFields/drawItemScriptPresets.js";
import { Editor } from "../../src/editor.js";
import { DragList, makeDragList } from "../atoms/dragList.js";

export class FolderTreeTable {
  constructor(data) {
    this.data = data;
    this.element = this.createTree(data);
  }
  /**
   * @param {SCM_Scene[]} data
   */
  update(data) {
    // sceneクラスのアクティブなシーン状態を更新
    const sceneElements = this.element.querySelectorAll(".scene");
    sceneElements.forEach((sceneElement, index) => {
      const sceneData = data[index];
      if (sceneData) {
        const isActive = sceneData.isActive;
        if (isActive) {
          console.log("active", sceneData.Id);
          sceneElement.classList.add("active");
        } else {
          sceneElement.classList.remove("active");
        }
      }
    });
  }
  /**
   * @param {SCM_Scene[]} data
   */
  createTree(data) {
    /** @type {SCM_Scene[]} */
    const scenes = data.map((e) => {
      return {
        isActive: e.isActive,
        Id: e.Id,
        WindowList: e.WindowList,
      };
    });

    // 既存の要素をクリア
    const container = document.createElement("div");
    container.innerHTML = "";
    container.classList.add("map-selector");
    container.id = "mapSelector";

    scenes.forEach((sceneData) => {
      const sceneElement = new SceneElement(sceneData);
      container.appendChild(sceneElement.element);
    });

    return container;
  }
}

class SceneElement {
  element;

  /**
   * @param {SCM_Scene} sceneData
   */
  constructor(sceneData) {
    this.sceneData = sceneData;
    this.element = this.createElement();
  }

  createElement() {
    // Scene要素の作成
    const sceneElement = document.createElement("div");
    sceneElement.classList.add("scene");

    // アクティブなシーンの場合、activeクラスを追加
    if (this.sceneData.isActive) {
      sceneElement.classList.add("active");
    }

    const sceneNameElement = document.createElement("div");
    sceneNameElement.classList.add("scene-name");
    sceneNameElement.textContent = this.sceneData.Id;
    sceneElement.appendChild(sceneNameElement);

    // WindowsContainer要素の作成
    const windowsContainer = new WindowsContainer(
      this.sceneData.WindowList,
      this.sceneData
    );
    sceneElement.appendChild(windowsContainer.element);

    // Sceneクリック時のイベント（展開/折りたたみ）
    sceneElement.addEventListener("click", () => {
      sceneElement.classList.toggle("expanded");
    });

    // コンテキストメニューの設定
    this.setupContextMenu(sceneElement);

    return sceneElement;
  }

  setupContextMenu(sceneElement) {
    // 現在エディタで編集中のシーンをゲームで開く
    const gotoScene = () => {
      const sceneId = this.sceneData.Id;
      if (sceneId) {
        openScene(sceneId);
      }
    };

    const addWindow = () => {
      console.log("no");
    };

    const options = [
      // { label: "ウィンドウの作成", click: addWindow },
      { label: "ゲームで開く", click: gotoScene },
      // { label: "ゲームで開いているシーンを読み込む", click: importGameScene }, // not work!
    ];

    setUpContextMenu(sceneElement, options);
  }
}

class WindowsContainer {
  element;

  /**
   * @param {SCM_Window[]} windowList
   * @param {SCM_Scene} sceneData
   */
  constructor(windowList, sceneData) {
    this.windowList = windowList;
    this.sceneData = sceneData;
    this.element = this.createElement();
  }

  createElement() {
    const wrapper = document.createElement("div");
    const windowsContainer = document.createElement("div");
    windowsContainer.classList.add("windows");
    wrapper.classList.add("windows");

    // Collect window elements for DragList
    this.windowList.forEach((windowData) => {
      const windowElement = new TreeItem({
        sceneData: this.sceneData,
        windowData,
      }).element;
      windowsContainer.appendChild(windowElement);
    });

    // Initialize DragList with the window elements
    // const dragList = makeDragList(windowsContainer).element;
    // wrapper.appendChild(dragList);

    // return wrapper;
    return windowsContainer;
  }
}

class TreeItem {
  element;
  /**
   * @param {{ sceneData: SCM_Scene; windowData: SCM_Window; }} props
   */
  constructor(props) {
    const { sceneData, windowData } = props;
    if (!windowData) {
      console.warn("no window data");
      return;
    }
    const wrapper = document.createElement("div");

    const windowElement = document.createElement("div");
    windowElement.classList.add("window");
    windowElement.textContent = windowData.Id;

    // Windowクリック時のイベント
    windowElement.addEventListener("click", (event) => {
      // 既存の選択を解除
      document.querySelectorAll(".window.selected").forEach((el) => {
        el.classList.remove("selected");
      });

      // 選択状態の切り替え
      windowElement.classList.add("selected");

      // 選択されたウィンドウ情報を親ウィンドウに送信
      Editor.setData(sceneData.Id, windowData);

      // イベント伝播を停止
      event.stopPropagation();
    });
    // // ウィンドウ削除
    // const confirmRemoveWindow = () => {
    //   const result = window.confirm(
    //     "ウィンドウを削除します。よろしいですか?"
    //   );
    //   if (result) {
    //     const sceneId = EditorProps.getCurrentSceneId();
    //     const windowId = EditorProps.getData().Id;
    //     const ok = getModel().removeWindow(sceneId, windowId);
    //     if (ok) {
    //       alert("削除に成功しました。");
    //     } else {
    //       alert("削除に失敗しました。");
    //     }
    //     Editor.buildEditorUI(sceneId, null);
    //     // Editor.ForceSendToParentWindow();
    //   } else {
    //     // pass
    //   }
    // };
    // const options = [
    //   { label: "削除", click: confirmRemoveWindow },
    //   { label: "下に移動", click: confirmRemoveWindow },
    //   // { label: "ゲームで開く", click: gotoScene },
    // ];
    // setUpContextMenu(windowElement, options);
    wrapper.appendChild(windowElement);
    this.element = wrapper;
  }
}
