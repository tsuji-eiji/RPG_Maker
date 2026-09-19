//@ts-check

import {
  getSceneIndexString,
  getWindowIndex,
  sendToParentWindow,
} from "../../src/apis/logic.js";
import { EditorProps } from "../../src/EditorProps.js";
import { genTabs } from "../../src/helpers.js";
import { advanceOptions } from "../../user/advanceOptions.js";
import { CONFIG } from "../../user/editorConfig.js";
import { editGroupsConfig } from "../../user/parameters.js";
import { createTabUI } from "../atoms/tabContainer.js";
import { EditGroup } from "../inputFields/EditGroup.js";
import { windowHeader } from "./windowHeader.js";

// API
function ForceSendToParentWindow() {
  sendToParentWindow(EditorProps.getCurrentSceneId(), EditorProps.getData());
}

/**
 * Creates editable groups of properties for a given window configuration.
 *
 * @param {Object} params - The parameters object.
 * @param {Array<Object>} params.editGroupsConfig - Array of group configurations, each containing a title and a list of properties.
 * @param {Object} params.windowData - The data object representing the current window being edited.
 * @returns {Array<HTMLElement>} An array of DOM elements representing the editable property groups.
 */
const createEditGroups = ({ editGroupsConfig, windowData }) => {
  return editGroupsConfig.map(({ title, properties }) => {
    // 高度な設定を除くプロパティ
    if (!CONFIG.ADVANCE_OPTIONS) {
      properties = properties.filter(
        (prop) => !advanceOptions.includes(prop.param)
      );
    }

    const sceneId = EditorProps.getCurrentSceneId();
    const sceneIndexString = getSceneIndexString(sceneId); // "Scene1~Scene20 str"
    const windowIndex = getWindowIndex(sceneId, windowData.Id);
    const propPath = `${sceneIndexString}.WindowList[${windowIndex}]`;

    const groups = new EditGroup(windowData, propPath, properties);
    // // 変更時、ゲームを更新する
    groups.onChange = (e) => {
      console.log(e.data);
      const oldWinData = EditorProps.getData();
      const newWindowData = { ...oldWinData, ...e.data };
      EditorProps.windowData = newWindowData;
      ForceSendToParentWindow();
    };

    return groups.element;
  });
};

/**
 * Generate input field based on property type
 * @param {SCM_Window} windowData
 * @returns {HTMLElement}
 */
function createEditorSection(windowData) {
  const editorSection = document.createElement("div");
  editorSection.id = "param-editor";
  editorSection.className = "editor-section";

  if (windowData == null) {
    console.log("no window");
    editorSection.appendChild(windowHeader("no window"));
    // return;
    return editorSection;
  } else {
    const windowId = EditorProps.getData().Id;
    const text = "ウィンドウId" + " : " + windowId;
    editorSection.appendChild(windowHeader(text));
  }

  // 編集グループの作成
  const editGroups = createEditGroups({ editGroupsConfig, windowData });
  const editTab = genTabs(editGroups, editGroupsConfig);
  editorSection.appendChild(editTab);
  return editorSection;
}

export class EditorSection {
  element = document.createElement("div");
  constructor(props) {
    const { windowData } = props;
    this.element = createEditorSection(windowData);
  }
}
