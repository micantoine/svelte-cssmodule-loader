const { basename } = require('path')
const { getOptions, interpolateName } = require('loader-utils')
const validateOptions = require('schema-utils')
const schema = require('./schema.json')

const pluginOptions = {
  localIdentName: '[local]-[hash:base64:6]'
}
const regex = {
  module: /\$style\.(:?[\w\d-]*)/gm,
  style: /<style(\s[^]*?)?>([^]*?)<\/style>/gi
}

function generateName(loaderContext, styles, className) {
  const filePath = loaderContext.resourcePath
  const fileName = basename(filePath)
  const localName = pluginOptions.localIdentName.length
    ? pluginOptions.localIdentName.replace(/\[local\]/gi, () => className)
    : className

  const content = `${styles}-${filePath}-${fileName}-${className}`

  let interpolatedName = interpolateName(loaderContext, localName, { content })

  // prevent class error when the generated classname starts from a non word charater
  if (/^(?![a-zA-Z_])/.test(interpolatedName)) {
    interpolatedName = `_${interpolatedName}`
  }

  // prevent svelte "Unused CSS selector" warning when the generated classname ends by `-`
  if (interpolatedName.slice(-1) === '-') {
    interpolatedName = interpolatedName.slice(0, -1)
  }

  return interpolatedName
}

module.exports = function(source) {
  this.cacheable()

  const loaderContext = this
  const loaderOptions = getOptions(this) || {}

  validateOptions(schema, loaderOptions, 'Svelte Css Module loader')

  for (const option in loaderOptions) {
    pluginOptions[option] = loaderOptions[option]
  }

  if (regex.module.test(source)) {
    const styles = source.match(regex.style)
    let parsedStyles = null

    let parsedSource = source.replace(regex.module, (match, className) => {
      let replacement = ''

      if (styles.length) {
        const classRegex = new RegExp(`\\.(${className})\\b(?![-_])`, 'gm')
        const toBeParsed = parsedStyles ? parsedStyles : styles[0]

        if (classRegex.test(toBeParsed)) {
          const interpolatedName = generateName(
            loaderContext,
            styles[0],
            className
          )
          parsedStyles = toBeParsed.replace(
            classRegex,
            () => `.${interpolatedName}`
          )
          replacement = interpolatedName
        }
      }
      return replacement
    })

    if (parsedStyles) {
      parsedSource = parsedSource.replace(regex.style, parsedStyles)
    }
    return parsedSource
  }
  return source
}
