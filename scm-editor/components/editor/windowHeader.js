//@ts-check

import { EditorProps } from "../../src/EditorProps.js";

export function windowHeader(windowName) {
  const group = document.createElement("div");
  group.className = "edit-group";
  const title = document.createElement("h3");
  title.textContent = windowName;

  const sceneId = EditorProps.getCurrentSceneId();
  const sceneTitle = document.createElement("h3");
  sceneTitle.textContent = sceneId;

  // const statusLabel = document.createElement("div");
  // const isOpenInGame = getCurrentSceneId() == sceneId; //　ゲームで実行中のシーンと一致しているか
  // statusLabel.textContent = isOpenInGame
  //   ? "表示中"
  //   : "ゲームで表示されていません";
  // statusLabel.className = "editor-statusLabel";
  // statusLabel.className += " ";
  // statusLabel.className += isOpenInGame ? "status-active" : "status-deactive";

  group.appendChild(sceneTitle);
  group.appendChild(title);
  // group.appendChild(statusLabel);
  return group;
}
