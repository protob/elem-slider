'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Renderer = /*#__PURE__*/function () {
  function Renderer(id) {
    _classCallCheck(this, Renderer);

    this.id = id.indexOf("#") !== -1 ? id.substr(1) : id;
  }

  _createClass(Renderer, [{
    key: "prepareHandle",
    value: function prepareHandle(handleNr) {
      var offset = handleNr === 1 ? 0 : "100%";
      var html = "<div class=\"".concat(this.id, "-handle").concat(handleNr, " el-slider-handle").concat(handleNr, "\" id=\"").concat(this.id, "-handle").concat(handleNr, "\" data-parent-id=\"").concat(this.id, "\" style=\"left: ").concat(offset, "\">\n    <span class=\"").concat(this.id, "-handle1-indicator el-slider-handle").concat(handleNr, "-indicator\" id=\"").concat(this.id, "-handle").concat(handleNr, "-indicator\"></span>\n    </div>");
      return html;
    }
  }, {
    key: "prepareMarkup",
    value: function prepareMarkup() {
      var handle1 = this.prepareHandle(1),
          handle2 = this.prepareHandle(2);
      var html = "<div class=\"el-slider-wrap\" > \n      <div id=\"".concat(this.id, "-el-slider\" class=\"el-slider ").concat(this.id, "-el-slider\">").concat(handle1).concat(handle2, "</div> \n      <div id=\"").concat(this.id, "-value1\" class=\"el-slider-value ").concat(this.id, "-value\"></div > \n      <div id=\"").concat(this.id, "-value2\" class=\"el-slider-value ").concat(this.id, "-value\" > \n      </div>\n      </div>");
      return html;
    }
  }, {
    key: "renderMarkup",
    value: function renderMarkup() {
      var html = this.prepareMarkup(),
          wrapper = document.querySelector("#" + this.id);

      if (wrapper) {
        wrapper.innerHTML = html;
      }
    }
  }]);

  return Renderer;
}();

