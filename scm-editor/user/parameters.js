// @ts-check

import {
  defaultAudioSe,
  defaultButtonEvent,
  defaultCommand,
  defaultEventData,
  defaultPanorama,
} from "./defaultScene.js";
import {
  filterScriptOptions,
  mappingScriptOptions,
  sortScriptOptions,
  isEnableScriptOptioins,
  drawItemoptions,
  listScriptOptions,
  eventScriptOptions,
} from "./presets.js";

/** @type {PropOptions[]}*/
export const styleProperties = [
  {
    text: "フォントサイズ",
    param: "FontSize",
    desc: "デフォルトのフォントサイズです。0を指定すると他のウィンドウと同じサイズになります。",
    defaultValue: 0,
    propType: "number",
  },
  {
    text: "フォント",
    param: "FontFace",
    desc: "ウィンドウのフォントを変更します。",
    defaultValue: "",
    propType: "file",
    dir: "fonts",
  },
  {
    text: "テキストカラー",
    param: "textColor",
    desc: "描画文字列のデフォルトカラーです。",
    defaultValue: 0, // ツクールのカラー番号に対応し、0~15の整数値選択となる
    propType: "color",
  },
  {
    text: "カーソルを手前に表示",
    param: "cursorOverContents",
    desc: "有効にするとカーソルが項目の上に表示されます。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "項目背景を表示しない",
    param: "noItemBackground",
    desc: "有効にすると項目の黒い背景が表示されなくなります。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "他ウィンドウに重ねる",
    param: "OverlapOther",
    desc: "他のウィンドウと重なって表示させたときに背後のウィンドウをマスキングさせなくなります。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "ウィンドウスキン",
    param: "WindowSkin",
    desc: "ウィンドウスキンです。指定しなかった場合、デフォルトが使用されます。",
    defaultValue: "",
    propType: "file",
    require: 1,
    dir: "img/system",
  },
  {
    text: "開閉アニメ表示",
    param: "ShowOpenAnimation",
    desc: "ウィンドウの開閉アニメーションを表示します。",
    defaultValue: true,
    propType: "boolean",
  },
  {
    text: "枠を表示しない",
    param: "noFrame",
    desc: "有効にするとウィンドウの枠が表示されなくなります。",
    defaultValue: false,
    propType: "boolean",
  },

  {
    text: "非フォーカス時は隠す",
    param: "HiddenNoFocus",
    desc: "有効にするとウィンドウにフォーカスがないときは非表示になります。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "非フォーカス時は暗転",
    param: "DarkNoFocus",
    desc: "有効にするとフォーカスがないときはウィンドウの中身が暗くなります。",
    defaultValue: false,
    propType: "boolean",
  },
];

/** @type {PropOptions[]}*/
export const windowBasicProperties = [
  {
    text: "ウィンドウ識別子",
    param: "Id",
    desc: "ウィンドウの識別子(ID)です。リスト内で他の識別子と重複しない文字列を指定してください。",
    defaultValue: "window1",
    propType: "string",
    fieldType: "windowId",
  },
  {
    text: "コマンドリスト",
    param: "CommandList",
    desc: "ウィンドウに表示される項目や表示可否を直接指定します。項目が最初から決まっている場合に使います。",
    /** @type {CommandData[]}*/
    defaultValue: [],
    propType: "struct<Command>[]",
  },
  {
    text: "マスキングテキスト",
    param: "MaskingText",
    desc: "コマンドが非表示時に指定文字列でマスキングされます。",
    defaultValue: "",
    propType: "string",
  },
  {
    text: "共通ヘルプテキスト",
    param: "CommonHelpText",
    desc: "選択している項目とは関係なく表示されるヘルプテキストです。",
    defaultValue: "",
    propType: "multiline_string",
  },
];

