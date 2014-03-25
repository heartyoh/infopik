(function() {
  define(['dou', 'KineticJS', '../EventTracker', '../ComponentSelector', '../command/CommandPropertyChange'], function(dou, kin, EventTracker, ComponentSelector, CommandPropertyChange) {
    "use strict";
    var createView, model_event_map, onadded, onchange, onchangeeditmode, onchangemodel, onchangeselections, onclick, ondragend, ondragmove, ondragstart, onremoved, onresize, stuck_background_position, view_event_map, _editmodechange;
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
      view.__background__ = background;
      view.__origin_offset__ = offset;
      view.add(background);
      return view;
    };
    _editmodechange = function(after, before, view, model, controller) {
      switch (after) {
        case 'MOVE':
          view.__background__.moveToTop();
          break;
        case 'SELECT':
          view.__background__.moveToBottom();
          break;
      }
      return view.batchDraw();
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
    onchange = function(component, before, after) {
      var view;
      view = component.getViews()[0];
      view.setAttrs(after);
      return view.getLayer().batchDraw();
    };
    stuck_background_position = function(view) {
      var view_offset, view_origin_offset;
      view_offset = view.offset();
      view_origin_offset = view.__origin_offset__;
      return view.__background__.position({
        x: view_offset.x - view_origin_offset.x,
        y: view_offset.y - view_origin_offset.y
      });
    };
    ondragstart = function(e) {
      var background, controller, node, offset, view;
      controller = this.context;
      view = this.listener;
      background = view.__background__;
      node = e.targetNode;
      this.context.selectionManager.select(node);
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      this.origin_offset = view.offset();
      this.start_point = {
        x: e.offsetX,
        y: e.offsetY
      };
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
      stuck_background_position(view);
      view.draw();
      return e.cancelBubble = true;
    };
    ondragmove = function(e) {
      var background, controller, current_point, view, x, y;
      controller = this.context;
      view = this.listener;
      background = view.__background__;
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      current_point = {
        x: e.offsetX,
        y: e.offsetY
      };
      switch (controller.getEditMode()) {
        case 'SELECT':
          this.selectbox.setAttrs({
            width: current_point.x - this.start_point.x,
            height: current_point.y - this.start_point.y
          });
          break;
        case 'MOVE':
          x = this.origin_offset.x - (current_point.x - this.start_point.x);
          y = this.origin_offset.y - (current_point.y - this.start_point.y);
          view.offset({
            x: x,
            y: y
          });
          view.fire('change-offset', {
            x: x,
            y: y
          }, false);
          break;
      }
      stuck_background_position(view);
      view.batchDraw();
      return e.cancelBubble = true;
    };
    ondragend = function(e) {
      var background, cmd, controller, current_point, dragmodel, dragview, view, x, y;
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
      current_point = {
        x: e.offsetX,
        y: e.offsetY
      };
      switch (controller.getEditMode()) {
        case 'SELECT':
          this.selectbox.remove();
          delete this.selectbox;
          break;
        case 'MOVE':
          x = Math.max(this.origin_offset.x - (current_point.x - this.start_point.x), -20);
          y = Math.max(this.origin_offset.y - (current_point.y - this.start_point.y), -20);
          view.offset({
            x: x,
            y: y
          });
          view.fire('change-offset', {
            x: x,
            y: y
          }, false);
          break;
      }
      stuck_background_position(view);
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
    model_event_map = {
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
    view_event_map = {
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
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_edit_layer.png'
    };
  });

}).call(this);
