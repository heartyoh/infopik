(function() {
  define(['dou', 'KineticJS', './MVCMixin', './Component', './Container', './EventEngine', './EventTracker', './ComponentFactory', './Command', './CommandManager', './ComponentRegistry', './ComponentSelector', './SelectionManager', './ComponentSpec', './spec/SpecPainter', './spec/SpecPresenter', './spec/SpecInfographic'], function(dou, kin, MVCMixin, Component, Container, EventEngine, EventTracker, ComponentFactory, Command, CommandManager, ComponentRegistry, ComponentSelector, SelectionManager, ComponentSpec, SpecPainter, SpecPresenter, SpecInfographic) {
    "use strict";
    var ApplicationContext;
    ApplicationContext = (function() {
      function ApplicationContext(options) {
        var attributes, component, container, rootComponent, rootView, _i, _len, _ref;
        this.application_spec = options.application_spec, container = options.container;
        if (typeof container !== 'string') {
          throw new Error('container is a mandatory string type option.');
        }
        if (!this.application_spec) {
          throw new Error('application_spec is a mandatory option');
        }
        this.commandManager = new CommandManager();
        this.selectionManager = new SelectionManager({
          onselectionchange: this.onselectionchange,
          context: this,
          selectable_fn: function(item) {
            return item.getAttr('id');
          }
        });
        this.compEventTracker = new EventTracker();
        this.viewEventTracker = new EventTracker();
        this.eventEngine = new EventEngine();
        this.componentRegistry = new ComponentRegistry();
        this.componentRegistry.setRegisterCallback(function(spec) {}, this);
        this.componentRegistry.setUnregisterCallback(function(spec) {}, this);
        this.componentFactory = new ComponentFactory(this.componentRegistry, this.eventEngine, this.viewEventTracker);
        this.componentRegistry.register(this.application_spec);
        attributes = {
          id: 'application',
          container: options.container,
          width: options.width,
          height: options.height
        };
        this.application = this.componentFactory.createComponent({
          type: this.application_spec.type,
          attrs: attributes
        }, this);
        this.view = this.componentFactory.createView(this.application, this);
        this.eventEngine.setRoot(this.application);
        rootView = this.view;
        rootComponent = this.application;
        this.compEventTracker.setSelector({
          select: function(selector, listener) {
            return CompoentSelector.select(selector, rootComponent, listener);
          }
        });
        this.viewEventTracker.setSelector({
          select: function(selector, listener) {
            var comp, comps, view, views, _i, _j, _len, _len1, _ref;
            if (selector === '(self)') {
              return listener;
            }
            if (selector === '(root)') {
              return rootView;
            }
            comps = ComponentSelector.select(selector, rootComponent);
            views = [];
            for (_i = 0, _len = comps.length; _i < _len; _i++) {
              comp = comps[_i];
              _ref = comp.getViews();
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                view = _ref[_j];
                views.push(view);
              }
            }
            return views;
          }
        });
        this.application.on('add', this.onadd, this);
        this.application.on('remove', this.onremove, this);
        if (this.application_spec.layers) {
          _ref = this.application_spec.layers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            component = _ref[_i];
            this.application.add(this.componentFactory.createComponent(component, this));
          }
        }
      }

      ApplicationContext.prototype.despose = function() {
        this.compEventTracker.despose();
        this.eventController.despose();
        this.eventRegistry.despose();
        return this.componentFactory.despose();
      };

      ApplicationContext.prototype.getEventTracker = function() {
        return this.compEventTracker;
      };

      ApplicationContext.prototype.getView = function() {
        return this.view;
      };

      ApplicationContext.prototype.getModel = function() {
        return this.model;
      };

      ApplicationContext.prototype.setModel = function(model) {
        var before;
        before = this.model;
        this.model = model;
        return this.application.trigger('change-model', this.model, before);
      };

      ApplicationContext.prototype.getController = function() {
        return this.eventController;
      };

      ApplicationContext.prototype.getApplication = function() {
        return this.application;
      };

      ApplicationContext.prototype.findComponent = function(selector) {
        return ComponentSelector.select(selector, this.application);
      };

      ApplicationContext.prototype.findView = function(selector) {
        return this.view.find(selector);
      };

      ApplicationContext.prototype.findViewByComponent = function(component) {
        return this.view.find("\#" + (component.get('id')));
      };

      ApplicationContext.prototype.createView = function(component) {
        return this.componentFactory.createView(component, this);
      };

      ApplicationContext.prototype.createComponent = function(obj) {
        return this.componentFactory.createComponent(obj, this);
      };

      ApplicationContext.prototype.drawView = function() {
        return this.view.draw();
      };

      ApplicationContext.prototype.execute = function(command) {
        return this.commandManager.execute(command);
      };

      ApplicationContext.prototype.setSize = function(width, height) {
        var before;
        before = this.view.getSize();
        this.view.setSize({
          width: width,
          height: height
        });
        return this.view.fire('resize', {
          before: before,
          after: {
            width: width,
            height: height
          }
        });
      };

      ApplicationContext.prototype.setEditMode = function(mode) {
        var old;
        old = this.editMode || 'SELECT';
        if (old === mode) {
          return;
        }
        this.editMode = mode;
        return this.application.trigger('change-edit-mode', mode, old);
      };

      ApplicationContext.prototype.getEditMode = function() {
        if (this.editMode) {
          return this.editMode;
        }
        return 'SELECT';
      };

      ApplicationContext.prototype.onadd = function(container, component, index, e) {
        var vcomponent, vcontainer;
        vcontainer = container === this.application ? this.view : this.findViewByComponent(container);
        vcomponent = this.createView(component);
        vcontainer.add(vcomponent);
        return this.drawView();
      };

      ApplicationContext.prototype.onremove = function(container, component, e) {
        var vcomponent;
        console.log('removed', container, component);
        vcomponent = this.findViewByComponent(component);
        vcomponent.destroy();
        return this.drawView();
      };

      ApplicationContext.prototype.onselectionchange = function(changes) {
        return this.application.trigger('change-selections', changes.after, changes.before, changes.added, changes.removed);
      };

      return ApplicationContext;

    })();
    dou.mixin(ApplicationContext, MVCMixin.controller);
    return ApplicationContext;
  });

}).call(this);
