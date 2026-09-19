//@ts-check

/*=============================================================================
 SceneCustomMenuEditor.js
----------------------------------------------------------------------------
 Version
1.0.3 2025/07/01 Fixed a bug that occurred when the options configuration file was missing.
1.0.2 2025/06/30 Changed the behavior when saving.
1.0.1 2025/06/28 Second release.
1.0.0 2025/05/25 Initial release. */

/*:
 * @target MZ
 * @plugindesc Plugin for editing the parameters of the custom menu creation plugin SceneCustomMenu
 * @desc A plugin that allows you to edit the parameters of the custom menu creation plugin SceneCustomMenu.
 * @base PluginCommonBase
 * @base SceneCustomMenu
 * @orderAfter SceneCustomMenu
 * @author uynet
 *
 * @url https://studio-uy.booth.pm/items/6954068
 * @help SceneCustomMenuEditor.js
 *
 * This plugin allows you to edit the parameters of Triacontane's custom menu creation plugin "SceneCustomMenu" in real time.
 *
 * - Requirements
 * SceneCustomMenu (v1.52.1)
 * External editor (sold separately)
 *
 * Be sure to place this plugin directly below SceneCustomMenu in the plugin list.
 *
 * - About the External Editor
 * Place the included folder "scm-editor/" in the location specified by the plugin parameter "External Editor Path".
 * There is no need to register the external editor as a plugin.
 * The external editor is not required when releasing the game, so it can be safely removed after deployment.
 * - Save Data Specifications
 * The saved data is stored in the following location:
 * Save Location: data/scmData.json
 *
 * When this plugin is enabled, the plugin parameters of SceneCustomMenu will be disabled,
 * and the settings from this data file will be applied instead. 
 *
 * - About Scene Replacement
 * This plugin does not support the "Scene Replacement List" feature of SceneCustomMenu.
 * The settings configured in SceneCustomMenu for this feature will be applied as-is.
 *
 * @param editorEnable
 * @text Launch Editor on Startup
 * @desc Opens the editor screen when the game starts. If turned off, editing will not be available, but any previously changed settings will still be applied.
 * @default false
 * @type boolean
 *
 * @param editorPath
 * @text External Editor Path
 * @desc Specify the path to the required external editor.
 * @default debugger/scm-editor/editor.html
 * @type string
 *
 * @param hilightWindow
 * @text Highlight Selected Window
 * @desc Highlights the currently selected window while editing.
 * @default false
 * @type boolean
 *
 * @param touchSelect
 * @text Select Window by Clicking
 * @desc When a window is clicked, it will also be automatically selected in the external editor.
 * @default false
 * @type boolean
 *
 * @param showDevToolOnError
 * @text Open Developer Tools on Error
 * @desc Automatically opens the developer tools when an error occurs (e.g., in the "Item Drawing Script").
 * @default false
 * @type boolean
 *
 * @param SET_TITLE_ENABLE
 * @text Change Title While Editing
 * @desc Changes the window title while editing a scene.
 * @default true
 * @type boolean
 *
 * @command OPEN_EDITOR
 * @text Open External Editor
 * @desc Opens the external editor. This command will be disabled in the released version of the game.
 */


/*=============================================================================
 SceneCustomMenuEditor.js
----------------------------------------------------------------------------
 Version
 1.0.3 2025/07/1 オプション設定ファイルが無いときのバグを修正
 1.0.2 2025/06/30 保存時の挙動を変更
 1.0.1 2025/06/28 第二版
 1.0.0 2025/05/25 初版
 */