function roundTo(val, num) {
  var resto = val % num;

  if (resto <= num / 2) {
    return val - resto;
  } else {
    return val + num - resto;
  }
}
function mapRange(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var defaults = {
  isRangeSlider: true,
  outputId: "el-slider1-value1",
  start: 0,
  end: 100,
  range: 1200,
  step: 10,
  value: 0,
  offset: 0,
  sliderWidth: 300,
  sliderHeight: 10,
  offsetWidth: 0,
  currentHandle: {
    id: "",
    elem: document.getElementById("output1-handle1"),
    posX: 0,
    leftOffset: 0,
    width: 20,
    height: 20
  },
  handle1: {
    posX: 0,
    limit: 0,
    id: "",
    start: 0,
    end: 100,
    width: 20,
    height: 20
  },
  handle2: {
    posX: 0,
    limit: 0,
    id: "",
    start: 100,
    end: 100,
    width: 20,
    height: 20
  }
};
var Actions = /*#__PURE__*/function () {
  function Actions(id, params) {
    var _this = this;

    _classCallCheck(this, Actions);

    /*=============================================
    =            Setup options            =
    =============================================*/
    this.setupOptions = function () {
      var elId = "#" + _this.id + "-el-slider";
      var el = document.querySelector(elId);
      _this.opts.sliderWidth = el.offsetWidth;
      _this.opts.offsetWidth = el.offsetWidth;
      _this.opts.sliderHeight = el.offsetHeight;
    };
    /*=============================================
    =           SETUP EVENTS           =
    =============================================*/


    this.setupEvents = function (elem) {
      // EVENT START DRAG
      elem.addEventListener(_this.EVstart, function (event) {
        event.preventDefault();

        _this.drag(event);

        return false;
      }, false); // EVENT END

      document.addEventListener(_this.EVend, function () {
        return _this.canmoveHandle = false;
      }, false); // EVENT SNAP HANDLE

      document.addEventListener(_this.EVstart, function (event) {
        _this.snapHandle(event);

        return _this.canmoveHandle = true;
      }, false);
    };
    /*=============================================
    =           CALC HANDLE POSITION           =
    =============================================*/


    this.calculateHandlePostion = function (event) {
      var handleTag = event.target;
      var targetId = handleTag.id;
      var outputId = targetId.indexOf("handle1") !== -1 ? _this.id + "-value1" : _this.id + "-value2";
      _this.opts.outputId = outputId;
      _this.opts.currentHandle.elem = event.target;
      _this.opts.currentHandle.id = event.target.id;
      _this.opts.currentHandle.width = handleTag.offsetWidth;
      _this.opts.sliderWidth = _this.opts.offsetWidth;
    };
    /*=============================================
    =           DRAG         =
    =============================================*/


    this.drag = function (event) {
      event.preventDefault();

      if (event.target.id === _this.id + "-handle1" || event.target.id === _this.id + "-handle2") {
        _this.calculateHandlePostion(event);

        document.addEventListener(_this.EVmove, _this.move, false);
      }
    };
    /*=============================================
    =           DROP       =
    =============================================*/


    this.drop = function () {
      document.removeEventListener(_this.EVmove, _this.move, false);
      document.removeEventListener(_this.EVend, _this.drop, false);
    };
    /*=============================================
    =           MOVE       =
    =============================================*/


    this.move = function (event) {
      document.addEventListener(_this.EVend, function () {
        document.removeEventListener(_this.EVmove, _this.move, false);
        document.removeEventListener(_this.EVend, _this.drop, false);
      }, false);
      var clientX = "ontouchstart" in document.documentElement ? event.touches[0].clientX : event.clientX;
      _this.opts.currentHandle.leftOffset = clientX - _this.opts.currentHandle.posX; // Fix for left edge

      if (_this.opts.currentHandle.leftOffset < 0) {
        _this.opts.currentHandle.leftOffset = 0;
      } // Fix for right edge


      if (_this.opts.currentHandle.leftOffset - _this.opts.currentHandle.width >= _this.opts.sliderWidth - _this.opts.currentHandle.width) {
        _this.opts.currentHandle.leftOffset = _this.opts.sliderWidth;
      } // If handle should be moved


      if (_this.canmoveHandle) {
        _this.moveHandle(event.target.id);

        if (_this.opts.isRangeSlider) {
          _this.limitOppositeHandles(_this.id);
        }
      }
    };
    /*=============================================
    =          MOVE HANDLE     =
    =============================================*/


    this.moveHandle = function (handleId) {
      var handle = _this.opts.currentHandle.elem;
      handle.style.left = _this.opts.currentHandle.leftOffset + "px";

      _this.updateValue();
    };
    /*=============================================
    =         GARDS FOR LIMITNG OPOSITE HANDLES    =
    =============================================*/


    this.limitOppositeHandles = function (sliderId) {
      var handle = _this.opts.currentHandle.elem;
      _this.opts.handle1.limit = _this.handle1Elem.offsetLeft;
      _this.opts.handle2.limit = _this.handle2Elem.offsetLeft;
      _this.opts.handle1.posX = _this.handle1Elem.offsetLeft;
      _this.opts.handle2.posX = _this.handle2Elem.offsetLeft;

      if (_this.opts.currentHandle.id.indexOf("handle1") !== -1) {
        if (_this.opts.handle1.posX >= _this.opts.handle2.limit) {
          handle.style.background = "red";
          _this.handle1Elem.style.left = _this.opts.handle1.limit + "px";
          _this.handle2Elem.style.left = _this.opts.handle1.limit + "px";
        }
      } else {
        if (_this.opts.handle2.posX <= _this.opts.handle1.limit) {
          handle.style.background = "red";
          _this.handle2Elem.style.left = _this.opts.handle2.limit + "px";
          _this.handle1Elem.style.left = _this.opts.handle2.limit + "px";
        }
      }
    };
    /*=============================================
    =          SNAP HANDLE    =
    =============================================*/


    this.snapHandle = function (event) {
      var wrapperId = _this.id + "-el-slider";
      var arr = [wrapperId, _this.id + "-handle2-indicator", _this.id + "-handle1-indicator"];
      var handle1 = document.querySelector("#" + _this.id + " .el-slider-handle1");
      var handle2 = document.querySelector("#" + _this.id + " .el-slider-handle2");

      if (arr.indexOf(event.target.id) != -1) {
        var clientX = "ontouchstart" in document.documentElement ? event.touches[0].clientX : event.clientX;
        var arrowPosX = clientX - _this.opts.offset;
        var diff1 = Math.abs(arrowPosX - _this.opts.handle1.posX);
        var diff2 = Math.abs(arrowPosX - _this.opts.handle2.posX); //------FIRST HANDLE--------

        if (diff1 < diff2) {
          handle1.style.left = arrowPosX + "px";
          _this.opts.outputId = _this.id + "-value1";
        } else {
          //------SECOND HANDLE--------
          var handle2Limit = _this.opts.sliderWidth;
          var handle2PosX = arrowPosX; // ------ FIX RIGHT EDGE ----

          if (handle2PosX >= handle2Limit) {
            handle2.style.background = "pink";
            setTimeout(function () {
              handle2.style.left = "100%";
            }, 1);
          }

          handle2.style.left = arrowPosX + "px";
          _this.opts.outputId = _this.id + "-value2";
        }

        _this.changeHandlePosAndVal(clientX);
      }
    };
    /*=============================================
    =          CHANGE HANDLE POSITON AND BALUE   =
    =============================================*/


    this.changeHandlePosAndVal = function (clientX) {
      var val = parseInt(clientX);
      _this.opts.currentHandle.leftOffset = val - _this.opts.currentHandle.posX;

      _this.updateValue();
    };

    this.opts = Object.assign(Object.assign({}, defaults), params);
    this.id = id.indexOf("#") !== -1 ? id.substr(1) : id;
    this.canmoveHandle = false;
    this.EVstart = "ontouchstart" in document.documentElement ? "touchstart" : "mousedown";
    this.EVmove = "ontouchstart" in document.documentElement ? "touchmove" : "mousemove";
    this.EVend = "ontouchstart" in document.documentElement ? "touchend" : "mouseup";
    var elem = document.querySelector("#" + this.id + " .el-slider");
    this.handle1Elem = document.getElementById("".concat(this.id, "-handle1"));
    this.handle2Elem = document.getElementById("".concat(this.id, "-handle2"));
    this.setupEvents(elem);
    this.setupOptions();
    this.updateValue(true);
  }
  /*=============================================
  =           UPDATE VALUE         =
  =============================================*/


  _createClass(Actions, [{
    key: "updateValue",
    value: function updateValue() {
      var isInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (isInit) {
        var output1 = document.getElementById(this.id + "-value1"),
            output2 = document.getElementById(this.id + "-value2");

        if (output1 && output2) {
          output1.innerHTML = this.opts.handle1.start.toFixed(2);
          output2.innerHTML = this.opts.range.toFixed(2);
        }
      } else {
        var v = mapRange(this.opts.currentHandle.leftOffset, 0, this.opts.sliderWidth, 0, this.opts.range); // 0

        var value = roundTo(v, this.opts.step);
        this.opts.value = value;
        var output = document.getElementById(this.opts.outputId);
        output.innerHTML = this.opts.value.toFixed(2);
      }
    }
  }]);

  return Actions;
}();

var ElemSlider = /*#__PURE__*/function () {
  function ElemSlider(elemId, params) {
    _classCallCheck(this, ElemSlider);

    this.id = elemId.indexOf("#") !== -1 ? elemId.substr(1) : elemId; //  this.opts = { ...defaults, ...params };

    this.opts = Object.assign({}, params);
    var el = document.getElementById(this.id);

    if (el) {
      var renderer = new Renderer(this.id);
      renderer.renderMarkup();
      var actions = new Actions(this.id, Object.assign({}, this.opts));
    } else {
      console.log("Element with id: #".concat(this.id, " does not exist"));
    }
  }

  _createClass(ElemSlider, [{
    key: "printOptions",
    value: function printOptions() {
      console.log(this.opts);
      console.log(this.id);
    }
  }]);

  return ElemSlider;
}();

exports.ElemSlider = ElemSlider;
