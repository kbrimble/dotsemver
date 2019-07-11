# dotsemver

A really simple library for parsing .semver files

## Usage

* Install: `npm install -g dotsemver`
* Run: `dotsemver <filepath> [encoding]`
  * `<filepath>` is the path to the file that you would like to parse
  * `[encoding]` is an optional file encoding. Default is `utf8`

## Example

Given a .semver file that looks like this:
```
---
:major = 1
:minor = 2
:patch = 3
```

Running `dotsemver .semver` will give the output `1.2.3`

## Format notes

* .semver files have to start with a line of dashes (one or more)
* Only `major`, `minor` and `patch` elements will be used. Anything else will be ignored. Tack pre-release tags on afterwards.
* The only rule with whitespace is that there should be no spaces after the numbers
  * `:major =      1` is fine
  * but this isn't: `:major = 1 <- space here`
  
## Why?

Primarily to have some other mechanism of controlling a package version. I wanted to have a separate package.json file for
a static output package and I can use this to get the version number from a .semver file and then update the pacakage.json
with ``npm version `(dotsemver .semver)` ``
