import { h } from "vue";
import { NIcon } from "naive-ui";

export function renderTableIcon(icon: any, text: string) {
  return h(NIcon, { size: 15, style: { width: "auto" } }, [
    h(icon),
    h(
      "span",
      {
        style: {
          verticalAlign: "2px",
          marginLeft: "3px",
          fontSize: "14px",
        },
      },
      `${text}`
    ),
  ]);
}
