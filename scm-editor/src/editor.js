// @ts-check

import {
  getSceneIndex,
  getSceneFromId,
  getCurrentSceneId,
  setEditWindow,
  setGameActive,
  openScene,
  editSceneData,
  getModel,
  getSceneIndexString,
  reloadScene,
} from "./apis/logic.js";

import {
  setupSceneList,
  setupWindowList,
} from "../components/atoms/dynamicOptions.js";
import { sceneProperties } from "../user/parameters.js";
import { defaultScene, defaultWindow } from "../user/defaultScene.js";
import { promptEx } from "../components/inputFields/propModal.js";
import { CONFIG } from "../user/editorConfig.js";
import { EditorProps } from "./EditorProps.js";
import { EditorSection } from "../components/editor/editorSection.js";

// Centralized scene and window management
export class Editor {
  /**
   *
   * @param {HTMLSelectElement} sceneSelector
   * @returns
   */
  static setupSceneSelection(sceneSelector) {
    setupSceneList(sceneSelector);
    /**
     * @param {Event} e
     * @returns
     */
    function handleSceneSelect(e) {
      const sceneIndex = e.target?.value;
      const sceneId = getModel().param[sceneIndex]?.Id; // not getCurrentSceneId();
      if (sceneIndex == "") {
        $("#window-settings").removeClass("enable").addClass("disable");
        $("#sceneNameLabel").text("(シーンを選択してください)");
        $("#sceneList").val("");
        $("#windowList").prop("selectedIndex", 0);

        Editor.buildEditorUI(null, null);
        return;
      }
      if (!sceneId) {
        // console.log(sceneIndex);
        /* ---- */
        // closeScene();
        $("#window-settings").removeClass("enable").addClass("disable");
        $("#sceneNameLabel").text(sceneIndex);
        $("#sceneList").val(sceneIndex);
        $("#windowList").val(null);

        Editor.buildEditorUI(null, null);
      } else {
        // 既存シーンを選択しウィンドウを開く
        $("#window-settings").removeClass("disable").addClass("enable");
        const windowList = getModel()?.param?.[sceneIndex]?.WindowList;
        const windowData = windowList?.[0] || null;

        Editor.setData(sceneId, windowData);
        if (CONFIG.AUTO_SCENE_SELECT) openScene(sceneId);
      }
    }
    sceneSelector.addEventListener("change", (e) => {
      handleSceneSelect(e);
    });
  }
  static refresh() {
    const sceneId = EditorProps.getCurrentSceneId();
    const windowData = EditorProps.getData();

    /** @type {SceneIndexString} */
    const sceneIndex = $("#sceneList")[0].value; // "Scene1~Scene20 str"

    setupSceneList($("#sceneList")[0]);
    $("#sceneList")[0].value = sceneIndex;

    Editor.buildEditorUI(sceneId, windowData);
  }
  static setData(sceneId, windowData) {
    const sceneLabel = document.getElementById("sceneNameLabel");
    sceneLabel.innerText = sceneId;

    const sceneSelector = document.getElementById("sceneList");
    const idx = getSceneIndex(sceneId);
    sceneSelector.value = `Scene${idx}`;
    // console.log("init", idx);

    const listWindowInputScene = document.getElementById("windowList");
    setupWindowList(sceneId, listWindowInputScene);
    listWindowInputScene.value = windowData?.Id || null;

    Editor.buildEditorUI(sceneId, windowData);
  }

  /**
   * Generate input field based on property type
   * @param {SceneId|null}sceneId
   * @param {SCM_Window|null} windowData
   * @returns
   */
  static buildEditorUI(sceneId, windowData) {
    // console.log(windowData);
    EditorProps.setCurrentScene(sceneId, windowData);
    // 既存の編集UIがあれば削除
    const existingEditor = document.getElementById("param-editor");
    if (existingEditor) {
      existingEditor.remove();
    }
    if (sceneId == null) {
      // return;
    }

    // const editorSection = Editor.createEditorSection(windowData);
    const editorSection = new EditorSection({ windowData }).element;
    document.querySelector(".container").appendChild(editorSection);
  }

