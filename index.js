'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cacheRoute.min.js');
} else {
  module.exports = require('./dist/cacheRoute.js');
}