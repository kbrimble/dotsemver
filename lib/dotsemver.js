const fs = require('fs')

export const parseSemVerFromFile = (filename, encoding = 'utf8') => {
  const content = fs.readFileSync(filename, encoding).toString(encoding)
  return parseSemVer(content)
}

export const parseSemVer = content => {
  if (!content) {
    return '0.0.0'
  }

  const parts = ['major', 'minor', 'patch']
  const lines = content.split(/[\r\n]+/).filter(line => line && line.length > 0 && !/^\s*$/.test(line))

  const hasPrelude = /-+/.test(lines[0])
  if (!hasPrelude) {
    throw Error('Prelude was not found. First line of .semver need only contain dashes (-).')
  }

  const takeNumberFromLine = line => Number.parseInt(line.split(' ').pop())

  const items = []
  for (const part of parts) {
    const partItems = lines.map(line => line.trim()).filter(line => line.startsWith(`:${part}`)).map(line => ({ part, value: takeNumberFromLine(line) }))
    if (partItems.length > 1) {
      throw Error(`:${part} may only be defined once`)
    }
    partItems.forEach(item => items.push(item))
  }

  const invalidValues = items.filter(item => isNaN(item.value) || item.value < 0)
  if (invalidValues.length > 0) {
    throw Error('Only positive numeric values are allowed: ' + invalidValues.map(val => val.value).join(', '))
  }

  const major = items.find(item => item.part === 'major').value
  const minor = items.find(item => item.part === 'minor').value
  const patch = items.find(item => item.part === 'patch').value

  const version = `${major}.${minor}.${patch}`
  return version
}
