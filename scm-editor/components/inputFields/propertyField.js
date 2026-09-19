//@ts-check

import { setupScriptContextMenu } from "./drawItemScriptPresets.js";
import { populateSelect } from "../atoms/dynamicOptions.js";
import { createTooltip } from "../atoms/hoverTooltip.js";
import { setupWindowList } from "../atoms/dynamicOptions.js";
import { changeWindowId } from "../../src/apis/logic.js";
import { promptEx } from "./propModal.js";
import { getDefaultItem, getSubProps } from "../../user/parameters.js";
import { Editor } from "../../src/editor.js";
import { EditorProps } from "../../src/EditorProps.js";
import { CONFIG } from "../../user/editorConfig.js";
import { createToggleCategory } from "../atoms/toggleCategory.js";
import { createEditableCombobox } from "./editableComboBox.js";
import { createDraggableNumberInput } from "./draggableNumber.js";
import { ScriptInput } from "./scriptInput.js";
import { makeDragList } from "../atoms/dragList.js";
import { EditGroup } from "./EditGroup.js";

// Enum for property types to improve type checking and readability
const PropertyType = {
  BOOLEAN: "boolean",
  COLOR: "color",
  VARIABLE: "variable",
  SWITCH: "switch",
  COMMON_EVENT_ID: "common_event",
  NUMBER: "number",
  COMBO: "combo",
  SELECT: "select",
  STRING: "string",
  MULTILINE_STRING: "multiline_string",
  STRUCT_EVENT: "struct<Event>",
  STRUCT_PANORAMA: "struct<Panorama>",
  STRUCT_COMMAND_ARRAY: "struct<Command>[]",
  STRUCT_BUTTON_EVENT_ARRAY: "struct<ButtonEvent>[]",
  STRUCT_WINDOW_ARRAY: "struct<Window>[]",
  STRUCT_AUDIO_SE: "struct<AudioSe>",
  /* ---- */
  STRUCT_ANY: "struct<ANY>",
  STRUCT_ANY_ARRAY: "struct<ANY>[]",
  FILE: "file",
};

/**
 * Generate input field based on property type
 * @param {SCM_Data} scmData - Current window data
 * @param {PropOptions} options - Field generation options
 * @param {EditGroup} editGroup- callback
 * @returns {HTMLElement} Generated input field
 */
export class PropertyField {
  element;
  propPath = "";
  data = "";
  setData = (key, value) => {
    this.data = value;
    const event = new Event("change");
    event.data = { key, value };
    this.onChange(event);
  };
  onChange = (e) => {};
  constructor(scmData, options, editGroup) {
    // Enhanced this class with more robust methods

    const { text, param, defaultValue, propType, fieldType } = options;
    this.propPath = editGroup.propName + "." + param;
    // Create main field container

    this.element = document.createElement("div");
    this.element.classList.add(param);

    const flexTpes = ["Script", "WindowId", "WindowIdSelect", "WindowIdInput"];
    if (flexTpes.includes(fieldType)) {
      this.element.className = "edit-field-flex";
    }

    // Create label
    const labelDOM = document.createElement("label");
    labelDOM.textContent = text;
    labelDOM.className = "edit-label";

    createTooltip(labelDOM, options.desc || "");

    /** * DEV */
    labelDOM.addEventListener("click", (e) => {
      console.log(this.propPath);
    });

    ///////

    // Create input based on property type
    const inputDOM = this.createInputByType(scmData, options, labelDOM);

    //
    // 変更があるプロパティに*を表示する
    // const resetDOM = document.createElement("span");
    // resetDOM.textContent = "*";
    // resetDOM.classList.add("edit-reset");
    // const val = getValueByPath($scm.param, this.propPath);
    // if (val != defaultValue) {
    //   console.log(val);
    //   // labelDOM.classList.add("edit-hasDiff");
    //   labelDOM.prepend(resetDOM);
    // } else {
    //   // labelDOM.classList.remove("edit-hasDiff");
    // }

    // Append label and input to field
    this.element.appendChild(labelDOM);
    this.element.appendChild(inputDOM);

    // this.element.addEventListener("change", (e) => {
    //   editGroup.onFieldChange(e, this);
    // });
  }