  //////////////////////////////////////////////////
  static init() {
    const sceneSelector = document.getElementById("sceneList");
    Editor.setupSceneSelection(sceneSelector);

    const listWindowInputScene = document.getElementById("windowList");
    listWindowInputScene.addEventListener("change", (e) => {
      let windowId = e.target.value;
      // TODO
      if (windowId === "null") windowId = null;
      const sceneId = EditorProps.getCurrentSceneId();
      const windowData = getModel().getWindowParamById(sceneId, windowId);
      Editor.buildEditorUI(sceneId, windowData);
      // ゲーム側でウィンドウを選択
      setEditWindow(windowData.Id);
      // Editor.initializeSceneEditor(sceneId, windowData);
    });
    // 高度な設定
    $("#advanceOptions").on("click", (e) => {
      CONFIG.ADVANCE_OPTIONS = e.target.checked;
      console.log(e.target.checked);
      Editor.refresh();
    });
    // ゲームの停止設定
    setGameActive(CONFIG.GAME_PROCESS_MODE);
    $("#gameMode").on("change", (e) => {
      CONFIG.GAME_PROCESS_MODE = e.target.checked;
      setGameActive(CONFIG.GAME_PROCESS_MODE);

      Editor.refresh();
    });

    $("#sceneReloadButton").on("click", () => {
      // 現在エディタで編集中のシーンをゲームで開く
      reloadScene();
    });

    // Add ctrl+R shortcut to reload the scene
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault(); // Prevent the default browser reload
        reloadScene();
      }
    });

    // 現在ゲームで実行中のシーンをエディタで表示する
    $("#sceneEditButton").on("click", () => {
      const gameSceneId = getCurrentSceneId();
      // Editor.buildEditorUI(gameSceneId, {});
      Editor.setData(gameSceneId, {});
    });

    // ウィンドウ削除
    $("#deleteWindowButton").on("click", async () => {
      const result = window.confirm("ウィンドウを削除します。よろしいですか?");
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
    });

    // SWAP WINDOW
    // $("#swapUp").on("click", async () => {
    //   const result = window.confirm("上のウィンドウと入れ替えます(未実装)");
    //   if (result) {
    //     const sceneId = EditorProps.getCurrentSceneId();
    //     const winList = getWindowList(sceneId);
    //     console.log(winList);
    //     // const windowId = EditorProps.getData().Id;
    //     // const ok = getModel().removeWindow(sceneId, windowId);
    //     // if (ok) {
    //     //   alert("削除に成功しました。");
    //     // } else {
    //     //   alert("削除に失敗しました。");
    //     // }
    //     // Editor.buildEditorUI(sceneId, null);
    //     // Editor.ForceSendToParentWindow();
    //   } else {
    //     // pass
    //   }
    // });

    // ウィンドウの新規作成
    $("#addWindowButton").on("click", async () => {
      const newWindowData = { ...defaultWindow };
      const newWindowId = prompt(
        "新規ウィンドウを作成します。シーン内で重複しないIdを入力してください"
      );
      // const newWindow = await promptEx(newWindowData, windowProperties);
      if (!newWindowId || newWindowId == "null") {
        alert("IDが不正です。");
        return;
      }
      console.log(newWindowId);
      newWindowData.Id = newWindowId;

      const sceneIndex = $("#sceneList")[0].value;
      const sceneData = getModel().param[sceneIndex];
      sceneData.WindowList.push(newWindowData);
      const sceneId = EditorProps.getCurrentSceneId();
      Editor.buildEditorUI(sceneId, newWindowData);
      Editor.setData(sceneId, newWindowData);
    });
    const handleSceneSetting = async () => {
      const props = sceneProperties;
      const sceneId = EditorProps.getCurrentSceneId();
      let sceneData = getSceneFromId(sceneId);
      if (!sceneData) {
        console.log("シーンがありません。初期します。");
        sceneData = defaultScene;
        const sceneIndex = $("#sceneList")[0].value;
        sceneData.Id = sceneIndex;
      }
      /** @type {SceneIndexString} */
      const sceneIndexString = getSceneIndexString(sceneId); // "Scene1~Scene20 str"
      const result = await promptEx(sceneData, sceneIndexString, props);
      if (!result) {
        console.log("シーンの設定をキャンセル");
        return; // キャンセル
      }
      console.log(result);
      return { ...sceneData, ...result };
    };
    // シーン設定
    $("#sceneSettingButton").on("click", async () => {
      const updatedSceneData = await handleSceneSetting();
      if (updatedSceneData) {
        // const oldSceneData = getSceneFromId(EditorProps.getCurrentSceneId());
        // console.log(updatedSceneData);
        const sceneIndex = $("#sceneList")[0].value; // "Scene1~Scene20 str"
        editSceneData(sceneIndex, updatedSceneData);
      } else {
        console.log("シーンの保存がキャンセルされました");
        //cancel
      }
    });

    // const replaceMentList = JSON.stringify(getModel().param.ReplacementList);
    // // 差し替えリスト
    // $("#replaceList")[0].value = replaceMentList;
    // $("#replaceList").on("change", (e) => {
    //   const val = e.target.value;
    //   getModel().param.ReplacementList = JSON.parse(val);
    // });

    // シーン設定の保存
    function handleSceneMessage(event) {
      if (event.data.type === "sceneSaved") {
        handleSceneSaved(event.data.sceneData);
      } else if (event.data.type === "sceneCanceled") {
        // シーン設定の保存キャンセル
      }
      Editor.refresh();
    }
    function handleSceneSaved(updatedSceneData) {
      const parseKeys = [
        "Panorama",
        "UseHelp",
        "InitialEvent",
        "ActorChangeEvent",
        "WindowList",
      ];

      parseKeys.forEach((key) => {
        if (updatedSceneData[key]) {
          updatedSceneData[key] = JSON.parse(updatedSceneData[key]);
        }
      });

      // const oldSceneData = getSceneFromId(EditorProps.getCurrentSceneId());
      const sceneIndex = $("#sceneList")[0].value; // "Scene1~Scene20 str"
      const oldSceneData = getModel().param[sceneIndex];

      Object.assign(oldSceneData, updatedSceneData);
      Editor.setData(updatedSceneData.Id, oldSceneData.WindowList?.[0] || {});
      // シーン選択を
      const sceneSelector = document.getElementById("sceneList");
      setupSceneList(sceneSelector);
      // console.log(sceneIndex);
      sceneSelector.value = sceneIndex;
    }
    window.addEventListener("message", handleSceneMessage);

    // const container = $("#page-container")[0];
    // const cleanup = createDraggableSeparator(container, {
    //   direction: "horizontal", // 水平方向
    //   minFirstPaneSize: 100, // 最小の左ペインサイズ
    //   minSecondPaneSize: 100, // 最小の右ペインサイズ
    // });
    // window.CONFIG = CONFIG;
    // window.Editor = Editor;
    // window.EditorProps = EditorProps;
    // window.promptEx = promptEx;
  }
}
