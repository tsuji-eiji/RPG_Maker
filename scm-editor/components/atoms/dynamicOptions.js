// @ts-check

import { getWindowList } from "../../src/apis/logic.js";

export function populateSelect(select, options) {
  // 一度クリア
  select.innerHTML = "";
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  });
}
export function setupSceneList(target) {
  const listOptions = [{ value: "", label: "(選択されていません)" }];
  for (let i = 1; i <= 20; i++) {
    const sceneIndex = `Scene${i}`;
    const sceneId = window.opener.$scm.param[sceneIndex]?.Id || "(新規作成)";
    const label = sceneIndex + "  :  " + sceneId;
    listOptions.push({ value: sceneIndex, label: label });
  }
  populateSelect(target, listOptions);
}

export function setupWindowList(sceneId, target) {
  // const listOptions = [];
  const listOptions = [{ value: null, label: "(なし)" }];
  const windowList = getWindowList(sceneId);
  const winIds = windowList.map((w) => w.Id);
  winIds.forEach((id) => {
    listOptions.push({ value: id, label: id });
  });

  // if (listOptions.length == 0) {
  //   listOptions.push[{ value: null, label: "(ウィンドウがありません)" }];
  // }
  populateSelect(target, listOptions);
}
export function genListWindowInput(sceneId, windowData) {
  const listWindowInput = document.createElement("select");

  // シーン内の選択可能なウィンドウ一覧を表示
  listWindowInput.addEventListener("focus", (e) => {
    setupWindowList(sceneId, e.target);
  });
  listWindowInput.addEventListener("change", (e) => {
    // console.log(e.target.value);
  });

  setupWindowList(sceneId, listWindowInput);
  listWindowInput.value = windowData.ListWindowId;
  return listWindowInput;
}
