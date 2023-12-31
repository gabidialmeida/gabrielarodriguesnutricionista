//https://app.landingpage.com.br/construtor/assets/js/wow.js prevented not minified
/* eslint-disable prefer-const */
(function() {
    let MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __indexOf = [].indexOf || function(item) { for (let i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  
    Util = (function() {
      function Util() {}
  
      Util.prototype.extend = function(custom, defaults) {
        let key, value;
        for (key in defaults) {
          value = defaults[key];
          if (custom[key] == null) {
            custom[key] = value;
          }
        }
        return custom;
      };
  
      Util.prototype.isMobile = function(agent) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
      };
  
      Util.prototype.createEvent = function(event, bubble, cancel, detail) {
        let customEvent;
        if (bubble == null) {
          bubble = false;
        }
        if (cancel == null) {
          cancel = false;
        }
        if (detail == null) {
          detail = null;
        }
        if (document.createEvent != null) {
          customEvent = document.createEvent('CustomEvent');
          customEvent.initCustomEvent(event, bubble, cancel, detail);
        } else if (document.createEventObject != null) {
          customEvent = document.createEventObject();
          customEvent.eventType = event;
        } else {
          customEvent.eventName = event;
        }
        return customEvent;
      };
  
      Util.prototype.emitEvent = function(elem, event) {
        if (elem.dispatchEvent != null) {
          return elem.dispatchEvent(event);
        } else if (event in (elem != null)) {
          return elem[event]();
        } else if (('on' + event) in (elem != null)) {
          return elem['on' + event]();
        }
      };
  
      Util.prototype.addEvent = function(elem, event, fn) {
        if (elem.addEventListener != null) {
          return elem.addEventListener(event, fn, false);
        } else if (elem.attachEvent != null) {
          return elem.attachEvent('on' + event, fn);
        } else {
          return elem[event] = fn;
        }
      };
  
      Util.prototype.removeEvent = function(elem, event, fn) {
        if (elem.removeEventListener != null) {
          return elem.removeEventListener(event, fn, false);
        } else if (elem.detachEvent != null) {
          return elem.detachEvent('on' + event, fn);
        } else {
          return delete elem[event];
        }
      };
  
      Util.prototype.innerHeight = function() {
        if ('innerHeight' in window) {
          return window.innerHeight;
        } else {
          return document.documentElement.clientHeight;
        }
      };
  
      return Util;
  
    })();
  
    WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
      function WeakMap() {
        this.keys = [];
        this.values = [];
      }
  
      WeakMap.prototype.get = function(key) {
        let i, item, _i, _len, _ref;
        _ref = this.keys;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          item = _ref[i];
          if (item === key) {
            return this.values[i];
          }
        }
      };
  
      WeakMap.prototype.set = function(key, value) {
        let i, item, _i, _len, _ref;
        _ref = this.keys;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          item = _ref[i];
          if (item === key) {
            this.values[i] = value;
            return;
          }
        }
        this.keys.push(key);
        return this.values.push(value);
      };
  
      return WeakMap;
  
    })());
  
    MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
      function MutationObserver() {
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('MutationObserver is not supported by your browser.');
        }
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
        }
      }
  
      MutationObserver.notSupported = true;
  
      MutationObserver.prototype.observe = function() {};
  
      return MutationObserver;
  
    })());
  
    getComputedStyle = this.getComputedStyle || function(el, pseudo) {
      this.getPropertyValue = function(prop) {
        let _ref;
        if (prop === 'float') {
          prop = 'styleFloat';
        }
        if (getComputedStyleRX.test(prop)) {
          prop.replace(getComputedStyleRX, function(_, _char) {
            return _char.toUpperCase();
          });
        }
        return ((_ref = el.currentStyle) != null ? _ref[prop] : void 0) || null;
      };
      return this;
    };
  
    getComputedStyleRX = /(\-([a-z]){1})/g;
  
    this.WOW = (function() {
      WOW.prototype.defaults = {
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true,
        callback: null,
        scrollContainer: null
      };
  
      function WOW(options) {
        if (options == null) {
          options = {};
        }
        this.scrollCallback = __bind(this.scrollCallback, this);
        this.scrollHandler = __bind(this.scrollHandler, this);
        this.resetAnimation = __bind(this.resetAnimation, this);
        this.start = __bind(this.start, this);
        this.scrolled = true;
        this.config = this.util().extend(options, this.defaults);
        if (options.scrollContainer != null) {
          this.config.scrollContainer = document.querySelector(options.scrollContainer);
        }
        this.animationNameCache = new WeakMap();
        this.wowEvent = this.util().createEvent(this.config.boxClass);
      }
  
      WOW.prototype.init = function() {
        let _ref;
        this.element = window.document.documentElement;
        if ((_ref = document.readyState) === 'interactive' || _ref === 'complete') {
          this.start();
        } else {
          this.util().addEvent(document, 'DOMContentLoaded', this.start);
        }
        return this.finished = [];
      };
  
      WOW.prototype.start = function() {
        let box, _i, _len, _ref;
        this.stopped = false;
        this.boxes = (function() {
          let _i, _len, _ref, _results;
          _ref = this.element.querySelectorAll('.' + this.config.boxClass);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            box = _ref[_i];
            _results.push(box);
          }
          return _results;
        }).call(this);
        this.all = (function() {
          let _i, _len, _ref, _results;
          _ref = this.boxes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            box = _ref[_i];
            _results.push(box);
          }
          return _results;
        }).call(this);
        if (this.boxes.length) {
          if (this.disabled()) {
            this.resetStyle();
          } else {
            _ref = this.boxes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              box = _ref[_i];
              this.applyStyle(box, true);
            }
          }
        }
        if (!this.disabled()) {
          this.util().addEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
          this.util().addEvent(window, 'resize', this.scrollHandler);
          this.interval = setInterval(this.scrollCallback, 50);
        }
        if (this.config.live) {
          return new MutationObserver((function(_this) {
            return function(records) {
              let node, record, _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
                record = records[_j];
                _results.push((function() {
                  let _k, _len2, _ref1, _results1;
                  _ref1 = record.addedNodes || [];
                  _results1 = [];
                  for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                    node = _ref1[_k];
                    _results1.push(this.doSync(node));
                  }
                  return _results1;
                }).call(_this));
              }
              return _results;
            };
          })(this)).observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      };
  
      WOW.prototype.stop = function() {
        this.stopped = true;
        this.util().removeEvent(this.config.scrollContainer || window, 'scroll', this.scrollHandler);
        this.util().removeEvent(window, 'resize', this.scrollHandler);
        if (this.interval != null) {
          return clearInterval(this.interval);
        }
      };
  
      WOW.prototype.sync = function(element) {
        if (MutationObserver.notSupported) {
          return this.doSync(this.element);
        }
      };
  
      WOW.prototype.doSync = function(element) {
        let box, _i, _len, _ref, _results;
        if (element == null) {
          element = this.element;
        }
        if (element.nodeType !== 1) {
          return;
        }
        element = element.parentNode || element;
        _ref = element.querySelectorAll('.' + this.config.boxClass);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          box = _ref[_i];
          if (__indexOf.call(this.all, box) < 0) {
            this.boxes.push(box);
            this.all.push(box);
            if (this.stopped || this.disabled()) {
              this.resetStyle();
            } else {
              this.applyStyle(box, true);
            }
            _results.push(this.scrolled = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
  
      WOW.prototype.show = function(box) {
        this.applyStyle(box);
        box.className = box.className + ' ' + this.config.animateClass;
        if (this.config.callback != null) {
          this.config.callback(box);
        }
        this.util().emitEvent(box, this.wowEvent);
        this.util().addEvent(box, 'animationend', this.resetAnimation);
        this.util().addEvent(box, 'oanimationend', this.resetAnimation);
        this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
        this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
        return box;
      };
  
      WOW.prototype.applyStyle = function(box, hidden) {
        let delay, duration, iteration;
        duration = box.getAttribute('data-wow-duration');
        delay = box.getAttribute('data-wow-delay');
        iteration = box.getAttribute('data-wow-iteration');
        return this.animate((function(_this) {
          return function() {
            return _this.customStyle(box, hidden, duration, delay, iteration);
          };
        })(this));
      };
  
      WOW.prototype.animate = (function() {
        if ('requestAnimationFrame' in window) {
          return function(callback) {
            return window.requestAnimationFrame(callback);
          };
        } else {
          return function(callback) {
            return callback();
          };
        }
      })();
  
      WOW.prototype.resetStyle = function() {
        let box, _i, _len, _ref, _results;
        _ref = this.boxes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          box = _ref[_i];
          _results.push(box.style.visibility = 'visible');
        }
        return _results;
      };
  
      WOW.prototype.resetAnimation = function(event) {
        let target;
        if (event.type.toLowerCase().indexOf('animationend') >= 0) {
          target = event.target || event.srcElement;
  
          target.style.cssText += 'visibility: visible !important;';
  
          const className = target.className.baseVal ? target.className.baseVal : target.className;
          console.log(target);
          return target.className = className?.replace(this.config.animateClass, '')?.trim();
        }
      };
  
      WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
        if (hidden) {
          this.cacheAnimationName(box);
        }
        
        // box.style.visibility = hidden ? 'hidden' : 'visible';
  
        const infinite = box?.classList.contains('infinite');
  
        if (duration) {
          this.vendorSet(box.style, {
            animationDuration: duration
          });
        }
        if (delay) {
          this.vendorSet(box.style, {
            animationDelay: delay
          });
        }
        if (iteration) {
          this.vendorSet(box.style, {
            animationIterationCount: iteration
          });
        }
        this.vendorSet(box.style, {
          animationName: infinite ? this.cachedAnimationName(box) : hidden ? 'none' : this.cachedAnimationName(box)
        });
  
        return box;
      };
  
      WOW.prototype.vendors = ['moz', 'webkit'];
  
      WOW.prototype.vendorSet = function(elem, properties) {
        let name, value, vendor, _results;
        _results = [];
        for (name in properties) {
          value = properties[name];
          elem['' + name] = value;
          _results.push((function() {
            let _i, _len, _ref, _results1;
            _ref = this.vendors;
            _results1 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              vendor = _ref[_i];
              _results1.push(elem['' + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };
  
      WOW.prototype.vendorCSS = function(elem, property) {
        let result, style, vendor, _i, _len, _ref;
        style = getComputedStyle(elem);
        result = style.getPropertyCSSValue(property);
        _ref = this.vendors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vendor = _ref[_i];
          result = result || style.getPropertyCSSValue('-' + vendor + '-' + property);
        }
        return result;
      };
  
      WOW.prototype.animationName = function(box) {
        let animationName;
        try {
          animationName = this.vendorCSS(box, 'animation-name').cssText;
        } catch (_error) {
          animationName = getComputedStyle(box).getPropertyValue('animation-name');
        }
        if (animationName === 'none') {
          return '';
        } else {
          return animationName;
        }
      };
  
      WOW.prototype.cacheAnimationName = function(box) {
        return this.animationNameCache.set(box, this.animationName(box));
      };
  
      WOW.prototype.cachedAnimationName = function(box) {
        return this.animationNameCache.get(box);
      };
  
      WOW.prototype.scrollHandler = function() {
        return this.scrolled = true;
      };
  
      WOW.prototype.scrollCallback = function() {
        let box;
        if (this.scrolled) {
          this.scrolled = false;
          this.boxes = (function() {
            let _i, _len, _ref, _results;
            _ref = this.boxes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              box = _ref[_i];
              if (!(box)) {
                continue;
              }
              if (this.isVisible(box)) {
                this.show(box);
  
                if(box.classList && box.classList.contains('lp-progresso')) {
                  try {
                      // eslint-disable-next-line no-undef
                      ativarProgresso(box);
                  }catch(err) {
                    // 
                  }
                }
  
                if(box.classList && box.classList.contains('texto-highlight')) {
                  try {
                    // eslint-disable-next-line no-undef
                    anotarTexto(box);
                  }catch(err) {
                    // 
                  }
                }
  
                continue;
              }
              _results.push(box);
            }
            return _results;
          }).call(this);
          if (!(this.boxes.length || this.config.live)) {
            return this.stop();
          }
        }
      };
  
      WOW.prototype.offsetTop = function(element) {
        let top;
        while (element.offsetTop === void 0) {
          element = element.parentNode;
        }
        top = element.offsetTop;
        // eslint-disable-next-line no-cond-assign
        while (element = element.offsetParent) {
          top += element.offsetTop;
        }
        return top;
      };
  
      WOW.prototype.isVisible = function(box) {
        let bottom, offset, top, viewBottom, viewTop;
        offset = box.getAttribute('data-wow-offset') || this.config.offset;
        viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset;
        viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
        top = this.offsetTop(box);
        bottom = top + box.clientHeight;
  
        return top <= viewBottom && bottom >= viewTop;
      };
  
      WOW.prototype.util = function() {
        return this._util != null ? this._util : this._util = new Util();
      };
  
      WOW.prototype.disabled = function() {
        return !this.config.mobile && this.util().isMobile(navigator.userAgent);
      };
  
      return WOW;
  
    })();
  
  }).call(this);
  