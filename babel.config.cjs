module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "20"
        },
        modules: "commonjs"
      }
    ],
    [
      "@babel/preset-typescript",
      {
        allowDeclareFields: true,
        optimizeConstEnums: true
      }
    ]
  ],
  plugins: [
    "babel-plugin-typescript-path-aliases",
    [
      "@babel/plugin-proposal-decorators",
      {
        version: "2023-11"
      }
    ]
  ]
};
