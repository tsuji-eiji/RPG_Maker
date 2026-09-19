/**
 * Common ID for events, typically an integer used within a specific range.
 * @example
 * // Example usage of a common event ID
 * const eventId = 1; // Common event with ID: 1
 */
type MZ_CommonId = number;

/**
 * Event object for the SCM system
 */
interface SCM_Event {
  /** Common event ID */
  CommandId: number;
  /** Window identifier (if not specified, returns to previous window) */
  FocusWindowId?: string;
  /** Cursor index (-1 means no operation) */
  FocusWindowIndex?: number;
  /** Script to be executed */
  Script?: string;
  /** Switch ID (switch to turn ON) */
  SwitchId?: number;
  /** Whether to deselect the original window */
  Deselect?: boolean;
}

/**
 * Audio sound effect properties
 */
interface MZ_AudioSe {
  /** File name (file in audio/se/ directory) */
  name: string;
  /** Volume (0-100) */
  volume: number;
  /** Pitch (50-150) */
  pitch: number;
  /** Pan (-100 to 100) */
  pan: number;
}

/**
 * Command data for menu items
 */
interface CommandData {
  /** Display content of the item */
  Text: string;
  /** Alignment of the item (0: left, 1: center, 2: right) */
  Align: 0 | 1 | 2;
  /** Switch ID for visibility */
  VisibleSwitchId: number;
  /** Script for visibility */
  VisibleScript: string;
  /** Switch ID for enabling selection */
  EnableSwitchId: number;
  /** Script for enabling selection */
  IsEnableScript: string;
  /** Help text */
  HelpText: string;
  /** Event on decision */
  DecisionEvent: SCM_Event;
  /** Whether this is a cancel choice */
  CancelChoice: boolean;
  /** Sound effect on confirmation */
  OkSound: MZ_AudioSe;
}

/**
 * Button event data
 */
interface ButtonEventData {
  /** Name of the button that triggers the event */
  Name:
    | "ok"
    | "cancel"
    | "menu"
    | "shift"
    | "control"
    | "down"
    | "left"
    | "right"
    | "up"
    | "pageup"
    | "pagedown"
    | "debug"
    | "tab";
  /** Event that occurs when the button is pressed */
  Event: SCM_Event;
}

/**
 * Window configuration for the SCM system
 */
interface SCM_Window {
  /** Window identifier */
  Id: string;
  /** Window X coordinate */
  x: number;
  /** Relative window ID for X coordinate */
  RelativeWindowIdX: string;
  /** Window Y coordinate */
  y: number;
  /** Relative window ID for Y coordinate */
  RelativeWindowIdY: string;
  /** Window width */
  width: number;
  /** Window height */
  height: number;
  /** Window origin X coordinate */
  originX: number;
  /** Number of columns */
  ColumnNumber: number;
  /** Number of rows */
  RowNumber: number;
  /** Rotation angle */
  Rotation: number;
  /** Item height */
  ItemHeight: number;
  /** Command list (array format) */
  CommandList: CommandData[];
  /** Data script */
  DataScript: string;
  /** List window identifier */
  ListWindowId: string;
  /** List script */
  ListScript: string;
  /** Filter script */
  FilterScript: string;
  /** Mapping script */
  MappingScript: string;
  /** Sort script */
  SortScript: string;
  /** Item drawing scripts (array format) */
  ItemDrawScript: string[];
  /** Multi-line item drawing script */
  ItemDrawMultiLineScript: string;
  /** Window enablement script */
  IsEnableScript: string;
  /** Common help text */
  CommonHelpText: string;
  /** Decision event */
  DecisionEvent: SCM_Event;
  /** Cancel event */
  CancelEvent: SCM_Event;
  /** Cursor event */
  CursorEvent: SCM_Event;
  /** Button events (array format) */
  ButtonEvent: ButtonEventData[];
  /** Font size */
  FontSize: number;
  /** Font face */
  FontFace: string;
  /** Overlap with other windows */
  OverlapOther: boolean;
  /** Window skin */
  WindowSkin: string;
  /** Visibility switch ID */
  VisibleSwitchId: number;
  /** Show open/close animation */
  ShowOpenAnimation: boolean;
  /** Refresh switch ID */
  RefreshSwitchId: number;
  /** Index variable ID */
  IndexVariableId: number;
  /** Remember index */
  RememberIndex: boolean;
  /** Item variable ID */
  ItemVariableId: number;
  /** Can be canceled */
  Cancelable: boolean;
  /** Pop-up cancel */
  PopCancel: boolean;
  /** Actor can be changed */
  ActorChangeable: boolean;
  /** Hidden when not focused */
  HiddenNoFocus: boolean;
  /** Darken when not focused */
  DarkNoFocus: boolean;
  /** Masking text */
  MaskingText: string;
  /** Confirmation sound */
  okSound: string;
  /** Cursor over contents */
  cursorOverContents: boolean;
  /** No item background */
  noItemBackground: boolean;
  /** No frame */
  noFrame: boolean;
  /** Text color */
  textColor: number;
  /** Cursor all switch ID */
  cursorAllSwitchId: number;
  /** Cursor fixed switch ID */
  cursorFixedSwitchId: number;
}

