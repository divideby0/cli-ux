import {describe, expect, it} from '@dxcli/dev-test'

import * as fs from 'fs-extra'
import * as path from 'path'

import cli, {CLI} from '../src'

const log = path.join(__dirname, '../tmp/error.log')

beforeEach(() => {
  fs.removeSync(log)
  cli.config.errlog = log
})
afterEach(() => cli.config.errlog = undefined)

describe.stdout.stderr('logger', () => {
  it('does nothing if no error.log', async () => {
    cli.config.errlog = undefined
    cli.info('foobar')
    await cli.done()
    expect(fs.pathExistsSync(log)).to.equal(false)
  })

  it('writes stuff out', async () => {
    cli.warn('showwarning')
    cli.info('hideme')
    cli.error('showerror', {exit: false})
    await cli.done()
    expect(fs.readFileSync(log, 'utf8')).to.contain(' ERROR showerror')
  })

  it('uses scope', async () => {
    let cli = new CLI('mynewscope')
    cli.warn('showwarning')
    cli.info('hideme')
    cli.error('showerror', {exit: false})
    await cli.done()
    expect(fs.readFileSync(log, 'utf8')).to.contain(' WARN mynewscope showwarning')
  })

  it('does not create file if no output', async () => {
    cli.trace('mycontent')
    cli.debug('mycontent')
    cli.info('mycontent')
    await cli.done()
    expect(fs.pathExistsSync(log)).to.equal(false)
  })
})