import type { IBreadCrumb } from '../types'

class BreadCrumb {
  private maxBreadcrumbs: number
  private stack: IBreadCrumb[] = []

  constructor() {
    this.maxBreadcrumbs = 20
  }

  public push(data: IBreadCrumb) {
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift()
    }

    this.stack.push(data)
  }

  private shift() {
    return this.stack.shift() !== undefined
  }

  public getStack() {
    return this.stack
  }
}

const breadCrumb = new BreadCrumb()

export { breadCrumb }
