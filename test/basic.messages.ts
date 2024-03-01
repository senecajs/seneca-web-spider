/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Pkg = require('../package.json')

export default {
  print: false,
  pattern: 'sys:crawler,crawler:web-spider',
  allow: { missing: true },

  calls: [
    {
      pattern: 'get:info',
      out: {
        ok: true,
        name: 'web-spider',
        version: Pkg.version,
        sdk: {
          name: 'web-spider',
          // version: Pkg.dependencies['web-spider'],
        }
      },
    }
  ]
}