/*:ja
 * @target MZ
 * @plugindesc カスタムメニュー作成プラグインSceneCustomMenuのパラメータを編集するプラグイン
 * @desc カスタムメニュー作成プラグインSceneCustomMenuのパラメータを編集するプラグイン
 * @base PluginCommonBase
 * @base SceneCustomMenu
 * @orderAfter SceneCustomMenu
 * @author uynet
 *
 * @url https://studio-uy.booth.pm/items/6954068
 * @help SceneCustomMenuEditor.js
 *
 * トリアコンタンさんのカスタムメニュー作成プラグイン「SceneCustomMenu」のパラメータをリアルタイムに編集できるプラグインです。
 * ・動作要件
 * SceneCustomMenu(v1.52.1)
 * 外部エディタ(別売)
 *
 * 本プラグインは必ずSceneCustomMenuの直後に配置してください。
 *
 * ・外部エディターについて
 * プラグインパラメータ「外部エディターのパス」と対応する箇所に、同梱のフォルダscm-editor/を配置してください。
 * 「外部エディター」をプラグインとして登録する必要はありません。
 * 外部エディターはゲームのリリース時には不要ですので、デプロイメント後は削除して頂いて問題ありません。
 *
 * ・保存データについての仕様
 * 保存したデータは以下の場所に保存されています。
 * 保存場所 : data/scmData.json
 * 本プラグインを有効にした場合、SceneCustomMenuのプラグインパラメータが無効化され、この設定が適用されます。
 *
 * ・シーン差し替えについて
 * 本プラグインではSceneCustomMenuの「シーン差し替えリスト」に対応する機能がありません。こちらについてはSceneCustomMenuの設定がそのまま反映されます。
 *
 * @param editorEnable
 * @text 開始時にエディタを起動
 * @desc ゲーム開始時に編集画面が起動します。オフにした場合編集はできませんが、変更された設定は適用されます。
 * @default false
 * @type boolean
 *
 * @param editorPath
 * @text 外部エディターのパス
 * @desc 別途必用な外部エディターを指定してください。
 * @default debugger/scm-editor/editor.html
 * @type string
 *
 * @param hilightWindow
 * @text 選択ウィンドウのハイライト
 * @desc 編集中選択したウィンドウがハイライトされます。
 * @default false
 * @type boolean
 *
 * @param touchSelect
 * @text ウィンドウをクリックで選択
 * @desc ウィンドウをクリック時、外部エディタでも自動選択されます。
 * @default false
 * @type boolean
 *
 * @param showDevToolOnError
 * @text エラー時にデベロッパーツールを開く
 * @desc 「項目描画スクリプト」等のエラー時、デベロッパーツールが自動で開かれます。
 * @default false
 * @type boolean
 *
 * @param SET_TITLE_ENABLE
 * @text シーン編集中にタイトルを変更
 * @desc シーン編集中にウィンドウタイトルを変更します。
 * @default true
 * @type boolean
 *
 * @command OPEN_EDITOR
 * @text 外部エディターを開く
 * @desc 外部エディターを開きます。ただしリリース時にはこのコマンドは無効化されます。
 */

var $scm = null;

//////////////////////////////////////////////////////////////////////////////
// main
//////////////////////////////////////////////////////////////////////////////

