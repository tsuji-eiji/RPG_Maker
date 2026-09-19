//@ts-check

export function DivList(strings) {
  return strings.map((text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
  });
}

/**
 * @param {{ children: Iterable<any> | ArrayLike<any>; }} container
 */
export function makeDragList(container, onChange = null) {
  const children = Array.from(container.children);
  const dragList = new DragList(children, onChange);
  return dragList;
}

export class DragList {
  element;
  onChangeCallback;

  constructor(children, onChange = null) {
    this.element = document.createElement("div");
    // this.element.style.cssText = `
    //   list-style: none;
    //   padding: 0;
    //   margin: 0;
    // `;

    // 子要素を追加してドラッグ可能にする
    children.forEach((child, index) => {
      this.setupDragItem(child, index);
      this.element.appendChild(child);
    });
    this.onChangeCallback = onChange;
  }

  setupDragItem(item, index) {
    // 基本スタイル
    // item.style.cssText += `
    //   cursor: move;
    //   padding: 8px;
    //   margin: 2px 0;
    //   background: #f5f5f5;
    //   border: 1px solid #ddd;
    //   user-select: none;
    // `;

    // ドラッグ可能にする
    item.draggable = true;
    item.dataset.index = index;

    // ドラッグイベント
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", item.outerHTML);
      e.dataTransfer.setData("text/plain", item.dataset.index);
      item.style.opacity = "0.5";
    });

    item.addEventListener("dragend", (e) => {
      item.style.opacity = "1";
    });

    // ドロップゾーンイベント
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      item.style.borderTop = "3px solid #007cba";
    });

    item.addEventListener("dragleave", (e) => {
      item.style.borderTop = "1px solid #ddd";
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.style.borderTop = "1px solid #ddd";

      const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
      const targetIndex = parseInt(item.dataset.index);

      if (draggedIndex !== targetIndex) {
        this.moveItem(draggedIndex, targetIndex);
      }
    });
  }

  moveItem(fromIndex, toIndex) {
    const items = Array.from(this.element.children);
    const draggedItem = items[fromIndex];

    // 要素を移動
    if (fromIndex < toIndex) {
      this.element.insertBefore(draggedItem, items[toIndex + 1]);
    } else {
      this.element.insertBefore(draggedItem, items[toIndex]);
    }

    // インデックスを更新
    const newOrder = [];
    Array.from(this.element.children).forEach((child, index) => {
      child.dataset.index = index;
      newOrder.push(child.textContent);
    });

    // コールバックを実行
    if (this.onChangeCallback) {
      this.onChangeCallback(newOrder, fromIndex, toIndex);
    }
  }

  static createItemsFromStrings(strings) {
    return strings.map((text) => {
      const div = document.createElement("div");
      div.textContent = text;
      return div;
    });
  }
}
