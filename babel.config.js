module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ];
  const plugins = [];

  // Check if the current environment is production
  if (process.env.NODE_ENV === 'production') {
    plugins.push("transform-remove-console");
  }

  return {
    presets,
    plugins
  };
};