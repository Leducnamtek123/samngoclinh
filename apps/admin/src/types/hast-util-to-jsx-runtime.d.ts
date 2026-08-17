declare module "hast-util-to-jsx-runtime" {
  import type { Nodes } from "hast"
  import type { JSX } from "react"

  export interface Options {
    Fragment: unknown
    jsx: unknown
    jsxs: unknown
    [key: string]: unknown
  }

  export function toJsxRuntime(tree: Nodes, options: Options): JSX.Element
}
