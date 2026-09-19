// @ts-check
import { EditGroup } from "./EditGroup.js";

/**
 * @typedef {Object} ModalOptions
 * @property {boolean} [closeOnOverlayClick=true] - オーバーレイクリックで閉じるか
 * @property {string} [closeButtonText="×"] - 閉じるボタンのテキスト
 * @property {string} [width="auto"] - モーダルの幅
 * @property {string} [height="auto"] - モーダルの高さ
 * @property {function(HTMLElement):void} [onOpen=null] - 開く時のコールバック
 * @property {function(boolean):void} [onClose=null] - 閉じる時のコールバック
 * @property {HTMLElement} [parent=null] - モーダルを配置する親要素（デフォルトはbody）
 */
/**
 * モーダルを表示する関数
 * @param {HTMLElement} domElement - モーダルに表示する要素
 * @param {ModalOptions} [options={}] - オプション設定
 * @returns {{ element: HTMLDialogElement, open: () => void, close: () => void, destroy: () => void }}
 */
function showModalFromDOM(domElement, options = {}) {
  // デフォルトオプション
  const defaultOptions = {
    closeOnOverlayClick: true,
    closeButtonText: "×",
    width: "auto",
    height: "auto",
    onOpen: null,
    onClose: null,
    parent: null,
  };

  // オプションのマージ
  const settings = { ...defaultOptions, ...options };
  const parentElement = settings.parent || document.body;

  // 既存のモーダルを削除（存在する場合）
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }
  // ダイアログ要素の作成
  const dialog = document.createElement("dialog");
  dialog.style.width = settings.width;
  dialog.style.height = settings.height;
  parentElement.appendChild(dialog);

  dialog.appendChild(domElement);

  //　オーバーレイクリックで閉じる設定
  if (settings.closeOnOverlayClick) {
    dialog.addEventListener("mousedown", (e) => {
      if (e.target === dialog) {
        close(false);
      }
    });
  }

  // モーダルを開く関数
  function open() {
    dialog.showModal();
    // onOpen コールバック
    if (typeof settings.onOpen === "function") {
      settings.onOpen(domElement);
    }
  }

  // モーダルを閉じる関数
  function close(IS_OK) {
    dialog.close();
    if (typeof settings.onClose === "function") {
      settings.onClose(IS_OK);
    }
  }
  // ダイアログの削除
  function destroy() {
    parentElement.removeChild(dialog);
  }

  // エスケープキーでの閉じる処理をカスタマイズ
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close(false);
  });

  return {
    element: dialog,
    open,
    close,
    destroy,
  };
}

/**
 * @param {SCM_Data} data - Current window data
 * @param {string} propPath - Property path to be edited
 * @param {PropOptions[]} propList
 * @param {ModalOptions} modalOptions
 */
export async function promptEx(
  data,
  propPath,
  propList = [],
  modalOptions = {}
) {
  /** @type {SCM_Data} */
  let resultData = { ...data };
  return new Promise((resolve, reject) => {
    // const contentDOM = createEditGroup(data, propList);
    console.assert(propPath, "propPath is undefined");
    console.log(propPath);
    const gropus = new EditGroup(data, propPath, propList); // arg2 is dummy Title
    gropus.onChange = (e) => {
      resultData = { ...resultData, ...e.data };
      console.log(resultData);
    };
    const contentDOM = gropus.element;

    const Buttons = document.createElement("div");

    Buttons.style.display = "flex";
    Buttons.style.justifyContent = "center";
    Buttons.style.gap = "20px";
    const okButton = $("<div>").html("<button>決定</button>").appendTo(Buttons);

    // キャンセルボタン
    const cancelBtn = $("<div>")
      .html("<button>キャンセル</button>")
      .appendTo(Buttons);
    contentDOM.append(Buttons);

    const defaultOptions = {
      width: "500px",
      onOpen: (element) => {
        // open
        // ModalProps.init();
      },
      onClose: (IS_OK = true) => {
        if (!IS_OK) {
          console.log("rejected");
          reject();
        } else {
          // close
          // resolve(ModalProps.getData());
          console.log(resultData);
          resolve(resultData);
        }
        // ModalProps.init();
      },
    };

    const options = { ...defaultOptions, ...modalOptions };

    const modal1 = showModalFromDOM(contentDOM, options);
    okButton.on("click", (e) => {
      modal1.close();
      return false;
    });
    cancelBtn.on("click", (e) => {
      modal1.destroy();
      resolve(null);
      return false;
    });
    modal1.open();
    // openPopupWindow(modal1.element, {});
  });
}
