export type hasGreaterOrEqualFn = (len: number) => (str: string) => boolean
export const hasLengthGreaterOrEqual: hasGreaterOrEqualFn = (len: number) => (str: string) => str.length >= len
