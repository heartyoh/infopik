(function() {
  define(['dou'], function(dou) {
    "use strict";
    var attachView, detachAll, detachView, getModel, getViews, setModel, withController, withModel, withView;
    attachView = function(model, view, x) {
      if (!view) {
        return;
      }
      if (!model.__views__) {
        model.__views__ = [];
      }
      model.__views__.push(view);
      if (x) {
        return setModel(view, model, false);
      }
    };
    detachView = function(model, view, x) {
      var index;
      if ((!view) || (!model.__views__)) {
        return;
      }
      index = model.__views__.indexOf(view);
      if (index === -1) {
        return;
      }
      model.__views__.splice(index, 1);
      if (x) {
        return setModel(view, null, false);
      }
    };
    detachAll = function(model) {
      var view, _i, _len, _ref;
      if (!model.__views__) {
        return;
      }
      _ref = model.__views__;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        setModel(view, null, false);
      }
      return model.__views__ = null;
    };
    getViews = function(model) {
      var attaches, view, _i, _len, _ref, _results;
      attaches = [];
      if (!model.__views__) {
        return attaches;
      }
      _ref = model.__views__;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view);
      }
      return _results;
    };
    setModel = function(view, model, x) {
      var oldModel;
      oldModel = view.__model__;
      if (oldModel === model) {
        return;
      }
      if (oldModel && x) {
        detachView(oldModel, view, false);
      }
      view.__model__ = model;
      if (model && x) {
        return attachView(model, view, false);
      }
    };
    getModel = function(view) {
      return view.__model__;
    };
    withModel = function() {
      this.attachView = function(view) {
        return attachView(this, view, true);
      };
      this.detachView = function(view) {
        return detachView(this, view, true);
      };
      this.detachAll = function() {
        return detachAll(this);
      };
      return this.getViews = function(filter) {
        return getViews(this);
      };
    };
    withView = function() {
      this.getModel = function() {
        return getModel(this);
      };
      return this.setModel = function(model) {
        return setModel(this, model, true);
      };
    };
    withController = function() {
      this.attach = function(model, view) {
        return attachView(model, view, true);
      };
      this.detach = function(model, view) {
        return detachView(model, view, true);
      };
      this.detachAll = function(model) {
        return detachAll(model);
      };
      this.getAttachedModel = function(view) {
        return getModel(view);
      };
      return this.getAttachedViews = function(model) {
        return getViews(model);
      };
    };
    return {
      controller: withController,
      model: withModel,
      view: withView
    };
  });

}).call(this);