  /**
   * Create input element based on property type
   * @param {SCM_Data} scmData - Current window data
   * @param {PropOptions} options - Field generation options
   * @param {HTMLLabelElement} labelDOM - Label element for potential styling
   * @returns {HTMLElement} Input element
   */
  createInputByType(scmData, options, labelDOM) {
    const { text, param, defaultValue, propType, contextMenu, select } =
      options;

    /** @type {HTMLElement} */
    let inputDOM = document.createElement("div");

    switch (propType) {
      // case PropertyType.STRUCT_ANY:
      //   const subProps = getSubProps(propType);
      //   inputDOM = this.createStructInput(
      //     scmData,
      //     param,
      //     options,
      //     subProps,
      //     defaultValue
      //   );
      //   labelDOM.style.display = "none";
      //   return inputDOM;
      case PropertyType.BOOLEAN:
        return this.createBooleanInput(scmData, param);
      case PropertyType.COLOR:
        return this.createColorInput(scmData, param, defaultValue, labelDOM);
      case PropertyType.COMMON_EVENT_ID:
      case PropertyType.VARIABLE:
      case PropertyType.SWITCH:
        return this.createIDInput(
          scmData,
          param,
          options,
          defaultValue,
          propType
        );
      case PropertyType.NUMBER:
        return this.createNumberInput(scmData, param, options, defaultValue);
      case PropertyType.SELECT:
        return this.createSelectInput(
          scmData,
          param,
          defaultValue,
          options.options
        );
      case PropertyType.COMBO:
        return this.createComboInput(
          scmData,
          param,
          options,
          defaultValue,
          contextMenu
        );
      case PropertyType.STRING:
        if (select === "windowId") {
          return this.createWindowIdSelectInput(scmData, param, defaultValue);
        } else if (options.fieldType === "windowId") {
          return this.createWindowIdInput(scmData, param, defaultValue);
        } else {
          return this.createStringInput(scmData, param, defaultValue);
        }
      case PropertyType.MULTILINE_STRING:
        return this.createStringInput(scmData, param, defaultValue);
      case PropertyType.STRUCT_AUDIO_SE:
      case PropertyType.STRUCT_PANORAMA:
      case PropertyType.STRUCT_EVENT:
        const subProps = getSubProps(propType);
        inputDOM = this.createStructInput(
          scmData,
          param,
          options,
          subProps,
          defaultValue
        );
        labelDOM.style.display = "none";
        return inputDOM;
      case PropertyType.STRUCT_BUTTON_EVENT_ARRAY:
        return this.createButtonArrayInput(
          scmData,
          param,
          propType,
          defaultValue,
          "Name"
        );
      case PropertyType.STRUCT_COMMAND_ARRAY:
        return this.createButtonArrayInput(
          scmData,
          param,
          propType,
          defaultValue,
          "Text"
        );
      case PropertyType.FILE:
        return this.createFileInput(scmData, param, options, defaultValue);
      // シーン編集画面でウィンドウは編集不可とする
      case PropertyType.STRUCT_WINDOW_ARRAY:
        return this.createButtonArrayInput(
          scmData,
          param,
          propType,
          defaultValue,
          "Id"
        );
      default:
        console.error("INVALID TYPE:", propType);
        return this.createDisabledInput();
    }
  }
  /**
   * Create boolean checkbox input
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createBooleanInput(windowData, param) {
    const inputDOM = document.createElement("input");
    inputDOM.className = "edit-checkbox";
    inputDOM.type = "checkbox";
    inputDOM.checked = windowData[param] === true;
    inputDOM.addEventListener("change", (e) => {
      this.setData(this.propPath, e.target.checked);
    });
    return inputDOM;
  }
  /**
   * テキストカラーの選択
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {number} defaultValue - 0-15までの整数値であり、ツクールのカラー番号に対応
   * @returns {HTMLElement} Generated input field
   */
  createColorInput(windowData, param, defaultValue, labelDOM) {
    const inputDOM = document.createElement("input");
    inputDOM.className = "edit-input";
    inputDOM.type = "number";
    inputDOM.value = windowData[param] || defaultValue;
    inputDOM.min = "0";
    inputDOM.max = "15";
    inputDOM.step = "1";
    inputDOM.addEventListener("change", (e) => {
      const val = e.target?.value;
      const colorCode = window.opener.ColorManager.textColor(val);
      labelDOM.style = `color:${colorCode};`;
      this.setData(this.propPath, val);
    });
    return inputDOM;
  }
  /** ツクールの変数、スイッチ、コモンイベントIDを入力する
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {PropOptions} options - Field generation options
   * @param {IDPropType} idPropType - 変数、スイッチ、コモンイベントIDのいずれか
   * @returns {HTMLElement} Generated input field
   */
  createIDInput(windowData, param, options, defaultValue, idPropType) {
    let selectOptions = [];

    // (なし) を最初に追加
    const nullOption = {
      value: "0",
      option: "(なし)",
    };

    if (idPropType === "common_event") {
      selectOptions = window.opener.$dataCommonEvents
        .filter((e) => !!e) // nullを除外
        .map((e) => ({
          value: e.id.toString(),
          option: `${e.id}: ${e.name}`,
        }));
    }

    if (idPropType === "switch") {
      selectOptions = window.opener.$dataSystem.switches
        .map((name, id) => ({ id, name }))
        .filter((s) => s.id > 0 && s.name) // ID0は無効
        .map((s) => ({
          value: s.id.toString(),
          option: `${s.id}: ${s.name}`,
        }));
    }

    if (idPropType === "variable") {
      selectOptions = window.opener.$dataSystem.variables
        .map((name, id) => ({ id, name }))
        .filter((v) => v.id > 0 && v.name) // ID0は無効
        .map((v) => ({
          value: v.id.toString(),
          option: `${v.id}: ${v.name}`,
        }));
    }

    // (なし) を最初に追加
    selectOptions.unshift(nullOption);

    return this.createSelectInput(
      windowData,
      param,
      defaultValue,
      selectOptions
    );
  }