(() => {
  /* ------------------ */
  // プラグインパラメータでは公開していないいくつかのパラメータです。
  // 必要に応じて以下のパラメータを設定できます。
  const IS_ACTIVE_ON_EDIT = true; // 外部エディタの編集時もアクティブにする
  const IS_REMEMBER = true; // 前回の表示位置でウィンドウを復元する
  const CONFIRM_ON_CLOSE = true; // 終了直前にアラートを出す

  const IS_FIX_ENEMY_LOADER = true; // 敵キャラクターの読み込みに関連する挙動の修正パッチ(競合などがあればこれをfalseにしてください)
  /* ------------------ */
  // 以下の設定は規定値を推奨します。
  const SCM_DATAFILE_NAME = "data/scmData.json"; // 保存先データののァイル名
  const DISABLE_BUZZER = true; // SceneCustomMenu本来の仕様であるエラー時のブザー音を無効化する
  const MAX_SCENES = 20; // シーン数
  const IS_ALERT_NODATA = true; // データファイルが無いときのアラートを表示

  // ここまで
  /* ------------------ */
  const SCM_EDITOR_VERSION = "1.0.3";
  const ALERT_NODATA_TEXT = `シーンデータファイル${SCM_DATAFILE_NAME}がありません。初期データが使用されます。`;

  const param = PluginManagerEx.createParameter(document.currentScript);
  const ORIGINAL_TITLE = window.document.title;
  const { SET_TITLE_ENABLE } = param;
  const HILIGHT_WINDOW = param.hilightWindow;

  // データが無いとき使用される初期値
  const DEFAULT_SCM_DATA = {
    Scene1: { Id: "" },
    Scene2: { Id: "" },
    Scene3: { Id: "" },
    Scene4: { Id: "" },
    Scene5: { Id: "" },
    Scene6: { Id: "" },
    Scene7: { Id: "" },
    Scene8: { Id: "" },
    Scene9: { Id: "" },
    Scene10: { Id: "" },
    Scene11: { Id: "" },
    Scene12: { Id: "" },
    Scene13: { Id: "" },
    Scene14: { Id: "" },
    Scene15: { Id: "" },
    Scene16: { Id: "" },
    Scene17: { Id: "" },
    Scene18: { Id: "" },
    Scene19: { Id: "" },
    Scene20: { Id: "" },
  };

  //////////////////////////////////////////////////////////////////////////////
  // Class
  //////////////////////////////////////////////////////////////////////////////
  class SCMModel {
    /** @type {SCM_Parameters} */
    param;
    /**
     * @param {SCM_Parameters} param
     */
    constructor(param) {
      this.param = param; // Serialized-Json
    }
    onLoadJson(jsonData) {
      // console.log(jsonData);
      try {
        const param = JsonEx.parse(jsonData);
        this.setParam(param);
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
    /**
     * @param {SCM_Parameters} scmParams
     */
    setParam(scmParams) {
      // console.log("set-param");
      this.param = scmParams;
      // $scm.param = createDeepProxy($scm.param); // ここでパラメータの変更を検出する(開発用)
    }
    /**
     * @param {SceneId} sceneId
     * @returns {number}
     */
    getSceneIndex(sceneId) {
      for (let i = 1; i <= MAX_SCENES; i++) {
        const sceneKey = `Scene${i}`;
        const scene = this.param[sceneKey];

        // シーンが空オブジェクトまたは存在しない場合はスキップ
        if (!scene || scene === "{}") continue;

        try {
          if (scene.Id) {
            if (scene.Id == sceneId) return i;
          }
        } catch (e) {
          console.warn(`Failed to parse scene: ${sceneKey}`, e);
        }
      }
      return -1;
    }

    /**
     * @param {SceneId} sceneId
     * @param {WindowId} windowId
     * @returns {SCM_Window[]|null }
     */
    removeWindow(sceneId, windowId) {
      // console.log(sceneId);
      const scene = { ...this.getSceneFromId(sceneId) };
      if (!scene) {
        return null;
      } else {
        const sceneIndex = this.getSceneIndex(sceneId);
        const newWindowList = (this.param["Scene" + sceneIndex].WindowList =
          scene.WindowList.filter((e) => e.Id !== windowId));
        return newWindowList;
      }
    }
    /**
     *
     * @returns {SceneId}
     */
    getCurrentSceneId() {
      // @ts-ignore
      return SceneManager._scene.constructor.name;
    }
    /**
     * @param {SceneId} sceneId
     * @param {number} fromIndex
     * @param {number} toIndex
     */
    // ウィンドウの入れ替え
    swapWindow(sceneId = this.getCurrentSceneId(), fromIndex, toIndex) {
      const winList = this.getWindowList(sceneId);
      if (
        !Array.isArray(winList) ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= winList.length ||
        toIndex >= winList.length
      ) {
        console.error(
          "ウィンドウの入れ替えに失敗しました:",
          fromIndex,
          toIndex
        );
        return winList;
      }
      [winList[fromIndex], winList[toIndex]] = [
        winList[toIndex],
        winList[fromIndex],
      ];
    }

    /**
     * @returns {SCM_Scene[]}
     */
    getSceneList() {
      const sceneList = [];
      for (let i = 1; i <= MAX_SCENES; i++) {
        const sceneKey = `Scene${i}`;
        const scene = this.param[sceneKey];

        try {
          if (scene.Id) {
            sceneList.push(scene.Id);
          }
        } catch (e) {
          console.warn(`Failed to parse scene: ${sceneKey}`, e);
        }
      }
      return sceneList;
    }

    /**
     * @param {SceneId} sceneId
     * @returns {SCM_Scene | null}
     */
    getSceneFromId(sceneId) {
      for (let i = 1; i <= MAX_SCENES; i++) {
        const sceneKey = `Scene${i}`;
        const scene = this.param[sceneKey];

        // シーンが空オブジェクトまたは存在しない場合はスキップ
        if (!scene || scene === "{}") continue;

        try {
          if (scene.Id) {
            if (scene.Id == sceneId) return scene;
          }
        } catch (e) {
          console.warn(`Failed to parse scene: ${sceneKey}`, e);
        }
      }
      return null;
    }
    /**
     * @param {SceneId} sceneId
     * @returns {SCM_Window[]}
     */
    getWindowList(sceneId) {
      const scene = this.getSceneFromId(sceneId);
      const windowList = scene?.WindowList || [];
      return windowList;
    }

    /**
     * @param {SceneId} sceneId
     * @returns {SCM_Window | null}
     */
    getWindowParamById(sceneId, windowId) {
      let sceneParam = this.getSceneParamById(sceneId);
      // TODO
      if (!sceneParam) {
        console.error("選択したウィンドウがシーンに存在しません。", sceneId);
        return null;
      }
      return sceneParam.WindowList.filter((e) => e.Id == windowId)[0];
    }
    /**
     * @param {SceneId} sceneId
     * @returns {SCM_Scene | null}
     */
    getSceneParamById(sceneId) {
      for (let i = 1; i <= MAX_SCENES; i++) {
        const sceneKey = `Scene${i}`;
        const sceneData = this.param[sceneKey];

        // シーンが空オブジェクトまたは存在しない場合はスキップ
        if (!sceneData || sceneData === "{}") continue;

        try {
          if (sceneData.Id == sceneId) return sceneData;
        } catch (e) {
          console.warn(`Failed to parse scene: ${sceneKey}`, e);
        }
      }
      return null;
    }
    /**
     * @param {SceneId} sceneId
     * @param {SCM_Window} windowParam
     */
    setWindowParam(sceneId, windowParam) {
      const oldWinParam = this.getWindowParamById(sceneId, windowParam.Id);

      SCM_Editor.states.HAS_NOT_SAVED_CHANGE = true;
      SCM_Editor.setWindowTitle();

      Object.assign(oldWinParam, windowParam);
      // console.log(this.param);
    }
    save() {
      // use fs
      const fs = require("fs");
      const data = JSON.stringify(this.param, null, 2); // 整形して保存
      const savePath = SCM_DATAFILE_NAME;
      fs.writeFile(savePath, data, (err) => {
        if (err) {
          console.error("Failed to save data:", err);
        } else {
          console.log("Data saved successfully:", savePath);
          SCM_Editor.states.HAS_NOT_SAVED_CHANGE = false;
          SCM_Editor.setWindowTitle();
        }
      });
    }
    load() {
      // load data from SCM_DATAFILE_NAME
      // use xhr
      const xhr = new XMLHttpRequest();
      xhr.open("GET", SCM_DATAFILE_NAME, true);
      xhr.overrideMimeType("application/json");
      xhr.onload = () => {
        if (xhr.status === 200) {
          const jsonData = xhr.responseText;
          this.onLoadJson(jsonData);
        } else {
          console.error("Failed to load JSON data:", xhr.statusText);
        }
      };
      xhr.onerror = () => {
        console.error("Network error while loading JSON data.");
        if (IS_ALERT_NODATA) {
          alert(ALERT_NODATA_TEXT);
        }
      };
      xhr.send();
    }

    /** ウィンドウのIdを変更し、参照のあるデータも置換する
     * @param {SceneId} sceneId
     * @param {WindowId} oldId
     * @param {WindowId} newId
     */
    changeWindowId(sceneId, oldId, newId) {
      const sceneData = this.getSceneFromId(sceneId);
      if (!sceneData) {
        console.error("INVALID ID:", sceneData);
      }
      {
        /** @type {SCM_Window} */
      }
      const oldWindow = SceneManager.findCustomMenuWindow(oldId);
      oldWindow._data.Id = newId;
      // TODO
      const newSceneData = JSON.parse(
        JSON.stringify(sceneData).replace(`"Id":"${oldId}"`, `"Id":"${newId}"`)
      );
      const sceneIndex = this.getSceneIndex(newSceneData.Id);
      this.param["Scene" + sceneIndex] = newSceneData;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Class
  //////////////////////////////////////////////////////////////////////////////
  class SCM_Editor {
    static states = {
      HAS_NOT_SAVED_CHANGE: false,
    };
    static pluginParam = param;
    static WINDOW_ID = "SCM_EDITOR_WINDOW";
    static subWindow = null; // as NwWindow

    static get isSubWindowValid() {
      // @ts-ignore
      return !!SCM_Editor.subWindow?.window;
    }

    static postMessage(message /** @type {SCM_MessageData} */) {
      if (!SCM_Editor.isSubWindowValid) {
        console.error("INVALID WINDOW");
        return;
      }
      SCM_Editor.subWindow.window.postMessage(message, "*");
    }

    static saveWindowState() {
      const win = SCM_Editor.subWindow;
      if (!win) return;
      SCM_Editor.subWindow = null;

      if (IS_REMEMBER) {
        SCM_Editor.saveWindowBounds(win);
      }

      if (CONFIRM_ON_CLOSE && SCM_Editor.states.HAS_NOT_SAVED_CHANGE) {
        if (!SCM_Editor.confirmCloseWithUnsavedChanges()) {
          return; // ユーザーがキャンセルした場合
        }
      }

      // @ts-ignore
      win.close(true); // trueを指定しないと無限ループになる
    }

    static saveWindowBounds(win) {
      const bounds = {
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      };
      localStorage.setItem("windowState", JSON.stringify(bounds));
    }

    static getWindowState() {
      const json = localStorage.getItem("windowState");
      return json ? JSON.parse(json) : null;
    }

    static confirmCloseWithUnsavedChanges() {
      const TEXT = "未保存の変更があります。終了しますか？";
      return window.confirm(TEXT);
    }

    static open(url = SCM_Editor.pluginParam.editorPath) {
      const state = SCM_Editor.getWindowState();
      const options = {};

      if (IS_REMEMBER && state) {
        if (state.width) options.width = state.width;
        if (state.height) options.height = state.height;
        if (state.x) options.x = state.x;
        if (state.y) options.y = state.y;
      }
      nw.Window.open(url, options, (win) => {
        SCM_Editor.subWindow = win;

        win.on("close", () => SCM_Editor.saveWindowState());
        win.on("closed", () => {
          SCM_Editor.subWindow = null;
          // ここで明示的なクリーンアップが必要なら記述
          // localStorage.removeItem(SCM_Editor.WINDOW_ID);
        });
      });
    }
    static setEditorWindowTitle() {
      const mark = SCM_Editor.states.HAS_NOT_SAVED_CHANGE ? "(*)" : "";
      const TITLE_EDITOR = `SCM_Editor ${SCM_EDITOR_VERSION}${mark}`;
      if (
        SCM_Editor.subWindow &&
        SCM_Editor.subWindow.window &&
        SCM_Editor.subWindow.window.document
      ) {
        SCM_Editor.subWindow.window.document.title = TITLE_EDITOR;
      }
    }

    static setWindowTitle() {
      this.setEditorWindowTitle();
      if (!SET_TITLE_ENABLE) return;

      const sceneId = SceneManager._scene?.constructor.name || "不明なシーン";
      const mark = SCM_Editor.states.HAS_NOT_SAVED_CHANGE ? "(*)" : "";
      document.title = `【編集シーン】${sceneId}${mark} `;
    }

    static hasFocus() {
      return SCM_Editor.subWindow?.window?.document?.hasFocus?.() ?? false;
    }
  }

  //-----------------------------------------------------------------------------
  // Util Functions
  //-----------------------------------------------------------------------------
  /** ウィンドウを選択時、エディタに送信する
   * @param {SCM_Window} windowData - メッセージ内容
   */
  function sendWindowData(windowData) {
    SceneManager._scene.setEditWindow?.(windowData?.Id ?? null);
    const messageData =
      /** @type {SCM_MessageData} */
      {
        type: "window",
        data: {
          sceneId: SceneManager._scene.constructor.name,
          windowData: windowData,
        },
      };
    SCM_Editor.postMessage(messageData);
  }

  function findClickedWindow(x, y) {
    const scene = SceneManager._scene;
    if (!scene?.children) return null;

    const windowLayer =
      scene.children.find((e) => e instanceof WindowLayer) ??
      scene._windowLayer;
    if (!windowLayer) return;
    return windowLayer.children.find((child) => {
      return (
        child.visible &&
        child.openness > 0 &&
        x >= child.x &&
        x < child.x + child.width &&
        y >= child.y &&
        y < child.y + child.height
      );
    });
  }
  // ウィンドウを右クリックでインスペクターで選択する
  // (標準UIのクリックと競合するため右にしている)
  function handleSceneClick(x, y) {
    const clickedWindow = findClickedWindow(x, y);
    // ウィンドウがクリックされた場合
    if (clickedWindow) {
      const data = clickedWindow._data;

      if (!data) {
        // console.warn(
        //   "カスタムメニューでないウィンドウが選択されました。",
        //   clickedWindow
        // );

        const data = null;
        sendWindowData(data);
        return;
      }

      sendWindowData(data);
    } else {
      // クリック対象がない場合
      sendWindowData(null);
    }
  }

  /**
   * @param {Window_CustomMenu} targetWindow
   * @param {SCM_Window} newData
   */
  function setTransForm(targetWindow, newData) {
    targetWindow._data = newData;
    // シーンを確実に再描画するが、負荷が重い(かもしれない)

    // // Transformはrefreshでは更新されないため、ゲーム中に明示的に再描画する
    targetWindow.x = newData.x;
    targetWindow.y = newData.y;
    targetWindow.width = newData.width || Graphics.boxWidth - newData.x;
    if (newData.height != 0) targetWindow.height = newData.height;
    targetWindow._isWindow = !newData.OverlapOther;

    // 0のときのみ明示的に再設定する必要がある
    if (newData.Rotation == 0) {
      targetWindow.rotation = 0;
    }

    // 更新時はウィンドウの開閉状態を初期化しない
    // if (targetWindow.isShowOpen() || !targetWindow.isValid()) {
    //   targetWindow.openness = 0;
    // }

    // 高さに0が指定された場合自動調整が有効になる
    targetWindow._dynamicHeight = newData.height === 0;

    // フレーム非表示の設定
    targetWindow.frameVisible = !newData.noFrame;
    targetWindow._backSprite.visible = !newData.noFrame;
    targetWindow._frameSprite.visible = !newData.noFrame;
    // SceneManager._scene.refresh();

    SceneManager._scene.setPlacement(newData);
    targetWindow.refresh();
  }
  SceneManager.setCustomTransform = setTransForm;
  /**
   * @param {Object} param
   * */
  function startEditor(param) {
    // テストプレー時以外は以降の機能を無効
    if (!Utils.isOptionValid("test")) return;
    SCM_Editor.open(param.editorPath);

    window.addEventListener("message", (event) => {
      const content = event.data;
      if (content.type == "setWindowParam") {
        // console.log("データが変更されました:", content.data);
        /** @type {SCM_Window} */
        const newData = content.data.windowData;
        const sceneId = content.data.sceneId; // 編集されたシーンのId

        $scm.setWindowParam(sceneId, newData);
        try {
          const targetWindow = SceneManager.findCustomMenuWindow(newData.Id);
          if (!targetWindow) {
            console.warn("選択したウィンドウが表示されていません。");
            return;
          }
          setTransForm(targetWindow, newData);
        } catch (e) {
          console.error("ウィンドウの描画に失敗しました", e);
        }
      } else if (content.type == "savePluginParams") {
        console.log("データを保存しました");
        $scm.save();
      } else {
        console.warn("INVALID EVENT:", event);
      }
    });

    if (param.touchSelect) {
      document.body.addEventListener("click", (event) => {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        handleSceneClick(x, y);
      });
    }
  }

  PluginManagerEx.registerCommand(
    document.currentScript,
    "OPEN_EDITOR",
    function (args) {
      if (SCM_Editor.isSubWindowValid) {
        console.warn("Editor is aleady open");
        return;
      }
      if (Utils.isOptionValid("test")) {
        startEditor(param);
      }
    }
  );

  //-----------------------------------------------------------------------------
  // EntryPoint
  //-----------------------------------------------------------------------------
  ("use strict");
  // $scm = new SCMModel({});
  $scm = new SCMModel(DEFAULT_SCM_DATA);
  $scm.load();

  // このparamは自身の設定
  // エディタの自動起動が有効の場合、エディタを起動する
  if (param.editorEnable && Utils.isOptionValid("test")) {
    startEditor(param);
  }

  //-----------------------------------------------------------------------------
  // Modify for SceneCustomMenu
  //-----------------------------------------------------------------------------

  /////////////////////////////
  // SceneCustomMenuで参照されるデータを独自セーブファイルのものに差し替える
  SceneManager.findSceneData = function (sceneId) {
    const sceneData = $scm.getSceneParamById(sceneId); // must be PluginParam Object
    if (!sceneData) {
      console.error(`シーンId${sceneId}が見つかりません。`);
      return {};
    }
    return sceneData;
    // const param = $scm.param;
    // return param.SceneList.filter((data) => data.Id === sceneId)[0];
  };

  // 外部エディタの編集時もアクティブにする
  if (IS_ACTIVE_ON_EDIT) {
    SceneManager.isGameActive = function () {
      // [Note] We use "window.top" to support an iframe.
      try {
        return window.top.document.hasFocus() || SCM_Editor.hasFocus();
      } catch (e) {
        // SecurityError
        return true;
      }
    };
  }

  // * ------------  * //
  // SceneCustomMenuでは標準でエラー時にブザー音が鳴るが、リアルタイム編集ではこれを無効化する。
  //
  // SceneCustomMenu.js // 1196行目
  // outputErrorでのスクリプトエラー時のブザー音、デベロッパーツールの無効設定
  // 呼び出し元関数名を指定し、その場合のみ即座にreturnする処理
  const disableFrom = ["outputError"];

  const disableMethodsOnError = (obj, method) => {
    const original = obj[method];
    obj[method] = function () {
      if (
        new Error().stack
          .split("\n")
          .some((line) => disableFrom.some((d) => line.includes(d)))
      ) {
        return; // 無効化
      }
      original.apply(this, arguments);
    };
  };

  // true
  if (DISABLE_BUZZER) disableMethodsOnError(SoundManager, "playBuzzer");
  if (!param.showDevToolOnError)
    disableMethodsOnError(nw.Window.get(), "showDevTools");
  // * ------------  * //

  //-----------------------------------------------------------------------------
  // Window選択時のハイライト表示処理
  //-----------------------------------------------------------------------------
  if (HILIGHT_WINDOW) {
    const _ = {};
    _.Scene_Base_initialize = Scene_Base.prototype.initialize;
    Scene_Base.prototype.initialize = function () {
      _.Scene_Base_initialize.apply(this, arguments);
      this._editWindow = null;
    };
    Scene_Base.prototype.setEditWindow = function (windowId) {
      if (this._editWindow) this._editWindow.setMenuEditTarget(false);
      const targetWindow = this._windowLayer.children.filter((win) => {
        return win?._data?.Id === windowId;
      })[0];
      if (targetWindow) {
        this._editWindow = targetWindow;
        this._editWindow.setMenuEditTarget(true);
        return targetWindow;
      } else {
        // どこでもない場所をクリックしたとき
        // console.error("INVALID ID", windowId);
        return null;
      }
    };

    Window_Base.prototype.setMenuEditTarget = function (value) {
      this._isMenuEditTarget = value;
      this.updateTone();
    };

    _.Window_Base_updateTone = Window_Base.prototype.updateTone;
    Window_Base.prototype.updateTone = function () {
      if (this._isMenuEditTarget) {
        if (!HILIGHT_WINDOW) return;
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0] + 100, tone[1], tone[2]);
      } else {
        _.Window_Base_updateTone.apply(this, arguments);
      }
    };

    _.Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function (rect) {
      _.Window_Base_initialize.apply(this, arguments);
      this._isMenuEditTarget = false;
    };
  }

  //-----------------------------------------------------------------------------
  // プラグイン特有の問題修正
  //----------------------------------------------------------------------------
  // 敵キャラクターの画像読み込みを修正
  if (IS_FIX_ENEMY_LOADER) {
    Window_CustomMenu.prototype.loadEnemyImage = function (item) {
      const battlerName =
        typeof item.battlerName === "function"
          ? item.battlerName() // 戦闘中の敵の場合($gameTopp.enemies)
          : item.battlerName; // データベースの敵キャラの場合
      if ($gameSystem.isSideView()) {
        return ImageManager.loadSvEnemy(battlerName);
      } else {
        return ImageManager.loadEnemy(battlerName);
      }
    };
    window.SCM_Editor = SCM_Editor;
  }
})();
