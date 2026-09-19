// @ts-check
/**
 *
 * @param {HTMLInputElement} inputDOM
 * @param {Function} onChange - callback
 * @returns
 */
export function createDraggableNumberInput(inputDOM, onChange) {
  let isDragging = false;
  let startX = 0;
  let startValue = 0;

  function startDrag(event) {
    isDragging = true;
    startX = event.clientX;
    startValue = parseFloat(inputDOM.value) || 0;
    // event.preventDefault(); // 選択を防ぐ
  }

  function drag(event) {
    if (!isDragging) return;
    const delta = Math.round((event.clientX - startX) / 5); // 5pxごとに±1
    const newValue = startValue + delta;
    inputDOM.value = newValue;
    event.target.value = newValue;
    onChange(event);
    // inputDOM.value = startValue + delta;
  }

  function endDrag() {
    if (isDragging) {
      isDragging = false;
    }
  }

  inputDOM.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", drag); // ウィンドウ全体で監視
  window.addEventListener("mouseup", endDrag); // ウィンドウ全体で解除

  return inputDOM;
}
