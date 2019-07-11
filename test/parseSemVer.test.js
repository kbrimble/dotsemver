// eslint-disable-next-line no-global-assign
require = require('esm')(module)
const parseSemVer = require('../lib/dotsemver').parseSemVer

describe('when parsing semver content', () => {
  test('returns 0.0.0 for empty semver', () => {
    const content = ''
    const result = parseSemVer(content)
    expect(result).toBe('0.0.0')
  })

  test('throws error when prelude isn\'t present', () => {
    const content =
    `:major = 1
    :minor = 1
    :patch = 1`

    expect(() => parseSemVer(content)).toThrow('Prelude was not found. First line of .semver need only contain dashes (-).')
  })

  test.each(['major', 'minor', 'patch'])('throws if %s is specified multiple times', part => {
    const content =
    `---
    :major = 1
    :minor = 1
    :patch = 1
    :${part} = 1`

    expect(() => parseSemVer(content)).toThrow(`:${part} may only be defined once`)
  })

  test.each(['a', '£', ' '])('throws if non-numeric \'%s\' is used as a value', nonNumeric => {
    const content =
    `---
    :major = ${nonNumeric}
    :minor = 1
    :patch = 1`

    expect(() => parseSemVer(content)).toThrow()
  })

/* eslint-disable indent, no-unexpected-multiline, func-call-spacing */
  test.each`
    major  | minor  | patch  | expected
    ${2.8} | ${1}   | ${1}   | ${'2.1.1'}
    ${1}   | ${2.8} | ${1}   | ${'1.2.1'}
    ${1}   | ${1}   | ${2.8} | ${'1.1.2'}`
  ('returns $expected when fractions are used: $major $minor $patch', ({ major, minor, patch, expected }) => {
    const content =
    `---
    :major = ${major}
    :minor = ${minor}
    :patch = ${patch}`

    const result = parseSemVer(content)

    expect(result).toBe(expected)
  })
/* eslint-enable indent, no-unexpected-multiline, func-call-spacing */

  test('whitespace at the beginning of lines doesn\'t matter', () => {
    const content =
`---
    :major = 1
:minor = 1
:patch = 1`

    const result = parseSemVer(content)

    expect(result).toBe('1.1.1')
  })

  test('other lines don\'t matter', () => {
    const content =
    `---
    :major = 1
    :minor = 1
    :patch = 1
    :somethingElse = 24`

    const result = parseSemVer(content)

    expect(result).toBe('1.1.1')
  })

  test('empty or whitespace lines don\'t matter', () => {
    const content =
      `    
      ---
      :major = 1
          
      :minor = 1
          
      :patch = 1
          
      `

    const result = parseSemVer(content)

    expect(result).toBe('1.1.1')
  })
})
