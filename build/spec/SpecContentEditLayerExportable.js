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
    moveForward = function(appcontext) {
      return _move(appcontext, 'FORWARD');
    };
    moveBackward = function(appcontext) {
      return _move(appcontext, 'BACKWARD');
    };
    moveToFront = function(appcontext) {
      return _move(appcontext, 'FRONT');
    };
    moveToBack = function(appcontext) {
      return _move(appcontext, 'BACK');
    };
    cut = function(appcontext) {
      return appcontext.clipboard.cut(appcontext.selectionManager.get());
    };
    copy = function(appcontext) {
      return appcontext.clipboard.copy(appcontext.selectionManager.get());
    };
    paste = function(appcontext) {
      var component, components, nodes;
      components = appcontext.clipboard.paste();
      nodes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = components.length; _i < _len; _i++) {
          component = components[_i];
          _results.push(appcontext.getAttachedModel(component));
        }
        return _results;
      })();
      return appcontext.selectionManager.select(nodes);
    };
    moveDelta = function(appcontext, component, delta) {
      var after, attr, before, changes, comp, node, nodes, _i, _len;
      nodes = appcontext.selectionManager.get();
      changes = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        comp = appcontext.getAttachedModel(node);
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
      return appcontext.commandManager.execute(new CommandPropertyChange({
        changes: changes
      }));
    };
    offset = function(appcontext, component, position) {
      var layer;
      layer = component.getViews()[0];
      layer.offset(position);
      layer.fire('change-offset', layer.offset(), false);
      return layer.batchDraw();
    };
    return function(appcontext, component) {
      var exportableFunctions, func, name, _results;
      exportableFunctions = {
        moveDelta: function(delta) {
          return moveDelta(appcontext, component, delta);
        },
        moveForward: function() {
          return moveForward(appcontext, component);
        },
        moveBackward: function() {
          return moveBackward(appcontext, component);
        },
        moveToFront: function() {
          return moveToFront(appcontext, component);
        },
        moveToBack: function() {
          return moveToBack(appcontext, component);
        },
        offset: function(position) {
          return offset(appcontext, component, position);
        },
        cut: function() {
          return cut(appcontext, component);
        },
        copy: function() {
          return copy(appcontext, component);
        },
        paste: function() {
          return paste(appcontext, component);
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
