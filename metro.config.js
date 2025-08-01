const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind v2 doesn't require metro config changes
module.exports = config;