/** @type {PropOptions[]}*/
export const transformProperties = [
  {
    text: "X座標",
    param: "x",
    desc: "X座標です。",
    defaultValue: 0,
    propType: "number",
    min: "-2000",
  },
  {
    text: "相対X座標ウィンドウ",
    param: "RelativeWindowIdX",
    desc: "指定した場合、X座標が対象ウィンドウからの相対位置になります。",
    defaultValue: "",
    propType: "string",
    select: "windowId",
  },
  {
    text: "Y座標",
    param: "y",
    desc: "Y座標です。",
    defaultValue: 0,
    propType: "number",
    min: "-2000",
  },
  {
    text: "相対Y座標ウィンドウ",
    param: "RelativeWindowIdY",
    desc: "指定した場合、Y座標が対象ウィンドウからの相対位置になります。",
    defaultValue: "",
    propType: "string",
    select: "windowId",
  },
  {
    text: "横幅",
    param: "width",
    desc: "横幅です。0を指定した場合は画面の横幅に合わせられます。",
    defaultValue: 0,
    propType: "number",
  },
  {
    text: "高さ",
    param: "height",
    desc: "高さです。0を指定した場合は『行数』の指定をもとに自動設定されます。",
    defaultValue: 0,
    propType: "number",
  },
  {
    text: "X軸原点",
    param: "originX",
    desc: "ウィンドウの座標を決める原点です。指定する場合、横幅も指定してください。",
    defaultValue: 0,
    propType: "select",
    options: [
      { option: "左", value: 0 },
      { option: "中央", value: 1 },
      { option: "右", value: 2 },
    ],
  },
  {
    text: "列数",
    param: "ColumnNumber",
    desc: "ウィンドウの列数です。",
    defaultValue: 1,
    propType: "number",
    min: "1",
  },
  {
    text: "行数",
    param: "RowNumber",
    desc: "ウィンドウの行数です。高さを決定するために使われます。0を指定した場合はコマンド数をもとに自動設定されます。",
    defaultValue: 0,
    propType: "number",
  },
  {
    text: "回転角度",
    param: "Rotation",
    desc: "ウィンドウの角度です。度数法(0-360)で指定します。中身のフィルタが効かなくなる制約があります。",
    defaultValue: 0,
    propType: "number",
    min: "-720",
  },
  {
    text: "項目の高さ",
    param: "ItemHeight",
    desc: "1項目あたりの高さです。0を指定した場合はウィンドウのデフォルト値が使用されます。",
    defaultValue: 0,
    propType: "number",
  },
];

/** @type {PropOptions[]}*/
export const otherProperties = [
  {
    text: "決定イベント",
    param: "DecisionEvent",
    desc: "項目が決定された瞬間に発生するイベントです。",
    /** @type {SCM_Event} */
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "決定SE",
    param: "okSound",
    desc: "選択時に通常の決定音の代わりに指定したSEが演奏されます。",
    /** @type {MZ_AudioSe}*/
    defaultValue: defaultAudioSe,
    propType: "struct<AudioSe>",
    dir: "audio/se",
  },
  {
    text: "キャンセル可能",
    param: "Cancelable",
    desc: "有効にするとウィンドウをキャンセルできるようになります。",
    defaultValue: true,
    propType: "boolean",
  },
  {
    // text: "シーン戻しキャンセル",
    text: "キャンセル時にシーンを抜ける",
    param: "PopCancel",
    desc: "有効にすると最初のウィンドウである場合、キャンセル時に前のシーンに戻ります。",
    defaultValue: true,
    propType: "boolean",
  },
  {
    text: "キャンセルイベント",
    param: "CancelEvent",
    desc: "キャンセルされた瞬間に発生するイベントです。",
    /** @type {SCM_Event} */
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "カーソルイベント",
    param: "CursorEvent",
    desc: "カーソルが動いた瞬間に発生するイベントです。このイベントではウィンドウのフォーカスは変更されません。",
    /** @type {SCM_Event} */
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "ボタンイベント",
    param: "ButtonEvent",
    desc: "指定されたボタンが押された瞬間に発生するイベントです。",
    defaultValue: [],
    propType: "struct<ButtonEvent>[]",
  },
  {
    text: "表示スイッチID",
    param: "VisibleSwitchId",
    desc: "指定したスイッチがONの場合のみ画面に表示されます。",
    defaultValue: 0,
    propType: "switch",
  },
  {
    text: "再描画スイッチ",
    param: "RefreshSwitchId",
    desc: "指定したスイッチがONになるとウィンドウが再描画されます。",
    defaultValue: 0,
    propType: "switch",
  },
  {
    text: "全選択スイッチID",
    param: "cursorAllSwitchId",
    desc: "指定したスイッチがONのときカーソルが全選択状態になります。",
    defaultValue: 0,
    propType: "switch",
  },
  {
    text: "選択固定スイッチID",
    param: "cursorFixedSwitchId",
    desc: "指定したスイッチがONのときカーソル選択が固定されます。",
    defaultValue: 0,
    propType: "switch",
  },
  {
    text: "インデックス格納変数",
    param: "IndexVariableId",
    desc: "カーソルインデックスが常に格納される変数です。",
    defaultValue: 0,
    propType: "variable",
  },
  {
    text: "インデックスを記憶",
    param: "RememberIndex",
    desc: "インデックス格納変数を指定している場合、画面を開いたときにカーソルの初期値を変数値で復元します。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "選択項目格納変数",
    param: "ItemVariableId",
    desc: "選択中の項目オブジェクトが常に格納される変数です。",
    defaultValue: 0,
    propType: "variable",
  },
  {
    text: "アクター変更可能",
    param: "ActorChangeable",
    desc: "有効にするとPageUp, PageDownでアクターチェンジできるようになります。",
    defaultValue: false,
    propType: "boolean",
  },
];

