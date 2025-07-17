// style-dictionary.config.mjs
export default {
  source: [
    "src/tokens/aliases.flat.json"
  ],
  platforms: {
    css: {
      transformGroup: "css",
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