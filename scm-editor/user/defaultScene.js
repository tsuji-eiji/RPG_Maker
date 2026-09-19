import { convertToObject } from "../src/convertToObject.js";

// シーン作成時に追加されるデフォルトウィンドウです。
// データであり、Objectではないことに注意
const defaultWindowData = {
  Id: "default_window",
  x: "0",
  RelativeWindowIdX: "",
  y: "0",
  RelativeWindowIdY: "",
  width: "0",
  height: "0",
  originX: "0",
  ColumnNumber: "1",
  RowNumber: "0",
  Rotation: "0",
  ItemHeight: "0",
  CommandList: "",
  DataScript: "",
  ListWindowId: "",
  ListScript: "",
  FilterScript: "",
  MappingScript: "",
  SortScript: "",
  ItemDrawScript: "[]",
  ItemDrawMultiLineScript: "",
  IsEnableScript: "",
  CommonHelpText: "",
  DecisionEvent: "{}",
  CancelEvent: "{}",
  CursorEvent: "{}",
  ButtonEvent: "[]",
  FontSize: "0",
  FontFace: "",
  OverlapOther: "false",
  WindowSkin: "",
  VisibleSwitchId: "0",
  ShowOpenAnimation: "true",
  RefreshSwitchId: "0",
  IndexVariableId: "0",
  RememberIndex: "false",
  ItemVariableId: "0",
  Cancelable: "true",
  PopCancel: "true",
  ActorChangeable: "false",
  HiddenNoFocus: "false",
  DarkNoFocus: "false",
  MaskingText: "",
  okSound: "",
  cursorOverContents: "false",
  noItemBackground: "false",
  noFrame: "false",
  textColor: "0",
  cursorAllSwitchId: "0",
  cursorFixedSwitchId: "0",
};
export const defaultPanorama = {
  Image: "",
  ScrollX: 0,
  ScrollY: 0,
};
export const defaultAudioSe = {
  name: "",
  volume: 90,
  pitch: 90,
  pan: 0,
};

export const defaultEventData = {
  CommandId: 0,
  FocusWindowId: "",
  FocusWindowIndex: -1,
  Script: "",
  SwitchId: 0,
  Deselect: false,
};

/**
 * @type {ButtonEventData}
 */
export const defaultButtonEvent = {
  Name: "ok",
  Event: defaultEventData,
};

/**
 * @type {SCM_Window}
 */
export const defaultWindow = convertToObject(defaultWindowData);

export const defaultScene = {
  Id: "Scene_Test",
  UseHelp: 1,
  HelpRows: 0,
  InitialEvent: {},
  ParallelEventId: 0,
  ActorChangeEvent: {},
  WindowList: [defaultWindow],
  PicturePriority: 0,
  Panorama: {},
  UsePageButtons: false,
  SnapNoFilter: false,
};
/**
 * @type {CommandData}
 */
export const defaultCommand = {
  Text: "コマンド名",
  Align: 0,
  VisibleSwitchId: 0,
  VisibleScript: "",
  EnableSwitchId: 0,
  IsEnableScript: "",
  HelpText: "",
  DecisionEvent: {
    CommandId: 0,
    FocusWindowId: "",
    FocusWindowIndex: -1,
    Script: "",
    SwitchId: "",
    Deselect: false,
  },
  CancelChoice: false,
  OkSound: "",
};
