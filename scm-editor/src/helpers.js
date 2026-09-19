//@ts-check

import { createTabUI } from "../components/atoms/tabContainer.js";

export const getValueByPath = (obj, path) => {
  return path
    .replace(/\[(\w+)\]/g, ".$1") // "arr[0]" → "arr.0"
    .split(".")
    .reduce((o, key) => o?.[key], obj);
};

// export class DOMHelper {
//   static updateSceneLabel(text) {
//     document.getElementById("sceneNameLabel").innerText = text;
//   }

//   static toggleWindowSettings(enabled) {
//     const element = document.getElementById("window-settings");
//     element.classList.toggle("enable", enabled);
//     element.classList.toggle("disable", !enabled);
//   }
// }

// タブUIの作成
/**
 * Generates a tabbed UI component based on the provided edit groups.
 *
 * @param {Array<HTMLElement>} domArray - An array of edit group contents to be displayed in each tab.
 * @returns {HTMLElement} The rendered tab UI component.
 */
export const genTabs = (domArray, tabOption) => {
  const tabs = tabOption.map((group, index) => ({
    title: group.title,
    content: domArray[index],
  }));

  return createTabUI(tabs);
};
