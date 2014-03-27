(function() {
  define(['../command/CommandPropertyChange', '../command/CommandMove'], function(CommandPropertyChange, CommandMove) {
    var copy, cut, moveBackward, moveDelta, moveForward, moveToBack, moveToFront, offset, paste, _move;
    _move = function(appcontext, to) {
      var view;
      view = appcontext.selectionManager.focus();
      if (!view) {
        return;
      }
      return appcontext.execute(new CommandMove({
        to: to,
        view: view,
        model: appcontext.getAttachedModel(view)
      }));
    };
    moveForward = function() {
      return _move(this, 'FORWARD');
    };
    moveBackward = function() {
      return _move(this, 'BACKWARD');
    };
    moveToFront = function() {
      return _move(this, 'FRONT');
    };
    moveToBack = function() {
      return _move(this, 'BACK');
    };
    cut = function() {
      return this.clipboard.cut(this.selectionManager.get());
    };
    copy = function() {
      return this.clipboard.copy(this.selectionManager.get());
    };
    paste = function() {
      var component, components, nodes;
      components = this.clipboard.paste();
      nodes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = components.length; _i < _len; _i++) {
          component = components[_i];
          _results.push(this.getAttachedModel(component));
        }
        return _results;
      }).call(this);
      return this.selectionManager.select(nodes);
    };
    moveDelta = function(component, delta) {
      var after, attr, before, changes, comp, node, nodes, _i, _len;
      nodes = this.selectionManager.get();
      changes = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        comp = this.getAttachedModel(node);
        before = {};
        after = {};
        for (attr in delta) {
          before[attr] = comp.get(attr);
          after[attr] = comp.get(attr) + delta[attr];
        }
        changes.push({
          component: comp,
          before: before,
          after: after
        });
      }
      return this.commandManager.execute(new CommandPropertyChange({
        changes: changes
      }));
    };
    offset = function(component, offset) {
      var layer;
      layer = component.getAttachedViews()[0];
      return layer.offset(offset);
    };
    return function(appcontext, component) {
      var exportableFunctions, func, name, _results;
      exportableFunctions = {
        moveDelta: function(delta) {
          return moveDelta(component, delta);
        },
        moveForward: function() {
          return moveForward(component);
        },
        moveBackward: function() {
          return moveBackward(component);
        },
        moveToFront: function() {
          return moveToFront(component);
        },
        moveToBack: function() {
          return moveToBack(component);
        },
        offset: function(offset) {
          return offset(component, offset);
        },
        cut: function() {
          return cut(component);
        },
        copy: function() {
          return copy(component);
        },
        paste: function() {
          return paste(component);
        },
        setEditMode: function(mode) {
          return component.setEditMode(mode);
        },
        getEditMode: function() {
          return component.getEditMode();
        }
      };
      _results = [];
      for (name in exportableFunctions) {
        func = exportableFunctions[name];
        _results.push(appcontext[name] = func);
      }
      return _results;
    };
  });

}).call(this);
