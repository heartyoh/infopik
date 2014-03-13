(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var PIXEL_PER_MM, createHandle, createView, drawFunc, drawHorizontal, drawVertical;
    PIXEL_PER_MM = 3.779527559;
    drawHorizontal = function(context) {
      var baseY, bottomY, i, marginLeft, marginRight, minusCount, minusWidth, plusCount, plusWidth, startX, x, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _results;
      startX = parseInt(this.getAttr('zeropos'));
      marginLeft = this.getAttr('margin')[0];
      marginRight = this.width() - this.getAttr('margin')[1];
      baseY = this.height() - 15;
      bottomY = this.height();
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, this.height());
      context.lineTo(this.width(), this.height());
      context.lineTo(this.width(), 0);
      context.lineTo(0, 0);
      plusWidth = this.width() - startX;
      plusCount = Math.ceil(plusWidth / PIXEL_PER_MM);
      for (i = _i = 0, _ref = plusCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        x = startX + i * PIXEL_PER_MM;
        if (x > marginRight) {
          break;
        }
        if (x < marginLeft) {
          continue;
        }
        if (i % 10 === 0) {
          context.moveTo(x, baseY);
          context.lineTo(x, bottomY);
        } else if (i % 5 === 0) {
          context.moveTo(x, baseY + 8);
          context.lineTo(x, bottomY);
        } else {
          context.moveTo(x, baseY + 11);
          context.lineTo(x, bottomY);
        }
      }
      minusWidth = startX;
      minusCount = Math.floor(minusWidth / PIXEL_PER_MM);
      for (i = _j = 1, _ref1 = minusCount - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        x = startX - i * PIXEL_PER_MM;
        if (x < marginLeft) {
          break;
        }
        if (x > marginRight) {
          continue;
        }
        if (i % 10 === 0) {
          context.moveTo(x, baseY);
          context.lineTo(x, bottomY);
        } else if (i % 5 === 0) {
          context.moveTo(x, baseY + 8);
          context.lineTo(x, bottomY);
        } else {
          context.moveTo(x, baseY + 11);
          context.lineTo(x, bottomY);
        }
      }
      context.closePath();
      context.fillStrokeShape(this);
      for (i = _k = 0, _ref2 = plusCount - 1; _k <= _ref2; i = _k += 10) {
        x = startX + i * PIXEL_PER_MM;
        if (x > marginRight) {
          break;
        }
        if (x < marginLeft) {
          continue;
        }
        context.strokeText("" + (i / 10), x + 2, baseY + 10);
      }
      _results = [];
      for (i = _l = 10, _ref3 = minusCount - 1; _l <= _ref3; i = _l += 10) {
        x = startX - i * PIXEL_PER_MM;
        if (x < marginLeft) {
          break;
        }
        if (x > marginRight) {
          continue;
        }
        _results.push(context.strokeText("-" + (i / 10), x + 2, baseY + 10));
      }
      return _results;
    };
    drawVertical = function(context) {
      var baseX, endX, i, marginBottom, marginTop, minusArea, minusCount, plusArea, plusCount, startY, y, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _results;
      startY = parseInt(this.getAttr('zeropos'));
      marginTop = this.getAttr('margin')[0];
      marginBottom = this.height() - this.getAttr('margin')[1];
      baseX = this.width() - 15;
      endX = this.width();
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, this.height());
      context.lineTo(this.width(), this.height());
      context.lineTo(this.width(), 0);
      context.lineTo(0, 0);
      plusArea = this.height() - startY;
      plusCount = Math.ceil(plusArea / PIXEL_PER_MM);
      for (i = _i = 0, _ref = plusCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        y = startY + i * PIXEL_PER_MM;
        if (y > marginBottom) {
          break;
        }
        if (y < marginTop) {
          continue;
        }
        if (i % 10 === 0) {
          context.moveTo(baseX, y);
          context.lineTo(endX, y);
        } else if (i % 5 === 0) {
          context.moveTo(baseX + 8, y);
          context.lineTo(endX, y);
        } else {
          context.moveTo(baseX + 11, y);
          context.lineTo(endX, y);
        }
      }
      minusArea = startY;
      minusCount = Math.floor(minusArea / PIXEL_PER_MM);
      for (i = _j = 1, _ref1 = minusCount - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        y = startY - i * PIXEL_PER_MM;
        if (y > marginBottom) {
          continue;
        }
        if (y < marginTop) {
          break;
        }
        if (i % 10 === 0) {
          context.moveTo(baseX, y);
          context.lineTo(endX, y);
        } else if (i % 5 === 0) {
          context.moveTo(baseX + 8, y);
          context.lineTo(endX, y);
        } else {
          context.moveTo(baseX + 11, y);
          context.lineTo(endX, y);
        }
      }
      context.closePath();
      context.fillStrokeShape(this);
      for (i = _k = 0, _ref2 = plusCount - 1; _k <= _ref2; i = _k += 10) {
        y = startY + i * PIXEL_PER_MM;
        if (y > marginBottom) {
          break;
        }
        if (y < marginTop) {
          continue;
        }
        context.strokeText("" + (i / 10), 1, y + 10);
      }
      _results = [];
      for (i = _l = 10, _ref3 = minusCount - 1; _l <= _ref3; i = _l += 10) {
        y = startY - i * PIXEL_PER_MM;
        if (y < marginTop) {
          break;
        }
        if (y > marginBottom) {
          continue;
        }
        _results.push(context.strokeText("-" + (i / 10), 1, y + 10));
      }
      return _results;
    };
    drawFunc = function(context) {
      if (this.getAttr('direction') !== 'vertical') {
        return drawHorizontal.apply(this, arguments);
      } else {
        return drawVertical.apply(this, arguments);
      }
    };
    createView = function(attributes) {
      return new Kinetic.Shape(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Rect(attributes);
    };
    return {
      type: 'ruler',
      name: 'ruler',
      description: 'Ruler Specification',
      defaults: {
        drawFunc: drawFunc,
        fill: '#848586',
        stroke: '#C2C3C5',
        strokeWidth: 0.5,
        width: 100,
        height: 50,
        margin: [15, 15],
        zeropos: 15,
        direction: 'horizontal',
        font: '8px Verdana'
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_ruler.png'
    };
  });

}).call(this);
