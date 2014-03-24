(function() {
  define(['dou', 'KineticJS', '../EventTracker', '../ComponentSelector', '../command/CommandPropertyChange'], function(dou, kin, EventTracker, ComponentSelector, CommandPropertyChange) {
    "use strict";
    var controller, createView, onadded, onchange, onchangeeditmode, onchangemodel, onchangeselections, onclick, ondragend, ondragmove, ondragstart, onremoved, onresize, view_listener, _editmodechange;
    createView = function(attributes) {
      var background, offset, stage, view;
      stage = this.getView().getStage();
      offset = attributes.offset || {
        x: 0,
        y: 0
      };
      view = new kin.Layer(attributes);
      background = new kin.Rect({
        name: 'background for ruler-layer',
        draggable: true,
        listening: true,
        x: 0,
        y: 0,
        width: Math.min(stage.width() + offset.x, stage.width()),
        height: Math.min(stage.height() + offset.y, stage.height()),
        stroke: attributes.stroke,
        fill: 'cyan',
        opacity: 0.1
      });
      view.add(background);
      view.__background__ = background;
      return view;
    };
    _editmodechange = function(after, before, view, model, controller) {
      switch (after) {
        case 'MOVE':
          return view.__background__.moveToTop();
        case 'SELECT':
          return view.__background__.moveToBottom();
      }
    };
    onadded = function(container, component, index, e) {
      var controller, model, view;
      controller = this;
      model = e.listener;
      view = controller.getAttachedViews(model)[0];
      return _editmodechange(controller.getEditMode(), null, view, model, controller);
    };
    onremoved = function(container, component, e) {};
    onchangemodel = function(after, before, e) {
      var model;
      model = e.listener;
      if (before) {
        model.remove(before);
      }
      if (after) {
        return model.add(after);
      }
    };
    onchangeselections = function(after, before, added, removed) {
      var controller;
      controller = this;
      if (after.length > 0) {
        return console.log('selection-changed', after[0], controller.getAttachedModel(after[0]));
      }
    };
    onchange = function(component, before, after) {};
    ondragstart = function(e) {
      var background, controller, node, offset, view, view_offset;
      controller = this.context;
      view = this.listener;
      background = view.__background__;
      node = e.targetNode;
      this.context.selectionManager.select(node);
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      view_offset = view.offset();
      background.setAttrs({
        x: view_offset.x + 20,
        y: view_offset.y + 20
      });
      this.start_point = {
        x: e.clientX,
        y: e.clientY
      };
      this.origin_offset = view.offset();
      offset = {
        x: this.start_point.x + this.origin_offset.x,
        y: this.start_point.y + this.origin_offset.y
      };
      switch (controller.getEditMode()) {
        case 'SELECT':
          this.selectbox = new kin.Rect({
            stroke: 'black',
            strokeWidth: 1,
            dash: [3, 3]
          });
          view.add(this.selectbox);
          this.selectbox.setAttrs(offset);
          break;
        case 'MOVE':
          break;
      }
      view.draw();
      return e.cancelBubble = true;
    };
    ondragmove = function(e) {
      var background, controller, view, x, y;
      controller = this.context;
      view = this.listener;
      background = view.__background__;
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      switch (controller.getEditMode()) {
        case 'SELECT':
          background.setAttrs({
            x: this.origin_offset.x + 20,
            y: this.origin_offset.y + 20
          });
          this.selectbox.setAttrs({
            width: e.clientX - this.start_point.x,
            height: e.clientY - this.start_point.y
          });
          break;
        case 'MOVE':
          x = this.origin_offset.x - (e.clientX - this.start_point.x);
          y = this.origin_offset.y - (e.clientY - this.start_point.y);
          view.offset({
            x: x,
            y: y
          });
          background.setAttrs({
            x: x + 20,
            y: y + 20
          });
          view.fire('change-offset', {
            x: x,
            y: y
          }, false);
          break;
      }
      view.batchDraw();
      return e.cancelBubble = true;
    };
    ondragend = function(e) {
      var background, cmd, controller, dragmodel, dragview, view, x, y;
      controller = this.context;
      dragview = e.targetNode;
      dragmodel = controller.getAttachedModel(dragview);
      if (dragmodel) {
        cmd = new CommandPropertyChange({
          changes: [
            {
              component: dragmodel,
              before: {
                x: dragmodel.get('x'),
                y: dragmodel.get('y')
              },
              after: {
                x: dragview.x(),
                y: dragview.y()
              }
            }
          ]
        });
        controller.execute(cmd);
      }
      view = this.listener;
      background = view.__background__;
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      switch (controller.getEditMode()) {
        case 'SELECT':
          background.setAttrs({
            x: this.origin_offset.x + 20,
            y: this.origin_offset.y + 20
          });
          this.selectbox.remove();
          delete this.selectbox;
          break;
        case 'MOVE':
          x = Math.max(this.origin_offset.x - (e.clientX - this.start_point.x), -20);
          y = Math.max(this.origin_offset.y - (e.clientY - this.start_point.y), -20);
          view.offset({
            x: x,
            y: y
          });
          background.setAttrs({
            x: x + 20,
            y: y + 20
          });
          view.fire('change-offset', {
            x: x,
            y: y
          }, false);
          break;
      }
      view.draw();
      return e.cancelBubble = true;
    };
    onclick = function(e) {
      var node;
      node = e.targetNode;
      return this.context.selectionManager.select(node);
    };
    onresize = function(e) {
      var background, view;
      view = this.listener;
      background = view.__background__;
      background.setSize(e.after);
      return view.batchDraw();
    };
    onchangeeditmode = function(after, before, e) {
      var controller, model, view;
      controller = this;
      model = e.listener;
      view = controller.getAttachedViews(model)[0];
      return _editmodechange(after, before, view, model, controller);
    };
    controller = {
      '(root)': {
        '(root)': {
          'change-model': onchangemodel,
          'change-selections': onchangeselections,
          'change-edit-mode': onchangeeditmode
        }
      },
      '(self)': {
        '(self)': {
          'added': onadded,
          'removed': onremoved
        },
        '(all)': {
          'change': onchange
        }
      }
    };
    view_listener = {
      '(self)': {
        dragstart: ondragstart,
        dragmove: ondragmove,
        dragend: ondragend,
        click: onclick
      },
      '(root)': {
        resize: onresize
      }
    };
    return {
      type: 'content-edit-layer',
      name: 'content-edit-layer',
      containable: true,
      container_type: 'layer',
      description: 'Selection Edit Layer Specification',
      defaults: {
        listening: true,
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_edit_layer.png'
    };
  });

}).call(this);
