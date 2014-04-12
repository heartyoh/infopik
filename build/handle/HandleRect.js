(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var BOTTOM, CENTER, Handler, LEFT, MIDDLE, RIGHT, RectHandle, RotateHandler, TOP, view_factory;
    LEFT = -1;
    CENTER = 0;
    RIGHT = 1;
    TOP = -1;
    MIDDLE = 0;
    BOTTOM = 1;
    Handler = (function(_super) {
      __extends(Handler, _super);

      function Handler(hAlign, vAlign, radius, fill, stroke, strokeWidth) {
        this._align = [hAlign, vAlign];
        kin.Circle.call(this, {
          radius: radius,
          fill: fill,
          stroke: stroke,
          strokeWidth: strokeWidth,
          draggable: true
        });
      }

      Handler.prototype.getAlign = function() {
        return this._align;
      };

      return Handler;

    })(kin.Circle);
    RotateHandler = (function(_super) {
      __extends(RotateHandler, _super);

      function RotateHandler(radius, fill, stroke, strokeWidth) {
        kin.Circle.call(this, {
          radius: radius,
          fill: fill,
          stroke: stroke,
          strokeWidth: strokeWidth,
          draggable: true
        });
      }

      return RotateHandler;

    })(kin.Circle);
    RectHandle = (function(_super) {
      __extends(RectHandle, _super);

      function RectHandle(options) {
        this._options = options;
        this._handlers = [];
        this._rotateHandler = null;
        this._border = null;
        kin.Group.call(this, {
          width: options.width,
          height: options.height,
          fill: options.fill,
          stroke: options.stroke,
          strokeWidth: options.strokeWidth,
          draggable: true
        });
        this.createBorder();
        this.addHandler(TOP, LEFT);
        this.addHandler(TOP, CENTER);
        this.addHandler(TOP, RIGHT);
        this.addHandler(MIDDLE, LEFT);
        this.addHandler(MIDDLE, RIGHT);
        this.addHandler(BOTTOM, LEFT);
        this.addHandler(BOTTOM, CENTER);
        this.addHandler(BOTTOM, RIGHT);
        this.addRotateHandler();
      }

      RectHandle.prototype.createBorder = function() {
        this._border = new kin.Line({
          points: [0, 0],
          stroke: this._options['border-stroke'],
          strokeWidth: this._options['border-stroke-width']
        });
        return this.add(this._border);
      };

      RectHandle.prototype.addRotateHandler = function() {
        var self;
        self = this;
        this._rotateHandler = new RotateHandler({
          radius: this._options['handler-radius'],
          fill: this._options['handler-fill'],
          stroke: this._options['handler-stroke'],
          strokeWidth: this._options['handler-stroke-width']
        });
        this._rotateHandler.setDragBoundFunc(function(pos) {
          var angle, p, v;
          if (this.isDragging()) {
            p = rotateGroup.getAbsolutePosition();
            v = {
              x: p.x - pos.x,
              y: p.y - pos.y
            };
            angle = self.getAngle(v);
            rotateGroup.setRotation(angle);
          }
          return pos;
        });
        this._rotateHandler.on('dragmove', function() {
          return self.update();
        });
        this.add(this._rotateHandler);
        return this._rotateHandler;
      };

      RectHandle.prototype.addHandler = function(hAlign, vAlign) {
        var handler;
        handler = new Handler(hAlign, vAlign, this._options['handler-radius'], this._options['handler-fill'], this._options['handler-stroke'], this._options['handler-strokeWidth']);
        this.add(handler);
        return this._handlers.push(handler);
      };

      RectHandle.prototype.getHandlerByAlign = function(hAlign, vAlign) {
        var align, handler, _i, _len, _ref;
        _ref = this._handlers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          align = handler.getAlign();
          if ((align[0] === hAlign) && (align[1] === vAlign)) {
            return handler;
          }
        }
        return null;
      };

      RectHandle.prototype.getOppositeHandler = function(handler) {
        var align;
        align = handler.getAlign();
        return this.getHandlerByAlign(-align[0], -align[1]);
      };

      RectHandle.prototype.setTarget = function(target) {
        this._target = target;
        return this.update();
      };

      RectHandle.prototype.showHandle = function() {
        return this.visible(true);
      };

      RectHandle.prototype.hideHandle = function() {
        return this.visible(false);
      };

      RectHandle.prototype.update = function() {
        var centerBottom, centerTop, leftBottom, leftMiddle, leftTop, points, rightBottom, rightMiddle, rightTop, rotate, targetHeight, targetWidth, targetX, targetY;
        targetX = this._target.getX() - this._target.getOffsetX();
        targetY = this._target.getY() - this._target.getOffsetY();
        targetWidth = this._target.getWidth();
        targetHeight = this._target.getHeight();
        rotate = {
          x: targetX + targetWidth / 2,
          y: targetY - this._options['rotate-distance']
        };
        leftTop = {
          x: targetX,
          y: targetY
        };
        rightTop = {
          x: targetX + targetWidth,
          y: targetY
        };
        leftBottom = {
          x: targetX,
          y: targetY + targetHeight
        };
        rightBottom = {
          x: targetX + targetWidth,
          y: targetY + targetHeight
        };
        centerTop = {
          x: targetX + targetWidth / 2,
          y: targetY
        };
        leftMiddle = {
          x: targetX,
          y: targetY + targetHeight / 2
        };
        rightMiddle = {
          x: targetX + targetWidth,
          y: targetY + targetHeight / 2
        };
        centerBottom = {
          x: targetX + targetWidth / 2,
          y: targetY + targetHeight
        };
        points = [centerTop, leftTop, leftBottom, rightBottom, rightTop, centerTop];
        if (this._options['allow-rotate']) {
          points.unshift(rotate);
        }
        this._border.setPoints(points);
        this._rotateHandler.setPosition(rotate);
        this.getHandlerByAlign(LEFT, TOP).setPosition(leftTop);
        this.getHandlerByAlign(RIGHT, TOP).setPosition(rightTop);
        this.getHandlerByAlign(LEFT, BOTTOM).setPosition(leftBottom);
        this.getHandlerByAlign(RIGHT, BOTTOM).setPosition(rightBottom);
        this.getHandlerByAlign(CENTER, TOP).setPosition(centerTop);
        this.getHandlerByAlign(LEFT, MIDDLE).setPosition(leftMiddle);
        this.getHandlerByAlign(RIGHT, MIDDLE).setPosition(rightMiddle);
        return this.getHandlerByAlign(CENTER, BOTTOM).setPosition(centerBottom);
      };

      return RectHandle;

    })(kin.Group);
    view_factory = function(attributes) {
      var handle;
      handle = new RectHandle(attributes);
      return handle;
    };
    return {
      type: 'handle-rect',
      name: 'handle-rect',
      description: 'Rectangle Handle Specification',
      defaults: {
        width: 10,
        height: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        'handler-radius': 10,
        'handler-fill': 'gray',
        'handler-stroke': 'black',
        'handler-strokeWidth': 2,
        'rotate-distance': 10,
        'border-stroke': 'black',
        'border-stroke-width': 2
      },
      view_factory_fn: view_factory,
      toolbox_image: 'images/toolbox_handle_rect.png'
    };
  });

}).call(this);
