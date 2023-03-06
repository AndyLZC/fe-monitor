export const createHistoryEvent = <T extends keyof History>(
  type: T
): (() => any) => {
  const origin = history[type]

  return function (this: any, ...args) {
    const res = origin.apply(this, args)
    window.dispatchEvent(new Event(type))
    return res
  }
}
