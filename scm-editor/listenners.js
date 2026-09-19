//@ts-check

import { simulateKeyInput } from "./src/controllers/virtualInput.js";
import { Editor } from "./src/editor.js";
import { CONFIG } from "./user/editorConfig.js";

export function initListenners() {
  window.addEventListener("message", (event) => {
    /** @type {SCM_MessageData} */
    const content = event.data;
    if (content.type == "window") {
      const { sceneId, windowData } = content.data;
      Editor.setData(sceneId, windowData);
      // promptEx(windowData, "",allWindowProperties, {}); // ウィンドウをクリック時に開く
    } else if (content.type == "windowSelectedFromTree") {
      const { sceneId, windowData } = content.data;
      Editor.setData(sceneId, windowData);
    } else {
      console.error("INVARID EVENT:", event);
    }
  });

  // キーダウンイベントで親ウィンドウに仮想入力
  window.addEventListener("keydown", (e) => {
    // console.log(`子ウィンドウ: ${e.key}`);

    if (window.opener && !window.opener.closed) {
      if (CONFIG.VIRTUAL_INPUT) simulateKeyInput(e, true); // 仮想入力ON
    }
  });

  // キーアップイベントで仮想入力解除
  window.addEventListener("keyup", (e) => {
    if (window.opener && !window.opener.closed) {
      if (CONFIG.VIRTUAL_INPUT) simulateKeyInput(e, false); // 仮想入力OFF
    }
  });

  /////////////////////////////////////
  const win = nw.Window.get();
  //////////////////
  // F5 realod
  win.window.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
      console.log("F5");
      win.reload();
    }
  });
}
