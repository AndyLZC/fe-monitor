import { getFCP } from './fcp'
import { getFps } from './fps'
import { getFirstScreenPaint } from './fsp'
import { getCLS } from './cls'
import { getFID } from './fid'
import { getLCP } from './lcp'
import { rewriteFetch } from './fetch'
import { rewriteXhr } from './xhr'

export function performance() {
  getCLS()
  getFCP()
  getFID()
  getFirstScreenPaint()
  getFps()
  getLCP()
  rewriteFetch()
  rewriteXhr()
}
