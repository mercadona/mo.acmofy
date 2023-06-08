export type hasGreaterOrEqualFn = (len: number) => (str: string) => boolean
export const hasLengthGreaterOrEqualThan: hasGreaterOrEqualFn =
  (len: number) => (str: string) =>
    str.length >= len