/** @type {PropOptions[]}*/
export const dataScriptProperties = [
  {
    text: "一覧ウィンドウ識別子",
    param: "ListWindowId",
    desc: "別の一覧ウィンドウの詳細情報を表示するウィンドウの場合、一覧のウィンドウ識別子を指定します。",
    defaultValue: "",
    propType: "string",
    select: "windowId",
  },
  {
    text: "一覧取得スクリプト",
    param: "ListScript",
    desc: "項目の一覧を返すスクリプトです。プリセットから選ぶこともできます。『一覧ウィンドウ識別子』を指定した場合は無効です。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: listScriptOptions,
    comboOptions: listScriptOptions,
  },
  {
    text: "フィルタスクリプト",
    param: "FilterScript",
    desc: "項目の一覧に対して表示条件を設定します。変数[item]から各要素が参照できます。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: filterScriptOptions,
    comboOptions: filterScriptOptions,
  },
  {
    text: "マッピングスクリプト",
    param: "MappingScript",
    desc: "一覧の項目を別の値に変換します。変数[item]から各要素が参照できます。必要な場合にのみ指定してください。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: mappingScriptOptions,
    comboOptions: mappingScriptOptions,
  },
  {
    text: "ソートスクリプト",
    param: "SortScript",
    desc: "一覧の項目をソートします。変数[a] 変数[b]が比較用の各要素の参照です。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: sortScriptOptions,
    comboOptions: sortScriptOptions,
  },
  {
    text: "選択可能スクリプト",
    param: "IsEnableScript",
    desc: "項目を選択可能かどうかを判定するスクリプトです。変数[item]から各要素が参照できます。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: isEnableScriptOptioins,
    comboOptions: isEnableScriptOptioins,
  },
  {
    text: "項目描画スクリプト",
    param: "ItemDrawScript",
    desc: "右クリックでプリセットを表示します。項目を描画するスクリプトです。変数[item]から各要素が参照できます。省略すると自働で描画されます。",
    defaultValue: [],
    propType: "combo",
    fieldType: "Script",
    contextMenu: drawItemoptions,
  },
];

/** @type {PropOptions[]}*/
export const commandProperties = [
  {
    text: "項目内容",
    param: "Text",
    desc: "項目の描画内容です。アイコン系の制御文字が使用できます。",
    defaultValue: defaultCommand,
    propType: "string",
  },
  {
    text: "項目の揃え",
    param: "Align",
    desc: "項目の揃えです。",
    defaultValue: "0",
    propType: "select",
    options: [
      { option: "左揃え", value: 0 },
      { option: "中央", value: 1 },
      { option: "右揃え", value: 2 },
    ],
  },
  {
    text: "選択可能スクリプト",
    param: "IsEnableScript",
    desc: "項目を選択可能かどうかを判定するスクリプトです。変数[item]で『一覧ウィンドウ識別子』の選択項目が参照できます。",
    defaultValue: "",
    propType: "combo",
    contextMenu: isEnableScriptOptioins,
  },
  {
    text: "ヘルプテキスト",
    param: "HelpText",
    desc: "ヘルプウィンドウを表示している場合、ヘルプテキストが表示されます。",
    defaultValue: "",
    propType: "string",
  },
  {
    text: "決定イベント",
    param: "DecisionEvent",
    desc: "この項目が決定された瞬間に発生するイベントです。指定した場合、共通の決定イベントより優先されます。",
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "決定SE",
    param: "OkSound",
    desc: "選択すると通常の決定音の代わりに指定したSEが演奏されます。",
    /** @type {MZ_AudioSe}*/
    defaultValue: defaultAudioSe,
    propType: "struct<AudioSe>",
    dir: "audio/se",
  },
];

