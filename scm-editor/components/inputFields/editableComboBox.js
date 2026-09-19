// @ts-check

/**
 * 編集可能なコンボボックスを作成する
 * @param {Object} data - データオブジェクト
 * @param {string} param - データキー
 * @param {string|number} defaultValue - デフォルト値
 * @param {Array<{value: string|number, label: string}>} options - 選択肢の配列
 * @param {Function} onChangeCallback - 値変更時のコールバック関数（オプション）
 * @returns {HTMLElement} 作成されたコンボボックス要素
 */
export function createEditableCombobox(
  data,
  param,
  defaultValue,
  options,
  onChangeCallback = null
) {
  const nullOption = {
    label: "なし",
    value: "",
  };
  options.unshift(nullOption);
  // コンテナ要素の作成
  const container = document.createElement("div");
  container.className = "editable-combobox-container";

  // 入力フィールドとボタンを含むフレックスコンテナ
  const inputContainer = document.createElement("div");
  inputContainer.className = "editable-combobox-input-container";

  // 入力フィールドの作成
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "editable-combobox-input";

  // 現在の値を設定（初期値）
  const currentValue = data[param] || defaultValue;
  // 入力フィールドには値(value)を表示
  inputElement.value = currentValue;

  // ドロップダウンボタンの作成
  const dropdownButton = document.createElement("button");
  dropdownButton.type = "button";
  dropdownButton.className = "editable-combobox-button";
  dropdownButton.innerHTML = "▼";

  // ドロップダウンリストの作成
  const dropdownList = document.createElement("div");
  dropdownList.className = "editable-combobox-dropdown";

  // オプションの追加
  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "editable-combobox-option";
    // ドロップダウンリストにはラベル(label)を表示
    optionElement.textContent = option.label;
    optionElement.dataset.value = option.value;
    optionElement.dataset.label = option.label;

    // クリックイベント
    optionElement.addEventListener("click", () => {
      // 選択後は値(value)を表示
      inputElement.value = option.value;
      dropdownList.style.display = "none";

      // 値の処理とコールバック
      let value = option.value;
      if (value === "null") {
        value = null;
      } else if (!isNaN(value) && String(value).trim() !== "") {
        value = Number(value);
      }

      // データ更新
      data[param] = value;

      // カスタムコールバックがあれば実行
      if (onChangeCallback) {
        onChangeCallback(param, value);
        var changeEvent = new Event("change");
        container.dispatchEvent(changeEvent);
      }
    });

    dropdownList.appendChild(optionElement);
  });

  // 入力フィールドの変更イベント
  inputElement.addEventListener("change", (e) => {
    // @ts-ignore
    let value = e.target?.value;

    // 値の処理
    if (value === "null") {
      value = null;
    } else if (!isNaN(value) && value.trim() !== "") {
      value = Number(value);
    }

    // データ更新
    data[param] = value;

    // カスタムコールバックがあれば実行
    if (onChangeCallback) {
      onChangeCallback(param, value);
    }
  });

  // ドロップダウンボタンのクリックイベント
  dropdownButton.addEventListener("click", () => {
    const isVisible = dropdownList.style.display === "block";
    dropdownList.style.display = isVisible ? "none" : "block";
  });

  // 外部クリック時にドロップダウンを閉じる
  document.addEventListener("click", (e) => {
    // @ts-ignore
    if (!container.contains(e.target)) {
      dropdownList.style.display = "none";
    }
  });

  // 要素を組み立てる
  inputContainer.appendChild(inputElement);
  inputContainer.appendChild(dropdownButton);
  container.appendChild(inputContainer);
  container.appendChild(dropdownList);

  return container;
}
