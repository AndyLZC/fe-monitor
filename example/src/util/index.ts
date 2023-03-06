import sourceMap from "source-map-js";

// 找到以.js结尾的fileName
function matchStr(str: string) {
  if (str.endsWith(".js")) return str.substring(str.lastIndexOf("/") + 1);
}

// 将所有的空格转化为实体字符
function repalceAll(str: string) {
  return str.replace(new RegExp(" ", "gm"), "&nbsp;");
}

export function loadSourceMap(fileName: string) {
  const file = matchStr(fileName);
  if (!file) return;
  return new Promise((resolve) => {
    fetch(`http://localhost:9999/getmap?fileName=${file}`).then((response) => {
      resolve(response.json());
    });
  });
}

export const findCodeBySourceMap = async (param: any) => {
  console.log(param.fileName, param.lineNumber, param.columnNumber, 24);
  const sourceData: any = await loadSourceMap(param.fileName);

  if (!sourceData) return;
  const { sourcesContent, sources } = sourceData;
  const consumer = await new sourceMap.SourceMapConsumer(sourceData);

  const result = consumer.originalPositionFor({
    line: Number(param.lineNumber),
    column: Number(param.columnNumber),
  });

  const code = sourcesContent[sources.indexOf(result.source)];

  if (!code) return;
  const codeList: [] = code.split("\n");
  const start = result.line - 3;
  const end = result.line + 2;
  const innerHTML = codeList.slice(start, end).reduce((prev, curr, i) => {
    prev += `<span class="code-index">${
      start + i + 1
    }</span> |    <span class="${
      start + i === result.line - 1 ? "hight-light" : ""
    }">${repalceAll(curr)}</span><br/>`;
    return prev;
  }, "");
  const header = `<div class="header">${result.source}</div>`;
  const footer = `<div class="footer">${param.message}</div>`;
  return header + innerHTML + footer;
};
