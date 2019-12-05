(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types'), require('react-router-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', 'react-router-dom'], factory) :
  (factory((global.CacheRoute = {}),global.React,global.PropTypes,global.reactRouterDom));
}(this, (function (exports,React,PropTypes,reactRouterDom) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

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

  var isArray = function isArray(val) {
    return val instanceof Array;
  };

  var isNaN = function isNaN(val) {
    return val !== val;
  };

  var isNumber = function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
  };
  // 值类型判断 -------------------------------------------------------------

  var get = function get(obj) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments[2];

    try {
      if (isNumber(keys)) {
        keys = String(keys);
      }
      var result = (isString(keys) ? keys.split('.') : keys).reduce(function (res, key) {
        return res[key];
      }, obj);
      return isUndefined(result) ? defaultValue : result;
    } catch (e) {
      return defaultValue;
    }
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

  var value = function value() {
    for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }

    return values.reduce(function (value, nextValue) {
      return isUndefined(value) ? run(nextValue) : run(value);
    }, undefined);
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

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

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var getImplementation = function getImplementation() {
    if (typeof self !== 'undefined') {
      return self;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }

    return Function('return this')();
  };

  var implementation = getImplementation();

  var getGlobal = function getGlobal() {
    if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) !== 'object' || !global || global.Math !== Math || global.Array !== Array) {
      return implementation;
    }
    return global;
  };

  var globalThis = getGlobal();

  var flatten = function flatten(array) {
    return array.reduce(function (res, item) {
      return [].concat(toConsumableArray(res), toConsumableArray(isArray(item) ? flatten(item) : [item]));
    }, []);
  };

  /**
   * [钳子] 用来将数字限制在给定范围内
   * @param {Number} value 被限制值
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   */
  var clamp = function clamp(value, min) {
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;

    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  };

  var body = get(globalThis, 'document.body');
  var screenScrollingElement = get(globalThis, 'document.scrollingElement', get(globalThis, 'document.documentElement', {}));

  function isScrollableNode() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!isExist(node)) {
      return false;
    }

    return node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
  }

  function getScrollableNodes(from) {
    if (!isFunction(get(globalThis, 'document.getElementById'))) {
      return [];
    }

    return [].concat(toConsumableArray(value(run(from, 'querySelectorAll', '*'), [])), [from]).filter(isScrollableNode);
  }

  function saveScrollPosition(from) {
    var nodes = [].concat(toConsumableArray(new Set([].concat(toConsumableArray(flatten((!isArray(from) ? [from] : from).map(getScrollableNodes))), toConsumableArray([screenScrollingElement, body].filter(isScrollableNode))))));

    var saver = nodes.map(function (node) {
      return [node, {
        x: node.scrollLeft,
        y: node.scrollTop
      }];
    });

    return function revert() {
      saver.forEach(function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            node = _ref2[0],
            _ref2$ = _ref2[1],
            x = _ref2$.x,
            y = _ref2$.y;

        node.scrollLeft = x;
        node.scrollTop = y;
      });
    };
  }

  var __components = {};

  var getCachedComponentEntries = function getCachedComponentEntries() {
    return Object.entries(__components).filter(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          cache = _ref2[1];

      return cache instanceof CacheComponent ? cache.state.cached : Object.values(cache).some(function (cache) {
        return cache.state.cached;
      });
    });
  };

  var getCache = function getCache() {
    return _extends({}, __components);
  };

  var register = function register(key, component) {
    __components[key] = component;
  };

  var remove = function remove(key) {
    delete __components[key];
  };

  var dropComponent = function dropComponent(component) {
    return run(component, 'reset');
  };

  var dropByCacheKey = function dropByCacheKey(key) {
    var cache = get(__components, [key]);

    if (!cache) {
      return;
    }

    if (cache instanceof CacheComponent) {
      dropComponent(cache);
    } else {
      Object.values(cache).forEach(dropComponent);
    }
  };

  var clearCache = function clearCache() {
    getCachedComponentEntries().forEach(function (_ref3) {
      var _ref4 = slicedToArray(_ref3, 1),
          key = _ref4[0];

      return dropByCacheKey(key);
    });
  };

  var getCachingKeys = function getCachingKeys() {
    return getCachedComponentEntries().map(function (_ref5) {
      var _ref6 = slicedToArray(_ref5, 1),
          key = _ref6[0];

      return key;
    });
  };

  var getCachingComponents = function getCachingComponents() {
    return getCachedComponentEntries().reduce(function (res, _ref7) {
      var _ref8 = slicedToArray(_ref7, 2),
          key = _ref8[0],
          cache = _ref8[1];

      return _extends({}, res, cache instanceof CacheComponent ? defineProperty({}, key, cache) : Object.entries(cache).reduce(function (res, _ref10) {
        var _ref11 = slicedToArray(_ref10, 2),
            pathname = _ref11[0],
            cache = _ref11[1];

        return _extends({}, res, defineProperty({}, key + '.' + pathname, cache));
      }, {}));
    }, {});
  };

  var isUsingNewLifecycle = isExist(React__default.forwardRef);

  var COMPUTED_UNMATCH_KEY = '__isComputedUnmatch';
  var isMatch = function isMatch(match) {
    return isExist(match) && get(match, COMPUTED_UNMATCH_KEY) !== true;
  };

  var getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    var nextPropsMatch = nextProps.match,
        _nextProps$when = nextProps.when,
        when = _nextProps$when === undefined ? 'forward' : _nextProps$when;

    /**
     * Note:
     * Turn computedMatch from CacheSwitch to a real null value
     *
     * 将 CacheSwitch 计算得到的 computedMatch 值转换为真正的 null
     */

    if (!isMatch(nextPropsMatch)) {
      nextPropsMatch = null;
    }

    if (!prevState.cached && nextPropsMatch) {
      return {
        cached: true,
        matched: true
      };
    }

    /**
     * Determines whether it needs to cancel the cache based on the next unmatched props action
     *
     * 根据下个未匹配状态动作决定是否需要取消缓存
     */
    if (prevState.matched && !nextPropsMatch) {
      var nextAction = get(nextProps, 'history.action');

      var __cancel__cache = false;

      if (isFunction(when)) {
        __cancel__cache = !when(nextProps);
      } else {
        switch (when) {
          case 'always':
            break;
          case 'back':
            if (['PUSH', 'REPLACE'].includes(nextAction)) {
              __cancel__cache = true;
            }

            break;
          case 'forward':
          default:
            if (nextAction === 'POP') {
              __cancel__cache = true;
            }
        }
      }

      if (__cancel__cache) {
        return {
          cached: false,
          matched: false
        };
      }
    }

    return {
      matched: !!nextPropsMatch
    };
  };

  var CacheComponent = function (_Component) {
    inherits(CacheComponent, _Component);

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

        /**
         * New lifecycle for replacing the `componentWillReceiveProps` in React 16.3 +
         * React 16.3 + 版本中替代 componentWillReceiveProps 的新生命周期
         */
      };
      _this.componentWillReceiveProps = !isUsingNewLifecycle ? function (nextProps) {
        var nextState = getDerivedStateFromProps(nextProps, _this.state);

        _this.setState(nextState);
      } : undefined;

      _this.injectDOM = function () {
        try {
          run(_this.__parentNode, 'insertBefore', _this.wrapper, _this.__placeholderNode);
          run(_this.__parentNode, 'removeChild', _this.__placeholderNode);
        } catch (err) {
          // nothing
        }
      };

      _this.ejectDOM = function () {
        try {
          var parentNode = get(_this.wrapper, 'parentNode');
          _this.__parentNode = parentNode;

          run(_this.__parentNode, 'insertBefore', _this.__placeholderNode, _this.wrapper);
          run(_this.__parentNode, 'removeChild', _this.wrapper);
        } catch (err) {
          // nothing
        }
      };

      _this.reset = function () {
        delete _this.__revertScrollPos;

        _this.setState({
          cached: false
        });
      };

      _this.__cacheCreateTime = Date.now();
      _this.__cacheUpdateTime = _this.__cacheCreateTime;
      if (props.cacheKey) {
        if (get(props.cacheKey, 'multiple')) {
          var _props$cacheKey = props.cacheKey,
              cacheKey = _props$cacheKey.cacheKey,
              pathname = _props$cacheKey.pathname;

          register(cacheKey, _extends({}, getCache()[cacheKey], defineProperty({}, pathname, _this)));
        } else {
          register(props.cacheKey, _this);
        }
      }

      if (typeof document !== 'undefined') {
        _this.__placeholderNode = document.createComment(' Route cached ' + (props.cacheKey ? 'with cacheKey: "' + get(props.cacheKey, 'cacheKey', props.cacheKey) + '" ' : ''));
      }

      _this.state = getDerivedStateFromProps(props, {
        cached: false,
        matched: false
      });
      return _this;
    }

    /**
     * Compatible React 16.3 -
     * 兼容 React 16.3 - 版本
     */


    createClass(CacheComponent, [{
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        if (!prevState.cached || !this.state.cached) {
          return;
        }

        if (prevState.matched === true && this.state.matched === false) {
          if (this.props.unmount) {
            this.ejectDOM();
          }
          this.__cacheUpdateTime = Date.now();
          return run(this, 'cacheLifecycles.__listener.didCache');
        }

        if (prevState.matched === false && this.state.matched === true) {
          if (this.props.saveScrollPosition) {
            run(this.__revertScrollPos);
          }
          this.__cacheUpdateTime = Date.now();
          return run(this, 'cacheLifecycles.__listener.didRecover');
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        var willRecover = this.state.matched === false && nextState.matched === true;
        var willDrop = this.state.cached === true && nextState.cached === false;
        var shouldUpdate = this.state.matched || nextState.matched || this.state.cached !== nextState.cached;

        if (shouldUpdate) {
          if (this.props.unmount && willDrop || willRecover) {
            this.injectDOM();
          }

          if (!(willDrop || willRecover) && this.props.saveScrollPosition) {
            this.__revertScrollPos = saveScrollPosition(this.props.unmount ? this.wrapper : undefined);
          }
        }

        return shouldUpdate;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _props = this.props,
            cacheKeyConfig = _props.cacheKey,
            unmount = _props.unmount;


        if (get(cacheKeyConfig, 'multiple')) {
          var cacheKey = cacheKeyConfig.cacheKey,
              pathname = cacheKeyConfig.pathname;

          var cache = _extends({}, getCache()[cacheKey]);

          delete cache[pathname];

          if (Object.keys(cache).length === 0) {
            remove(cacheKey);
          } else {
            register(cacheKey, cache);
          }
        } else {
          remove(cacheKeyConfig);
        }

        if (unmount) {
          this.injectDOM();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            matched = _state.matched,
            cached = _state.cached;
        var _props2 = this.props,
            _props2$className = _props2.className,
            propsClassName = _props2$className === undefined ? '' : _props2$className,
            behavior = _props2.behavior,
            children = _props2.children;

        var _value = value(run(behavior, undefined, !matched), {}),
            _value$className = _value.className,
            behaviorClassName = _value$className === undefined ? '' : _value$className,
            behaviorProps = objectWithoutProperties(_value, ['className']);

        var className = run(propsClassName + ' ' + behaviorClassName, 'trim');
        var hasClassName = className !== '';

        return cached ? React__default.createElement(
          'div',
          _extends({
            className: hasClassName ? className : undefined
          }, behaviorProps, {
            ref: function ref(wrapper) {
              _this2.wrapper = wrapper;
            }
          }),
          run(children, undefined, this.cacheLifecycles)
        ) : null;
      }
    }]);
    return CacheComponent;
  }(React.Component);

  CacheComponent.propsTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    when: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(['forward', 'back', 'always'])]),
    behavior: PropTypes.func,
    unmount: PropTypes.bool,
    saveScrollPosition: PropTypes.bool
  };
  CacheComponent.defaultProps = {
    when: 'forward',
    unmount: false,
    saveScrollPosition: false,
    behavior: function behavior(cached) {
      return cached ? {
        style: {
          display: 'none'
        }
      } : undefined;
    }
  };
  CacheComponent.getDerivedStateFromProps = isUsingNewLifecycle ? getDerivedStateFromProps : undefined;

  var Updatable = function (_Component) {
    inherits(Updatable, _Component);

    function Updatable() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, Updatable);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Updatable.__proto__ || Object.getPrototypeOf(Updatable)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
        return run(_this.props, 'children');
      }, _this.shouldComponentUpdate = function (_ref2) {
        var when = _ref2.when;
        return when;
      }, _temp), possibleConstructorReturn(_this, _ret);
    }

    return Updatable;
  }(React.Component);

  Updatable.propsTypes = {
    when: PropTypes.bool.isRequired
  };

  var isEmptyChildren = function isEmptyChildren(children) {
    return React__default.Children.count(children) === 0;
  };
  var isFragmentable = isExist(React.Fragment);

  var CacheRoute = function (_Component) {
    inherits(CacheRoute, _Component);

    function CacheRoute() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, CacheRoute);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = CacheRoute.__proto__ || Object.getPrototypeOf(CacheRoute)).call.apply(_ref, [this].concat(args))), _this), _this.cache = {}, _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(CacheRoute, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            children = _props.children,
            render = _props.render,
            component = _props.component,
            className = _props.className,
            when = _props.when,
            behavior = _props.behavior,
            cacheKey = _props.cacheKey,
            unmount = _props.unmount,
            saveScrollPosition$$1 = _props.saveScrollPosition,
            computedMatchForCacheRoute = _props.computedMatchForCacheRoute,
            multiple = _props.multiple,
            restProps = objectWithoutProperties(_props, ['children', 'render', 'component', 'className', 'when', 'behavior', 'cacheKey', 'unmount', 'saveScrollPosition', 'computedMatchForCacheRoute', 'multiple']);

        /**
         * Note:
         * If children prop is a React Element, define the corresponding wrapper component for supporting multiple children
         *
         * 说明：如果 children 属性是 React Element 则定义对应的包裹组件以支持多个子组件
         */

        if (React__default.isValidElement(children) || !isEmptyChildren(children)) {
          render = function render() {
            return children;
          };
        }

        if (computedMatchForCacheRoute) {
          restProps.computedMatch = computedMatchForCacheRoute;
        }

        if (multiple && !isFragmentable) {
          multiple = false;
        }

        if (isNumber(multiple)) {
          multiple = clamp(multiple, 1);
        }

        return (
          /**
           * Only children prop of Route can help to control rendering behavior
           * 只有 Router 的 children 属性有助于主动控制渲染行为
           */
          React__default.createElement(
            reactRouterDom.Route,
            restProps,
            function (props) {
              var match = props.match,
                  computedMatch = props.computedMatch,
                  location = props.location;

              var isMatchCurrentRoute = isMatch(props.match);
              var currentPathname = location.pathname;

              var maxMultipleCount = isNumber(multiple) ? multiple : Infinity;
              var configProps = {
                when: when,
                className: className,
                behavior: behavior,
                cacheKey: cacheKey,
                unmount: unmount,
                saveScrollPosition: saveScrollPosition$$1
              };

              var renderSingle = function renderSingle(props) {
                return React__default.createElement(
                  CacheComponent,
                  props,
                  function (cacheLifecycles) {
                    return React__default.createElement(
                      Updatable,
                      { when: isMatch(props.match) },
                      function () {
                        Object.assign(props, { cacheLifecycles: cacheLifecycles });

                        if (component) {
                          return React__default.createElement(component, props);
                        }

                        return run(render || children, undefined, props);
                      }
                    );
                  }
                );
              };

              if (multiple && isMatchCurrentRoute) {
                _this2.cache[currentPathname] = {
                  updateTime: Date.now(),
                  render: renderSingle
                };

                Object.entries(_this2.cache).sort(function (_ref2, _ref3) {
                  var _ref5 = slicedToArray(_ref2, 2),
                      prev = _ref5[1];

                  var _ref4 = slicedToArray(_ref3, 2),
                      next = _ref4[1];

                  return next.updateTime - prev.updateTime;
                }).forEach(function (_ref6, idx) {
                  var _ref7 = slicedToArray(_ref6, 1),
                      pathname = _ref7[0];

                  if (idx >= maxMultipleCount) {
                    delete _this2.cache[pathname];
                  }
                });
              }

              return multiple ? React__default.createElement(
                React.Fragment,
                null,
                Object.entries(_this2.cache).map(function (_ref8) {
                  var _ref9 = slicedToArray(_ref8, 2),
                      pathname = _ref9[0],
                      render = _ref9[1].render;

                  var recomputedMatch = pathname === currentPathname ? match || computedMatch : null;

                  return React__default.createElement(
                    React.Fragment,
                    { key: pathname },
                    render(_extends({}, props, configProps, {
                      cacheKey: cacheKey ? {
                        cacheKey: cacheKey,
                        pathname: pathname,
                        multiple: true
                      } : undefined,
                      key: pathname,
                      match: recomputedMatch
                    }))
                  );
                })
              ) : renderSingle(_extends({}, props, configProps));
            }
          )
        );
      }
    }]);
    return CacheRoute;
  }(React.Component);

  CacheRoute.componentName = 'CacheRoute';
  CacheRoute.propTypes = {
    component: PropTypes.elementType || PropTypes.any,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    computedMatchForCacheRoute: PropTypes.object,
    multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
  };
  CacheRoute.defaultProps = {
    multiple: false
  };

  function getFragment() {
    if (isExist(React.Fragment)) {
      return function (_ref) {
        var children = _ref.children;
        return React__default.createElement(
          React.Fragment,
          null,
          children
        );
      };
    }

    if (isExist(React.PropTypes)) {
      return function (_ref2) {
        var children = _ref2.children;
        return React__default.createElement(
          'div',
          null,
          children
        );
      };
    }

    return function (_ref3) {
      var children = _ref3.children;
      return children;
    };
  }

  var SwitchFragment = getFragment();
  SwitchFragment.displayName = 'SwitchFragment';

  var isUsingNewContext = isExist(reactRouterDom.__RouterContext);

  var CacheSwitch = function (_Switch) {
    inherits(CacheSwitch, _Switch);

    function CacheSwitch() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, CacheSwitch);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = CacheSwitch.__proto__ || Object.getPrototypeOf(CacheSwitch)).call.apply(_ref, [this].concat(args))), _this), _this.getContext = function () {
        if (isUsingNewContext) {
          var _this$props = _this.props,
              location = _this$props.location,
              match = _this$props.match;


          return { location: location, match: match };
        } else {
          var route = _this.context.router.route;

          var _location = _this.props.location || route.location;

          return {
            location: _location,
            match: route.match
          };
        }
      }, _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(CacheSwitch, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            children = _props.children,
            which = _props.which;

        var _getContext = this.getContext(),
            location = _getContext.location,
            contextMatch = _getContext.match;

        var __matchedAlready = false;

        return React__default.createElement(
          Updatable,
          { when: isMatch(contextMatch) },
          function () {
            return React__default.createElement(
              SwitchFragment,
              null,
              React__default.Children.map(children, function (element) {
                if (!React__default.isValidElement(element)) {
                  return null;
                }

                var path = element.props.path || element.props.from;
                var match = __matchedAlready ? null : path ? reactRouterDom.matchPath(location.pathname, _extends({}, element.props, {
                  path: path
                }), contextMatch) : contextMatch;

                var child = void 0;

                if (which(element)) {
                  child = React__default.cloneElement(element, _extends({
                    location: location,
                    computedMatch: match
                  }, isNull(match) ? {
                    computedMatchForCacheRoute: defineProperty({}, COMPUTED_UNMATCH_KEY, true)
                  } : null));
                } else {
                  child = match && !__matchedAlready ? React__default.cloneElement(element, {
                    location: location,
                    computedMatch: match
                  }) : null;
                }

                if (!__matchedAlready) {
                  __matchedAlready = !!match;
                }

                return child;
              })
            );
          }
        );
      }
    }]);
    return CacheSwitch;
  }(reactRouterDom.Switch);

  if (isUsingNewContext) {
    CacheSwitch.propTypes = {
      children: PropTypes.node,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
      which: PropTypes.func
    };

    CacheSwitch = reactRouterDom.withRouter(CacheSwitch);
  } else {
    CacheSwitch.contextTypes = {
      router: PropTypes.shape({
        route: PropTypes.object.isRequired
      }).isRequired
    };

    CacheSwitch.propTypes = {
      children: PropTypes.node,
      location: PropTypes.object,
      which: PropTypes.func
    };
  }

  CacheSwitch.defaultProps = {
    which: function which(element) {
      return get(element, 'type') === CacheRoute;
    }
  };

  var CacheSwitch$1 = CacheSwitch;

  exports.default = CacheRoute;
  exports.CacheRoute = CacheRoute;
  exports.CacheSwitch = CacheSwitch$1;
  exports.dropByCacheKey = dropByCacheKey;
  exports.getCachingKeys = getCachingKeys;
  exports.clearCache = clearCache;
  exports.getCachingComponents = getCachingComponents;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