/**
 * Panorama image configuration
 */
interface Panorama {
  /** Image file. Specifies the image file to be displayed as background. If not specified, a blurred image of the map is displayed. */
  Image: string;
  /** Horizontal scroll speed of the background image. */
  ScrollX: number;
  /** Vertical scroll speed of the background image. */
  ScrollY: number;
}

/**
 * Scene configuration for the SCM system
 */
interface SCM_Scene {
  /** Scene ID (e.g., Scene_ActorList) */
  Id: string;
  /** Whether to use help window */
  UseHelp: number;
  /** Number of rows in help window */
  HelpRows: number;
  /** Initial event */
  InitialEvent: SCM_Event;
  /** Parallel common event ID */
  ParallelEventId: MZ_CommonId;
  /** Event that occurs when actor is changed */
  ActorChangeEvent: SCM_Event;
  /** List of windows */
  WindowList: SCM_Window[];
  /** Picture priority */
  PicturePriority: number;
  /** Panorama image */
  Panorama: Panorama;
}

/**
 * Abstract type for SCM data
 */
type SCM_Data =
  | SCM_Scene
  | SCM_Window
  | SCM_Event
  | MZ_AudioSe
  | ButtonEventData
  | CommandData
  | Parnorama;

type SceneId = string;
type WindowId = string;

/**
 * SCM model
 */
interface SCM_Model {
  // Empty interface in the original JSDoc
}

type MZ_PropType =
  | "string"
  | "multiline_string"
  | "file"
  | "number"
  | "boolean"
  | "select"
  | "combo"
  | "actor"
  | "class"
  | "skill"
  | "item"
  | "weapon"
  | "armor"
  | "enemy"
  | "troop"
  | "state"
  | "animation"
  | "tileset"
  | "common_event"
  | "map"
  | "location"
  | "switch"
  | "variable"
  | "string[]"
  | "struct";

type MZ_ArgData = {
  pluginName: string;
  text: string;
  desc?: string;
  default: string;
  dir?: string;
  name?: string;
  type: MZ_PropType;
  options?: { label: string; value: string }[];
};

type MZ_CommandData = {
  name: string;
  text?: string;
  desc?: string;
};
type MZ_CommandWithArgs = MZ_CommandData & {
  args: MZ_ArgData[];
};

type MZ_ParamData = {
  annotation: MZ_ArgData;
  value: any;
  // typeName: MZ_PropType;
  // command: MZ_CommandData;
  // arg: MZ_ArgData;
};

type MZ_VariableId = number;
type MZ_SwitchId = number;

/**
 * RPG.MetaSource interface
 */
type RPG_MetaSource = {
  id?: number;
  name?: string;
  meta: Record<string, string>;
};

type MZ_MetaData = {
  key: string;
  lebel: string;
};

/**
 * RPGツクールで使用されるパラメータ型
 */
type PrimitivePropType =
  | "string"
  | "number"
  | "boolean"
  | "combo"
  | "select"
  | "file"
  | "common_event"
  | "switch"
  | "variable"
  | "color"
  | "multiline_string";

type StructPropType =
  | "struct<Event>"
  | "struct<AudioSe>"
  | "struct<Window>[]"
  | "struct<Panorama>"
  | "struct<Command>[]"
  | "struct<ButtonEvent>[]";

type PropType = PrimitivePropType | StructPropType;

/**
 * 変数、スイッチ、コモンイベントID
 */
type IDPropType = "variable" | "switch" | "common_event";

interface SelectOption {
  /** 表示ラベル */
  option: string;
  /** 対応する値 */
  value: string | number;
}

/**
 * windowIdを変更する場合に確認モーダルを出す
 * Script ... テキストフィールドにシンタックスハイライトを適用
 */
type PropFieldType = "windowId" | "Script";

/**
 * シーン中に存在するWindowIdのみを検索する場合
 */
type PropSelectType = "windowId";

interface PropOptions {
  /** 項目名 */
  text: string;
  /** パラメータキー */
  param: string;
  /** 説明文 */
  desc: string;
  /** デフォルト値 */
  defaultValue: any;
  /** プロパティの型 */
  propType: PropType;
  /** 選択肢の型（オプショナル） */
  select?: PropSelectType;
  /** フィールドタイプ（オプショナル） */
  fieldType?: PropFieldType;
  /** 選択肢（オプショナル） */
  options?: SelectOption[];
  /** スクリプトのプリセット（オプショナル） */
  comboOptions?: string[];
  /** 右クリックメニュー（オプショナル） */
  contextMenu?: string[];
  /** 数値フィールドの最小値（オプショナル） */
  min?: string;
  /** 数値フィールドの最小値（オプショナル） */
  max?: string;
  /** ファイル入力時のディレクトリ */
  dir?: string;
  /** (ファイル入力時)必要なファイルの数 */
  require?: number;
}

/**
 * ファイル入力フィールド用のオプション
 */
interface FileOptions extends PropOptions {
  propType: "file";
  dir: string;
}

type PropFieldElement = HTMLElement;

type SCM_Parameters;
