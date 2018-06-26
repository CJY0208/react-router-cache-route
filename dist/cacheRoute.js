'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');

// 值类型判断 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var isUndefined = function isUndefined(val) {
  return typeof val === 'undefined';
};

var isNull = function isNull(val) {
  return val === null;
};

var isFunction = function isFunction(val) {
  return typeof val === 'function';
};

var isString = function isString(val) {
  return typeof val === 'string';
};

var isExist = function isExist(val) {
  return !(isUndefined(val) || isNull(val));
};
// 值类型判断 -------------------------------------------------------------

var get = function get(obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var defaultValue = arguments[2];


  keys = isString(keys) ? keys.split('.') : keys;

  var result = void 0;
  var res = obj;
  var idx = 0;

  for (; idx < keys.length; idx++) {
    var key = keys[idx];

    if (isExist(res)) {
      res = res[key];
    } else {
      break;
    }
  }

  if (idx === keys.length) {
    result = res;
  }

  return isUndefined(result) ? defaultValue : result;
};

var run = function run(obj) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  keys = isString(keys) ? keys.split('.') : keys;

  var func = get(obj, keys);
  var context = get(obj, keys.slice(0, -1));

  return isFunction(func) ? func.call.apply(func, [context].concat(args)) : func;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var CacheComponent = function (_Component) {
  inherits(CacheComponent, _Component);
  createClass(CacheComponent, [{
    key: 'render',
    value: function render() {
      return this.state.cached ? React__default.createElement(
        'div',
        { style: this.state.matched ? {} : {
            display: 'none'
          } },
        run(this.props, 'children', this.cacheLifecycles)
      ) : null;
    }
  }]);

  function CacheComponent(props) {
    var _ref;

    classCallCheck(this, CacheComponent);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _this = possibleConstructorReturn(this, (_ref = CacheComponent.__proto__ || Object.getPrototypeOf(CacheComponent)).call.apply(_ref, [this, props].concat(args)));

    _this.cacheLifecycles = {
      __listener: {},
      didCache: function didCache(listener) {
        _this.cacheLifecycles.__listener['didCache'] = listener;
      },
      didRecover: function didRecover(listener) {
        _this.cacheLifecycles.__listener['didRecover'] = listener;
      }
    };


    var matched = !!props.match;
    _this.state = {
      cached: matched,
      matched: matched
    };
    return _this;
  }

  // React 16.3+ 版本中替代 componentWillReceiveProps 的新生命周期


  createClass(CacheComponent, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (!prevState.cached || !this.state.cached) {
        return;
      }

      if (prevState.matched === true && this.state.matched === false) {
        run(this, 'cacheLifecycles.__listener.didCache');
      }

      if (prevState.matched === false && this.state.matched === true) {
        run(this, 'cacheLifecycles.__listener.didRecover');
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.matched || nextState.matched;
    }
  }]);
  return CacheComponent;
}(React.Component);

CacheComponent.getDerivedStateFromProps = function (nextProps, prevState) {
  if (!prevState.cached && nextProps.match) {
    return {
      cached: true,
      matched: true
    };
  }

  if (prevState.matched && nextProps.history.action === 'POP' && !nextProps.match) {
    return {
      cached: false,
      matched: false
    };
  }

  return {
    matched: !!nextProps.match
  };
};

var cacheComponent = function cacheComponent(Component) {
  return function (props) {
    return React__default.createElement(
      CacheComponent,
      props,
      function (cacheLifecycles) {
        return React__default.createElement(Component, _extends({}, props, { cacheLifecycles: cacheLifecycles }));
      }
    );
  };
};

var CacheRoute = function CacheRoute(_ref) {
  var component = _ref.component,
      props = objectWithoutProperties(_ref, ['component']);
  return React__default.createElement(reactRouterDom.Route, _extends({}, props, { children: cacheComponent(component) }));
};

exports.cacheComponent = cacheComponent;
exports.default = CacheRoute;
