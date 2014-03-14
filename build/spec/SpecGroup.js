(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createHandle, createView, drag_handler;
    drag_handler = function(e) {
      if (!e.targetNode || e.targetNode === this.__background__) {
        return e.targetNode = this;
      }
    };
    createView = function(attributes) {
      var background, group;
      group = new kin.Group(attributes);
      background = new kin.Rect(dou.util.shallow_merge({}, attributes, {
        draggable: false,
        listening: true,
        x: 0,
        y: 0,
        id: void 0
      }));
      group.add(background);
      if (attributes.draggable) {
        group.on('dragstart dragmove dragend', drag_handler);
        group.__background__ = background;
      }
      return group;
    };
    createHandle = function(attributes) {
      return new Kin.Group(attributes);
    };
    return {
      type: 'group',
      name: 'group',
      containable: true,
      container_type: 'container',
      description: 'Group Specification',
      defaults: {
        width: 100,
        height: 50,
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        listening: true,
        opacity: 1
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_group.png'
    };
  });

}).call(this);