/** @type {PropOptions[]}*/
export const sceneProperties = [
  {
    text: "シーン識別子",
    param: "Id",
    desc: "シーンを呼び出す際の識別子です。他の識別子と重複しない文字列を指定してください。",
    defaultValue: "Scene_Test",
    propType: "string",
  },
  {
    text: "ヘルプウィンドウ使用",
    param: "UseHelp",
    desc: "有効にした場合、ヘルプウィンドウを表示します。",
    defaultValue: 1,
    propType: "select",
    options: [
      { option: "使用しない", value: 0 },
      { option: "画面下部に表示(MZデフォルト)", value: 1 },
      { option: "画面上部に表示", value: 2 },
    ],
  },
  {
    text: "ヘルプ行数",
    param: "HelpRows",
    desc: "ヘルプウィンドウの行数をデフォルトの2から変更したい場合に指定してください。",
    defaultValue: 0,
    propType: "number",
  },
  {
    text: "初期イベント",
    param: "InitialEvent",
    desc: "シーンが表示された瞬間に発生するイベントです。初期イベントに指定したウィンドウでキャンセルすると画面から抜けます。",
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "並列コモンイベントID",
    param: "ParallelEventId",
    desc: "シーンが表示されている間、常に実行され続けるコモンイベントです。パフォーマンスの低下に注意して使ってください。",
    defaultValue: 0,
    propType: "common_event",
  },
  {
    text: "アクター変更イベント",
    param: "ActorChangeEvent",
    desc: "アクターを変更した瞬間に発生するイベントです。このイベントではウィンドウのフォーカスは変更されません。",
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
  {
    text: "ウィンドウ一覧",
    param: "WindowList",
    desc: "シーンで使用されるウィンドウの一覧です。",
    defaultValue: [],
    propType: "struct<Window>[]",
  },
  {
    text: "ピクチャ表示優先度",
    param: "PicturePriority",
    desc: "ピクチャのウィンドウに対する表示優先度を設定します。",
    defaultValue: 0,
    propType: "select",
    options: [
      { option: "最前面", value: 0 },
      { option: "メッセージウィンドウの下", value: 1 },
      { option: "すべてのウィンドウの下", value: 2 },
    ],
  },
  {
    text: "パノラマ画像",
    param: "Panorama",
    desc: "背景情報を指定します。",
    defaultValue: defaultPanorama,
    propType: "struct<Panorama>",
    dir: "img/parallaxes",
  },
  {
    text: "ページボタンの使用",
    param: "UsePageButtons",
    desc: "有効にした場合、ページボタンを表示します。",
    defaultValue: false,
    propType: "boolean",
  },
  {
    text: "背景ぼかし無効化",
    param: "SnapNoFilter",
    desc: "指定した場合、背景スナップのぼかしが適用されなくなります。",
    defaultValue: false,
    propType: "boolean",
  },
];

/** @type {PropOptions[]}*/
export const buttonEventProps = [
  {
    text: "ボタン名",
    param: "Name",
    desc: "押したときにイベントが発生するボタン名です。okとcancelはタッチ操作と決定とキャンセルにも反応します。",
    defaultValue: "",
    propType: "select",
    options: [
      { option: "ok", value: "ok" },
      { option: "cancel", value: "cancel" },
      { option: "menu", value: "menu" },
      { option: "shift", value: "shift" },
      { option: "control", value: "control" },
      { option: "down", value: "down" },
      { option: "left", value: "left" },
      { option: "right", value: "right" },
      { option: "up", value: "up" },
      { option: "pageup", value: "pageup" },
      { option: "pagedown", value: "pagedown" },
      { option: "debug", value: "debug" },
      { option: "tab", value: "tab" },
    ],
  },
  {
    text: "イベント",
    param: "Event",
    desc: "指定したボタンが押された瞬間に発生するイベントです。",
    defaultValue: defaultEventData,
    propType: "struct<Event>",
  },
];

/** @type {PropOptions[]}*/
export const allWindowProperties = windowBasicProperties
  .concat(styleProperties)
  .concat(dataScriptProperties)
  .concat(otherProperties);

export const editGroupsConfig = [
  { title: "基本", propType: "category", properties: windowBasicProperties },
  { title: "座標", propType: "category", properties: transformProperties },
  { title: "スタイル", propType: "category", properties: styleProperties },
  {
    title: "スクリプト",
    propType: "category",
    properties: dataScriptProperties,
  },
  { title: "イベント", propType: "category", properties: otherProperties },
];

/** @type {PropOptions[]}*/
export const audioSeProperties = [
  {
    text: "ファイル名",
    param: "name",
    desc: "ファイル名称です。",
    defaultValue: "",
    propType: "file",
    require: 1,
    dir: "audio/se/",
  },
  {
    text: "音量",
    param: "volume",
    desc: "ボリュームです。",
    defaultValue: 90,
    propType: "number",
    // min: "0",
    // max: "100",
  },
  {
    text: "ピッチ",
    param: "pitch",
    desc: "ピッチです。",
    defaultValue: 100,
    propType: "number",
    // min: "50",
    // max: "150",
  },
  {
    text: "左右バランス",
    param: "pan",
    desc: "左右バランスです。",
    defaultValue: 0,
    propType: "number",
    // min: -100,
    // max: 100,
  },
];

/** @type {PropOptions[]}*/
export const eventProperties = [
  {
    text: "コモンイベント",
    param: "CommandId",
    desc: "対象のイベントが発生したときに実行されるコモンイベントです。ただし、シーンを出るときは実行されません。",
    defaultValue: 0,
    propType: "common_event",
  },
  {
    // text: "ウィンドウ識別子",
    text: "ウィンドウにフォーカス",
    param: "FocusWindowId",
    desc: "対象のイベントが発生したときにフォーカスされるウィンドウ識別子です。指定がなければ前のウィンドウに戻ります。(元プロパティ名：ウィンドウ識別子)",
    defaultValue: "",
    propType: "string",
    select: "windowId",
  },
  {
    text: "元ウィンドウ選択解除",
    param: "Deselect",
    desc: "対象のイベントが発生したときに元々フォーカスされていたウィンドウの選択状態を解除します。",
    defaultValue: false,
    propType: "boolean",
  },
  // 使用することがなく、他の手段で代替できるため簡略化のため非表示にした
  // {
  //   text: "カーソルインデックス",
  //   param: "FocusWindowIndex",
  //   desc: "対象のイベントが発生したときにフォーカスされるウィンドウのカーソルインデックスです。-1を指定した場合、操作しません。",
  //   defaultValue: -1,
  //   propType: "number",
  //   min: -1,
  // },
  {
    text: "スクリプト",
    param: "Script",
    desc: "対象のイベントが発生したときに実行されるスクリプトです。",
    defaultValue: "",
    propType: "combo",
    fieldType: "Script",
    contextMenu: eventScriptOptions,
    comboOptions: eventScriptOptions,
  },
  {
    // text: "スイッチ",
    text: "スイッチON",
    param: "SwitchId",
    desc: "対象のイベントが発生したときにONになるスイッチです。",
    defaultValue: 0,
    propType: "switch",
  },
];

/** @type {PropOptions[]}*/
export const panoramaProperties = [
  {
    text: "画像ファイル",
    param: "Image",
    desc: "背景として表示される画像ファイルを指定します。指定しなかった場合、マップのぼかし画像が表示されます。",
    defaultValue: "",
    propType: "file",
    require: 1,
    dir: "img/parallaxes/",
  },
  {
    text: "スクロールX",
    param: "ScrollX",
    desc: "背景画像の横方向のスクロール速度です。",
    defaultValue: 0,
    propType: "number",
    // min: -100,
    // max: 100,
  },
  {
    text: "スクロールY",
    param: "ScrollY",
    desc: "背景画像の縦方向のスクロール速度です。",
    defaultValue: 0,
    propType: "number",
    // min: -100,
    // max: 100,
  },
];

/**
 *
 * @param {StructPropType} propType
 * @returns {PropOptions[]}
 */
export const getSubProps = (propType) => {
  if (propType == "struct<AudioSe>") return audioSeProperties;
  if (propType == "struct<Event>") return eventProperties;
  if (propType == "struct<ButtonEvent>[]") return buttonEventProps;
  if (propType == "struct<Command>[]") return commandProperties;
  if (propType == "struct<Panorama>") return panoramaProperties;
  if (propType == "struct<Window>[]") return allWindowProperties;
  else {
    console.error("INVALID STRUCT:", propType);
    return [];
  }
};

/**
 * シーン等のモーダルで新規作成時に入力されている初期データ
 * @param {StructPropType} propType
 * @returns {SCM_Data}
 */
export const getDefaultItem = (propType) => {
  if (propType == "struct<AudioSe>") return defaultAudioSe;
  if (propType == "struct<Event>") return defaultEventData;
  if (propType == "struct<ButtonEvent>[]") return defaultButtonEvent;
  if (propType == "struct<Command>[]") return defaultCommand;
  if (propType == "struct<Panorama>") return defaultPanorama;
  if (propType == "struct<Window>[]") return allWindowProperties;
  else {
    console.error("INVALID STRUCT:", propType);
    return /** @type {SCM_Data} */ ({});
  }
};
