module.exports = {
  source: [
    "src/tokens/aliases.flat.json"
  ],
  platforms: {
    css: {
      transforms: ["name/cti/underscore", "value/px-if-number", "attribute/cti", "name/cti/kebab", "time/seconds", "content/icon", "color/css"],
      buildPath: "src/tokens/build/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables"
        }
      ]
    }
  }
}; 