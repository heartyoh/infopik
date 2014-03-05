(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var GroupHandleFactory, GroupViewFactory;
    GroupViewFactory = (function() {
      function GroupViewFactory() {}

      GroupViewFactory.createView = function(attributes) {
        return new kin.Group(attributes);
      };

      return GroupViewFactory;

    })();
    GroupHandleFactory = (function() {
      function GroupHandleFactory() {}

      GroupHandleFactory.createHandle = function(attributes) {
        return new Kin.Group(attributes);
      };

      return GroupHandleFactory;

    })();
    return {
      type: 'group',
      name: 'group',
      containable: true,
      description: 'Group Specification',
      defaults: {
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory: GroupViewFactory,
      handle_factory: GroupHandleFactory,
      toolbox_image: 'images/toolbox_group.png'
    };
  });

}).call(this);
