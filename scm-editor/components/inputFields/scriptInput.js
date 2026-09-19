//@ts-check

import { SyntaxTextArea } from "./codeEditor.js";
import { setupScriptContextMenu } from "./drawItemScriptPresets.js";
import { CONFIG } from "../../user/editorConfig.js";
import { handleSave } from "../../src/controllers/menubar.js";

export class ScriptInput {
  element;
  /**
   * @param {PropertyField} parent
   * @param {*} props
   */
  constructor(parent, props) {
    const { windowData, param, defaultValue, contextMenu } = props;
    this.element = createScriptInput.bind(parent)(
      windowData,
      param,
      defaultValue,
      contextMenu
    );
  }
}
/**
 * Create combo input with context menu
 * @param {SCM_Data} windowData - Current window data
 * @param {string} param - Field generation options
 * @param {string} defaultValue - Field generation options
 * @param {string[]} contextMenu
 * @returns {HTMLElement} Generated input field
 */
function createScriptInput(windowData, param, defaultValue, contextMenu) {
  const wrapperDOM = document.createElement("div");

  const inputDOM = document.createElement("textarea");
  inputDOM.className = "edit-textarea";

  // 改行を含むスクリプトを一行に変換
  const toOneliner = (value) => {
    return Array.isArray(value) ? value.join("\n") : value;
  };
  inputDOM.value = toOneliner(windowData[param] || defaultValue);
  setupScriptContextMenu(inputDOM, contextMenu || []);
  const validate = (value) => {
    return value.replace("\u200b", ""); // ゼロ幅スペースを削除
  };

  ////////////////////
  const handleChange = (value) => {
    console.log(value);
    // SceneCustomMenuの仕様上、項目描画スクリプトは1要素のみの配列にする。
    // 改行で分割した場合、変数宣言をするスクリプトが使えなくなるため。
    if (param === "ItemDrawScript") {
      // value = value.split("\n").filter((line) => line.trim() !== "");
      value = validate(value);
      value = [value];
      console.assert(
        Array.isArray(value) && value.length == 1,
        "INVALID:",
        value
      );
    }
    this.setData(this.propPath, value);
  };
  ////////////////////

  if (CONFIG.ENABLE_SYNTAX) {
    // シンタックスフィールド付きテキストエリアでは、ボタンによりゲームに反映される

    return createSyntaxTextArea();
  } else {
    return planeTextArea();
  }

  /* -------------------------- */
  function planeTextArea() {
    inputDOM.addEventListener("change", (e) => {
      handleChange(e.target.value);
    });
    wrapperDOM.appendChild(inputDOM);
    return wrapperDOM;
  }
  /* -------------------------- */
  function createSyntaxTextArea() {
    const props = {
      value: windowData[param] || defaultValue,
      textarea: inputDOM,
    };
    const syntaxTextArea = new SyntaxTextArea(props);
    setupScriptContextMenu(wrapperDOM, contextMenu || []);

    // スクリプト保存にファイルも保存する
    const IS_SAVE_GLOBAL = true;

    const execureButton = document.createElement("button");
    execureButton.textContent = "保存";
    execureButton.classList.add("execute-button");
    execureButton.addEventListener("click", (e) => {
      syntaxTextArea.save();
      if (IS_SAVE_GLOBAL) {
        handleSave();
      }

      const value = syntaxTextArea.getValue();
      console.log("execute", value);
      handleChange(value);
    });
    wrapperDOM.appendChild(syntaxTextArea.element);
    wrapperDOM.appendChild(execureButton);
    wrapperDOM.addEventListener("change", (e) => {
      // const value = syntaxTextArea.getValue();
      syntaxTextArea.save();
      const value = syntaxTextArea.getValue();
      console.log("change", value);
      handleChange(value);
    });

    return wrapperDOM;
  }
}
