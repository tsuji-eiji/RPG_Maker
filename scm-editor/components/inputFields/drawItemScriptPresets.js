/**
 * one linerのスクリプトからコメントの後ろを選択肢として項目表示する
 * @example this.drawText("someText",r.x,r.y) ; // テキストの描画
 * @param {string} optString
 * @returns
 */
export function scriptOption(optString) {
  return {
    label: optString.split("//")[1]?.trim() || optString,
    value: optString,
  };
}

// First, create the context menu items based on your script options
function scriptContextMenu(options) {
  // Create a menu
  var menu = new nw.Menu();

  // Add menu items based on the ItemDrawScript options
  // Add each option to the menu
  options.forEach((option) => {
    menu.append(
      new nw.MenuItem({
        label: option.split("//")[1]?.trim() || option,
        click: function () {
          // Get the currently focused element
          var activeElement = document.activeElement;

          // Check if it's a text input or textarea
          if (
            activeElement &&
            (activeElement.tagName === "TEXTAREA" ||
              (activeElement.tagName === "INPUT" &&
                activeElement.type === "text"))
          ) {
            // Insert the code at the current cursor position
            var start = activeElement.selectionStart;
            var end = activeElement.selectionEnd;
            var text = activeElement.value;

            // Replace the selected text with the option code
            activeElement.value =
              text.substring(0, start) + option + text.substring(end);

            // Place cursor after the inserted text
            activeElement.selectionStart = activeElement.selectionEnd =
              start + option.length;

            // カーソル位置を改行する
            activeElement.value += "\n";
            activeElement.selectionStart = activeElement.selectionEnd =
              start + option.length + 1;

            // Focus back on the text input
            activeElement.focus();
            // 変更イベントを手動で発火
            // 1. 標準のchangeイベント
            var changeEvent = new Event("change", {
              bubbles: true, // イベントをバブリング
              cancelable: true, // イベントをキャンセル可能に
            });
            activeElement.dispatchEvent(changeEvent);
          }
        },
      })
    );
  });

  return menu;
}

// Apply the context menu to text inputs and textareas
export function setupScriptContextMenu(input, options) {
  // Create the menu
  var codeMenu = scriptContextMenu(options);
  // Attach context menu event to each element
  input.addEventListener("contextmenu", function (e) {
    // Prevent the default context menu
    e.preventDefault();

    // Position and display our custom menu at the mouse location
    codeMenu.popup(e.x, e.y);

    return false;
  });

  // For dynamically added elements, you might need to use a mutation observer
  // or call setupContextMenus() after adding new elements
}

export function setUpContextMenu(input, options) {
  // Create the menu
  var codeMenu = createContextMenu(options);
  // Attach context menu event to each element
  input.addEventListener("contextmenu", function (e) {
    // Prevent the default context menu
    e.preventDefault();

    // Position and display our custom menu at the mouse location
    codeMenu.popup(e.x, e.y);

    return false;
  });

  // For dynamically added elements, you might need to use a mutation observer
  // or call setupContextMenus() after adding new elements
}

export function createContextMenu(options) {
  // Create a menu
  var menu = new nw.Menu();

  // Add menu items based on the ItemDrawScript options
  // Add each option to the menu
  options.forEach((option) => {
    menu.append(
      new nw.MenuItem({
        label: option.label,
        click: option.click,
      })
    );
  });

  return menu;
}
