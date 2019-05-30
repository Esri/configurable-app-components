const TEMPLATE_REGEX = /\{([^\}]+)\}/g;

export interface ReplaceCallback {
  (substring: string, ...args: any[]): string;
}

export function replace(
  template: string,
  map: object | ReplaceCallback
): string {
  return template.replace(
    TEMPLATE_REGEX,
    typeof map === "object" ? (_, k) => map[k] : (_, k) => map(k)
  );
}
