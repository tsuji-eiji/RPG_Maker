//@ts-check

export class SyntaxTextArea {
  originalTextArea;
  element;
  editor;
  /**
   * Constructs a new code editor component with syntax highlighting.
   *
   * @constructor
   * @param {Object} options - The options for the code editor.
   * @param {string} options.value - The initial value to set in the editor.
   * @param {HTMLTextAreaElement} options.textarea - The textarea element to enhance with syntax highlighting.
   */
  constructor({ value, textarea }) {
    this.originalTextArea = textarea;
    const dummyWrapper = document.createElement("div");
    document.body.appendChild(dummyWrapper);
    dummyWrapper.appendChild(textarea);

    const syntaxTextArea = setupSyntaxHighlighting(textarea);

    const textDom = syntaxTextArea.getTextArea();
    const wrapperDOM = syntaxTextArea.getWrapperElement();
    wrapperDOM.classList.add("editor-textarea-wrapper");
    // textDom.value = windowData[param] || defaultValue;
    textDom.value = value;

    // this.element = syntaxTextArea;
    this.element = dummyWrapper;
    this.editor = syntaxTextArea;

    textDom.value = textarea.value;
    syntaxTextArea.refresh();
  }
  getValue() {
    const textDom = this.editor.getTextArea();
    const value = textDom.value;
    console.log(value);
    return value;
  }
  save() {
    this.editor.save();
  }
}

// CodeMirrorを使用してシンタックスハイライト機能を追加
/**
 * Create a select input element
 * @param {HTMLTextAreaElement }textarea
 * @returns {CodeMirror.EditorFromTextArea}
 */
function setupSyntaxHighlighting(textarea) {
  // 元のテキストエリアのスタイルや属性を取得
  // const originalId =
  //   textarea.id || "editor-" + Math.random().toString(36).substr(2, 9);
  const width = textarea.style.width || "100%";
  const height = textarea.style.height || "200px";

  // CodeMirrorエディタに変換
  const editor = CodeMirror.fromTextArea(textarea, {
    value: "//",
    mode: "javascript", // JavaScriptモードを使用
    theme: "monokai", // テーマ選択
    // lineNumbers: true, // 行番号表示
    indentUnit: 2, // インデントサイズ
    tabSize: 2, // タブサイズ
    autoCloseBrackets: true, // 括弧を自動で閉じる
    matchBrackets: true, // 対応する括弧をハイライト
    highlightSelectionMatches: true, // 選択した単語の他の出現箇所をハイライト
    foldGutter: true, // コード折りたたみ用ガターを表示
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
      "Ctrl-Space": "autocomplete", // Ctrl+Spaceで自動補完
    },
    lineWrapping: true, // 行の折り返し
  });
  // エディタのサイズを設定
  editor.setSize(width, height);
  // setTimeout(() => {
  //   // console.log("reflesh");
  //   const textDom = editor.getTextArea();
  //   // console.log(textDom);
  //   editor.save();
  //   editor.refresh();
  // }, 1000);

  // CodeMirrorインスタンスをDOM要素に紐付けて後から参照できるようにする
  // textarea.editor = editor;
  return editor;
}
