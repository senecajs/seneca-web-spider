/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'
import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import WebSpider from '../src/web-spider'
import WebSpiderDoc from '../src/web-spider-doc'

import BasicMessages from './basic.messages'


describe('web-spider', () => {

  test('happy', async () => {
    expect(WebSpider).toBeDefined()
    expect(WebSpiderDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use(WebSpider)
    await seneca.ready()
  })

  // test('messages', async () => {
  //   const seneca = await makeSeneca()
  //   await (SenecaMsgTest(seneca, BasicMessages)())
  // })


  test('crawler-basic', async () => {
    const seneca = await makeSeneca()

    const list = await seneca.entity('sys:spider,spider:web').list$()
    console.log('list', list)
    expect(list.length > 0).toBeTruthy()

  })
})


async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('entity-util', { when: { active: true } })
    .use(WebSpider)
    .message('start:crawl')

    return seneca.ready()
}