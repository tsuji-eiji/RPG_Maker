import { PropertyField } from "./PropertyField.js";

export class EditGroup {
  static depth = 0; // ネストの深さを記録する静的変数
  element;
  fields; // フィールドのリスト
  props = {};
  /**
   * プロパティ
   * @param {SCM_Data} scmData
   * @param {string} propName
   * @param {PropOptions[]} propList
   */
  getData() {
    return this.fields;
  }
  constructor(scmData, propName, propList) {
    EditGroup.depth++;
    this.propName = propName;
    // this.props = { ...scmData };
    console.assert(propName, "no propname");

    const group = document.createElement("div");
    group.classList.add("edit-group");

    console.assert(propList.length > 0, "プロパティがありません");
    const propFields = propList.map(
      (option) => new PropertyField(scmData, option, this)
    );
    this.fields = propFields;
    propFields.forEach((e) => group.appendChild(e.element));

    propFields.forEach((e) => (e.onChange = this.onFieldChange.bind(this)));

    this.element = group;
    // this.element.addEventListener("change", (e) => {
    //   e.data = { ...this.props };
    //   this.onChange(e);
    // });
    EditGroup.depth--;
  }
  /**
   * @param {{Event , data:{Object}}} event
   */
  onChange(event) {} // callback
  onFieldChange(event) {
    // 相対パス
    const data = event.data;
    const relativePath = data.key.split(this.propName + ".")[1];
    console.assert(relativePath, "INVALID PATH:", data.key);
    this.props[relativePath] = data.value;
    console.log(data.key, ":", data.value);
    event.data = { ...this.props };
    this.onChange(event);
  }
}
