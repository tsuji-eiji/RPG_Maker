export const convertToObject = (data) => {
  const result = {};

  for (const [key, value] of Object.entries(data)) {
    // 数字に変換できる場合は変換
    if (!isNaN(value) && value.trim() !== "") {
      result[key] = Number(value);
    }

    // true/false文字列をbooleanに変換
    else if (value === "true" || value === "false") {
      result[key] = value === "true";
    }

    // 空文字列はそのまま
    else if (value === "") {
      result[key] = value;
    }

    // JSON形式のものはオブジェクトに変換
    else if (
      (value.startsWith("{") && value.endsWith("}")) ||
      (value.startsWith("[") && value.endsWith("]"))
    ) {
      try {
        result[key] = JSON.parse(value);
      } catch {
        result[key] = value; // パース失敗時はそのまま
      }
    }

    // それ以外は文字列
    else {
      result[key] = value;
    }
  }

  return result;
};
