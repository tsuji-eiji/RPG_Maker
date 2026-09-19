// 仮想入力を親ウィンドウで再現する関数
export function simulateKeyInput(e, isPressed) {
  const parent = getParentWindow();

  if (!parent || !parent.Input) {
    console.warn("親ウィンドウが見つかりません");
    return;
  }

  switch (e.key) {
    case "ArrowUp":
    case "w":
      parent.Input._currentState["up"] = isPressed;
      break;
    case "ArrowDown":
    case "s":
      parent.Input._currentState["down"] = isPressed;
      break;
    case "ArrowLeft":
    case "a":
      parent.Input._currentState["left"] = isPressed;
      break;
    case "ArrowRight":
    case "d":
      parent.Input._currentState["right"] = isPressed;
      break;
    case "Enter":
    case "z":
      parent.Input._currentState["ok"] = isPressed;
      break;
    case "Escape":
    case "x":
      parent.Input._currentState["cancel"] = isPressed;
      break;
    case "Shift":
      parent.Input._currentState["shift"] = isPressed;
      break;
    case "Control":
      parent.Input._currentState["control"] = isPressed;
      break;
    case "PageUp":
      parent.Input._currentState["pageup"] = isPressed;
      break;
    case "PageDown":
      parent.Input._currentState["pagedown"] = isPressed;
      break;
    default:
      break;
  }
}
