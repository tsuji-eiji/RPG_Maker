// @ts-check

import { getParentWindow } from "../../src/apis/logic.js";
import {
  getModel,
  getSceneIndexString,
  openScene,
} from "../../src/apis/logic.js";
import { setUpContextMenu } from "../inputFields/drawItemScriptPresets.js";
import { defaultScene } from "../../user/defaultScene.js";
import { Editor } from "../../src/editor.js";
import { EditorProps } from "../../src/EditorProps.js";

function convertRPGMakerData(inputData) {
  const scenes = Object.keys(inputData)
    .filter((key) => key.startsWith("Scene"))
    .map((sceneKey) => {
      const sceneData = inputData[sceneKey];
      return {
        name: sceneData.Id,
        windows: sceneData.WindowList.map((windowData) => windowData.Id),
      };
    });

  return { scenes };
}

let currentData = {
  scenes: [],
};

export class FolderTree {
  constructor(data) {
    this.data = data;
    this.element = this.createMapSelector(data);
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
          console.log("active", sceneData.name);
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
  createMapSelector(data) {
    /** @type {SCM_Scene[]} */
    const scenes = data.map((e) => {
      return {
        isActive: e.isActive,
        name: e.Id,
        windows: e.WindowList,
      };
    });

    // 既存の要素をクリア
    const container = document.createElement("div");
    container.innerHTML = "";
    container.classList.add("map-selector");
    container.id = "mapSelector";

    scenes.forEach((sceneData) => {
      // Scene要素の作成
      const sceneElement = document.createElement("div");
      sceneElement.classList.add("scene");

      // アクティブなシーンの場合、activeクラスを追加
      if (sceneData.isActive) {
        sceneElement.classList.add("active");
      }

      const sceneNameElement = document.createElement("div");
      sceneNameElement.classList.add("scene-name");
      sceneNameElement.textContent = sceneData.name;
      sceneElement.appendChild(sceneNameElement);

      // Windows要素の作成
      const windowsContainer = document.createElement("div");
      windowsContainer.classList.add("windows");

      sceneData.windows.forEach((windowData) => {
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
          Editor.setData(sceneData.name, windowData);

          // イベント伝播を停止
          event.stopPropagation();
        });

        // ウィンドウ削除
        const confirmRemoveWindow = () => {
          const result = window.confirm(
            "ウィンドウを削除します。よろしいですか?"
          );
          if (result) {
            const sceneId = EditorProps.getCurrentSceneId();
            const windowId = EditorProps.getData().Id;
            const ok = getModel().removeWindow(sceneId, windowId);
            if (ok) {
              alert("削除に成功しました。");
            } else {
              alert("削除に失敗しました。");
            }
            Editor.buildEditorUI(sceneId, null);
            // Editor.ForceSendToParentWindow();
          } else {
            // pass
          }
        };
        const options = [
          { label: "削除", click: confirmRemoveWindow },
          { label: "下に移動", click: confirmRemoveWindow },
          // { label: "ゲームで開く", click: gotoScene },
        ];
        setUpContextMenu(windowElement, options);

        windowsContainer.appendChild(windowElement);
      });

      sceneElement.appendChild(windowsContainer);

      // Sceneクリック時のイベント（展開/折りたたみ）
      sceneElement.addEventListener("click", () => {
        sceneElement.classList.toggle("expanded");
      });

      // 現在エディタで編集中のシーンをゲームで開く
      const gotoScene = () => {
        const sceneId = sceneData.name;
        if (sceneId) {
          openScene(sceneId);
        }
      };

      // 現在ゲームで開いているシーンをこのシーンに上書きする
      const importGameScene = () => {
        const ok = confirm(
          "現在ゲームで開いているシーンをこのシーンに上書きします。よろしいですか？"
        );
        if (ok) {
          const sceneId = sceneData.name;
          const windowDataList = [];
          const sceneObj = getParentWindow().SceneManager._scene;
          const windowLayer = sceneObj._windowLayer;
          if (windowLayer && windowLayer.children) {
            windowLayer.children.forEach(function (win, i) {
              if (!win.createSCMData) {
                console.warn("データは生成できません", win, i);
                return;
              }
              const scmWinData = win.createSCMData();
              // dev
              if (win.constructor.name === "Window_Help") return;
              // if (win.constructor.name === "Window_BattleStatus")
              windowDataList.push(scmWinData);
            });
          }
          const sceneIndexString = getSceneIndexString(sceneId);

          let newSceneData = { ...defaultScene };
          newSceneData.Id = sceneObj.constructor.name;
          newSceneData.WindowList = windowDataList;
          getModel().param[sceneIndexString] = { ...newSceneData };
        } else {
          console.log("cancell");
          // pass
        }
      };

      const addWindow = () => {
        console.log("no");
      };
      const options = [
        { label: "ウィンドウの作成", click: addWindow },
        { label: "ゲームで開く", click: gotoScene },
        // { label: "ゲームで開いているシーンを読み込む", click: importGameScene }, // not work!
      ];
      setUpContextMenu(sceneElement, options);

      container.appendChild(sceneElement);
    });
    return container;
  }
}