  /**
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {PropOptions} options - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createNumberInput(windowData, param, options, defaultValue) {
    const { min } = options;
    const inputDOM = document.createElement("input");
    inputDOM.className = "edit-input edit-number";
    inputDOM.type = "number";
    inputDOM.value = windowData[param] || defaultValue;
    inputDOM.min = min || "0";
    inputDOM.step = "1";
    inputDOM.addEventListener("change", (e) => {
      /** @type {number} */
      // @ts-ignore
      let val = Number(e.target?.value) || 0;
      this.setData(this.propPath, val);
    });
    // 未実装
    const onChange = (e) => {
      console.log(e);
      // @ts-ignore
      let val = Number(e.target?.value) || 0;
      this.setData(this.propPath, val);
    };

    return createDraggableNumberInput(inputDOM, onChange);
  }

  /*
   * 既存のSelectコンポーネントとの互換性を保つためのラッパー関数
   * @param {Object} windowData - データオブジェクト
   * @param {string} param - データキー
   * @param {string|number} defaultValue - デフォルト値
   * @param {Array< string} selectOptions - 選択肢の配列
   * @returns {HTMLElement} 作成された編集可能なコンボボックス要素
   */
  createEditableSelectInput(windowData, param, defaultValue, selectOptions) {
    // selectOptionsの形式を変換 ({value, option} → {value, label})
    const options = selectOptions.map((item) => ({
      // value: item,
      // label: item,
      label: item.split("//")[1]?.trim() || item,
      value: item,
    }));

    const onChangeCallback = (param, value) => {
      this.setData(this.propPath, value);
    };

    const inputDOM = createEditableCombobox(
      windowData,
      param,
      defaultValue,
      options,
      onChangeCallback
    );
    // container.appendChild(inputDOM);
    return inputDOM;
  }

  /**
   * Create combo input with context menu
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {PropOptions} options - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createComboInput(windowData, param, options, defaultValue, contextMenu) {
    const { comboOptions, fieldType } = options;
    if (CONFIG.IS_COMBO_MODE && Array.isArray(comboOptions)) {
      const inputDOM = this.createEditableSelectInput(
        windowData,
        param,
        defaultValue,
        comboOptions || contextMenu || []
      );
      setupScriptContextMenu(inputDOM, contextMenu || []);
      return inputDOM;
    } else if (fieldType == "Script") {
      return new ScriptInput(this, {
        windowData,
        param,
        defaultValue,
        contextMenu,
      }).element;
    } else {
      const inputDOM = document.createElement("input");
      inputDOM.className = "edit-input";
      inputDOM.type = "text";

      inputDOM.value = Array.isArray(windowData[param])
        ? windowData[param].join("\n")
        : windowData[param] || defaultValue;
      setupScriptContextMenu(inputDOM, contextMenu || []);

      inputDOM.addEventListener("change", (e) => {
        let value = e.target.value;
        // 項目描画スクリプトは配列にする
        if (param === "ItemDrawScript") {
          value = value.split("\n").filter((line) => line.trim() !== "");
        }
        this.setData(this.propPath, value);
      });
      return inputDOM;
    }
    console.error("INVALID:");
    return this.createDisabledInput();
  }

  /**
   * Create a select input element
   * @private
   * @param {SCM_Data} windowData - データオブジェクト
   * @param {string} param - データキー
   * @param {Object} defaultValue - デフォルト値
   * @param {Array<{value: string, option: string}>} selectOptions - 選択肢の配列
   * @returns {HTMLSelectElement} 作成されたselect要素
   * @private
   */
  createSelectInput(windowData, param, defaultValue, selectOptions) {
    const inputDOM = document.createElement("select");
    inputDOM.className = "select-windowId";

    const opts = selectOptions.map((item) => ({
      value: item.value,
      label: item.option,
    }));

    populateSelect(inputDOM, opts);
    inputDOM.value = windowData[param] || defaultValue;

    inputDOM.addEventListener("change", (e) => {
      let value = e.target?.value || 0;

      // "null" -> null
      value = value === "null" ? null : value;

      // "0" -> 0
      if (!isNaN(value) && value.trim() !== "") {
        value = Number(value); // 数字に変換
      } else {
        // 数字ではない場合はそのまま文字列として保持
        value = value;
      }
      this.setData(this.propPath, value);
    });

    return inputDOM;
  }

  /**
   * テキスト入力
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createStringInput(windowData, param, defaultValue) {
    const inputDOM = document.createElement("input");

    inputDOM.className = "edit-input";
    inputDOM.type = "text";
    inputDOM.value = windowData[param] || defaultValue;
    inputDOM.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.setData(this.propPath, e.target.value);
      }
    });
    return inputDOM;
  }

  // ファイル入力
  /**
   * Create combo input with context menu
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {FileOptions} options - Field generation options
   * @param {string} defaultValue - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createFileInput(windowData, param, options, defaultValue) {
    const { dir } = options;
    const inputDOM = document.createElement("input");

    const path = require("path");
    const projectPath = path.dirname(process.mainModule.filename);

    inputDOM.className = "edit-input";
    inputDOM.type = "file";

    // 初期ディレクトリを指定
    const initialDir = path.join(projectPath, dir);
    inputDOM.setAttribute("nwworkingdir", initialDir);

    // 初期表示用に別途要素を追加（表示専用）
    const displaySpan = document.createElement("span");
    displaySpan.textContent = windowData[param] || defaultValue || "";

    // ファイル選択時
    inputDOM.addEventListener("change", (e) => {
      const fullPath = e.target.files[0]?.path || "";
      if (fullPath) {
        const relativePath = path
          .relative(initialDir, fullPath)
          .replace(/\\/g, "/");
        const fileNameWithoutExt = relativePath.split(".")[0];
        displaySpan.textContent = fileNameWithoutExt; // 選択したファイル名を表示
        this.setData(this.propPath, fileNameWithoutExt);
      }
    });
    // 取消ボタン
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.className = "cancel-button";
    cancelButton.addEventListener("click", () => {
      displaySpan.textContent = "";
      this.setData(this.propPath, "");
    });

    // ラッパーでinputと表示用spanをまとめる
    const wrapper = document.createElement("div");
    wrapper.appendChild(cancelButton);
    wrapper.appendChild(inputDOM);
    wrapper.appendChild(displaySpan);

    return wrapper;
  }

  // ウィンドウID
  /**
   * Create combo input with context menu
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createWindowIdInput(windowData, param, defaultValue) {
    const div = document.createElement("div");
    const inputDOM = document.createElement("input");
    inputDOM.className = "edit-input disable";
    inputDOM.type = "text";
    inputDOM.value = windowData[param] || defaultValue;

    const changeButton = document.createElement("input");
    changeButton.type = "button";
    changeButton.value = "変更";
    changeButton.addEventListener("click", (e) => {
      const oldId = inputDOM.value;
      var newId = prompt("ウィンドウIdを変更します。", oldId);
      if (newId) {
        const sceneId = EditorProps.getCurrentSceneId();
        changeWindowId(sceneId, oldId, newId);
        this.setData(this.propPath, newId);
        inputDOM.value = newId;
        // refresh window list
        const listWindowInputScene = document.getElementById("windowList");
        setupWindowList(sceneId, listWindowInputScene);
        listWindowInputScene.value = newId;
      } else {
        //cancel
      }
    });
    div.appendChild(inputDOM);
    div.appendChild(changeButton);
    return div;
  }

  /**
   * Create combo input with context menu
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @returns {HTMLElement} Generated input field
   */
  createWindowIdSelectInput(windowData, param, defaultValue) {
    const inputDOM = document.createElement("select");
    inputDOM.className = "select-windowId";
    const sceneId = EditorProps.getCurrentSceneId();
    // inputDOM.type = "select";
    setupWindowList(sceneId, inputDOM);

    // inputDOM.className = "edit-input";
    inputDOM.value = windowData[param] || defaultValue;
    inputDOM.addEventListener("change", (e) => {
      let value = e.target.value || "";
      // "null" -> null
      if (value == "null") value = null;
      this.setData(this.propPath, value);
    });
    return inputDOM;
  }

  /**
   * Create textarea for event struct
   * @param {SCM_Data} windowData - Current window data
   * @param {string} param - Field generation options
   * @param {PropOptions} options - Field generation options
   * @param {PropOptions[]} subPropList -
   * @param {SCM_Event} defaultValue -
   * @returns {PropFieldElement} Generated input field
   */
  createStructInput(windowData, param, options, subPropList, defaultValue) {
    /** @type {SCM_Event} */
    const eventData = { ...defaultValue, ...windowData[param] };
    const group = new EditGroup(eventData, this.propPath, subPropList);
    group.onChange = (e) => {
      {
        /** @type {Event} */
      }
      const newEventData = { ...eventData, ...e.data };
      this.setData(this.propPath, newEventData);
    };
    const { categoryDiv, categoryName } = createToggleCategory(
      group.element,
      options.text,
      param,
      EditGroup.depth
    );
    // console.log(categoryDiv);
    createTooltip(categoryName, options.desc || "");

    return categoryDiv;
  }

  /**
   * Creates an array input for buttons or commands
   * @param {SCM_Data} scmData - Window data object
   * @param {string} param - Parameter name
   * @param {SCM_Data[]} defaultValue - not in use
   * @param {Object} config - Configuration for the array input
   * @param {Object} config.properties - Properties configuration
   * @param {string} config.displayProp - Property to display on buttons
   * @param {SCM_Data} config.defaultItem - モーダルで初期化時に使用するデフォルト値
   * @param {boolean} [config.textMode=false] - Whether to use text mode instead
   * @returns {HTMLElement} The created input element
   */
  createArrayInput(scmData, param, defaultValue, config) {
    /**
     * @param {SCM_Data} _windowData
     * @param {string} _param
     * @param {SCM_Event[]} _commandList
     */
    const updateCommandList = (_windowData, _param, _commandList) => {
      this.setData(this.propPath, _commandList);
      Editor.refresh();
    };

    const { properties, displayProp } = config;

    const inputDOM = document.createElement("div");
    inputDOM.classList.add("edit-input");
    inputDOM.classList.add("edit-buttonArray");

    const commandsContainer = document.createElement("div");

    /** @type {SCM_Data[]} */
    const itemList = scmData[param] || [];

    // Create buttons for each item in the array
    const commandButtons = itemList.map((item, index) => {
      return this.createArrayItem(
        item,
        displayProp,
        properties,
        itemList,
        index,
        updateCommandList,
        scmData,
        param
      );
    });

    // Add all buttons to the container
    commandButtons.forEach((button) => {
      commandsContainer.appendChild(button);
    });

    /**
     * 追加時、初期で入っているデータ
     * @param {Object} defaultItem
     */
    const add_newButton = (defaultItem) => {
      $("<input>", {
        type: "button",
        class: "edit-button button-new",
        value: "追加",
      })
        .on("click", async () => {
          const result = await promptEx(defaultItem, this.propPath, properties);
          console.log(result);
          if (!result) return; // Cancelled

          const newItem = {
            ...defaultItem,
            ...result,
          };

          itemList.push(newItem);
          updateCommandList(scmData, param, itemList);
        })
        .appendTo(inputDOM);
    };

    /**
     * Handles swapping items in the array.
     * @param {any} _ - Unused parameter.
     * @param {number} from - Index of the item to move.
     * @param {number} to - Index to move the item to.
     */
    const onChange = (_ /**: any*/, from /**: number*/, to /**: number*/) => {
      // Swap items at indices 'from' and 'to'
      const tmp = itemList[from];
      itemList[from] = itemList[to];
      itemList[to] = tmp;
      updateCommandList(scmData, param, itemList);
      // Editor.refresh();
    };
    const dragList = makeDragList(commandsContainer, onChange).element;
    inputDOM.appendChild(dragList);

    if (param === "WindowList") {
      //シーン設定の編集ではウィンドウを追加できない
      //pass
    } else {
      // 「追加する」 ボタン
      add_newButton(config.defaultItem);
    }
    return inputDOM;
  }

  createArrayItem(
    item,
    displayProp,
    properties,
    itemList,
    index,
    updateCommandList,
    scmData,
    param
  ) {
    const propPath = `${this.propPath}[${index}]`;

    const inputDOM = document.createElement("input");
    inputDOM.type = "button";
    inputDOM.value = item[displayProp]; // Use the configured display property
    inputDOM.className = "edit-button";

    // Edit button handler
    inputDOM.addEventListener("click", async (e) => {
      if (param === "WindowList") {
        //シーン設定の編集ではウィンドウを編集できない
        return;
      }
      // DEV
      console.log(propPath);
      //
      const result = await promptEx(item, propPath, properties);
      if (!result) return; // Cancelled

      // Update the item with new values
      const updatedItem = { ...item, ...result };
      itemList[index] = updatedItem;
      updateCommandList(scmData, param, itemList);
    });

    // Right-click menu for deletion
    var menu = new nw.Menu();
    menu.append(
      new nw.MenuItem({
        label: "削除",
        click: function () {
          const updatedList = itemList.remove(item);
          updateCommandList(scmData, param, updatedList);
        },
      })
    );

    inputDOM.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      menu.popup(e.x, e.y);
      return false;
    });

    return inputDOM;
  }

  /**
   * コマンド、ボタン等
   * @param {SCM_Data} windowData
   * @param {string} param - Parameter name
   * @param {SCM_Data[]} defaultValue
   * @param {StructPropType} propType
   * @returns {HTMLElement} The created input element
   */
  createButtonArrayInput(
    windowData,
    param,
    propType,
    defaultValue,
    displayProp
  ) {
    const propList = getSubProps(propType);
    const defaultItem = getDefaultItem(propType);
    return this.createArrayInput(windowData, param, defaultValue, {
      defaultItem: defaultItem,
      properties: propList,
      displayProp: displayProp, // ボタンに表示するプロパティ名
    });
  }
  createDisabledInput() {
    const inputDOM = document.createElement("input");
    inputDOM.className = "edit-input disable";
    inputDOM.disabled = true;
    return inputDOM;
  }
}
