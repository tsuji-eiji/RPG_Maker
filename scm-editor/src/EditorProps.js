/**
 * フィールドプロパティを管理するクラス
 * @implements {DataProps}
 * @constructor
 */

export class EditorProps {
  sceneId = null; // 現在エディタで編集中のシーンId
  windowData = null;

  /**
   * @param {SceneId|null} sceneId
   * @param {SCM_Window|null} windowData
   */
  static setCurrentScene(sceneId, windowData) {
    this.sceneId = sceneId;
    this.windowData = { ...windowData };
  }
  static getCurrentSceneId() {
    return this.sceneId;
  }

  /**
   * @returns {SCM_Window}
   */
  static getData() {
    return this.windowData;
  }
  /**
   * @param {string} key
   * @param {*} value
   */
  static setData(key, value) {
    console.log("set:", value);
    this.windowData[key] = value;
  }
}
