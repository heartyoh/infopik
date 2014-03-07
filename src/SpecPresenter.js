(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, onadd, onremove;
    createView = function(attributes) {
      return new kin.Stage(attributes);
    };
    onadd = function(container, component) {
      var vcomponent, vcontainer;
      vcontainer = this.view.find("\#" + (container.get('id')));
      vcomponent = this.componentFactory.createView(component);
      return vcontainer.add(vcomponent);
    };
    onremove = function(container, component) {};
    controller = {
      'presenter-app': {
        'add': onadd,
        'remove': onremove
      }
    };
    return {
      type: 'presenter-app',
      name: 'presenter-app',
      containable: true,
      container_type: 'application',
      description: 'Presenter Application Specification',
      defaults: {},
      controller: controller,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_presenter_app.png'
    };
  });

}).call(this);
