import { pv } from './pv'
import { accessDuration } from './accessDuration'
import { click } from './click'
import { pageChange } from './pageChange'

export function behavior() {
  click()
  pv()
  pageChange()
  accessDuration()
}
