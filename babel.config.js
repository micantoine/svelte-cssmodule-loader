module.exports = function(api) {
  api.cache(false)
  return {
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current'
              }
            }
          ]
        ]
      }
    }
  }
}
