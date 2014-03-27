(function() {
  define(['../command/CommandPropertyChange', '../command/CommandMove'], function(CommandPropertyChange, CommandMove) {
    var copy, cut, getEditMode, moveBackward, moveDelta, moveForward, moveToBack, moveToFront, paste, setEditMode, _move;
    _move = function(context, to) {
      var view;
      view = context.selectionManager.focus();
      if (!view) {
        return;
      }
      return context.execute(new CommandMove({
        to: to,
        view: view,
        model: this.getAttachedModel(view)
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
    moveDelta = function(delta) {
      var after, attr, before, changes, component, node, nodes, _i, _len;
      nodes = this.selectionManager.get();
      changes = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        component = this.getAttachedModel(node);
        before = {};
        after = {};
        for (attr in delta) {
          before[attr] = component.get(attr);
          after[attr] = component.get(attr) + delta[attr];
        }
        changes.push({
          component: component,
          before: before,
          after: after
        });
      }
      return this.commandManager.execute(new CommandPropertyChange({
        changes: changes
      }));
    };
    setEditMode = function(mode) {
      var old;
      old = this.editMode || 'SELECT';
      if (old === mode) {
        return;
      }
      this.editMode = mode;
      return this.application.trigger('change-edit-mode', mode, old);
    };
    getEditMode = function() {
      if (this.editMode) {
        return this.editMode;
      }
      return 'SELECT';
    };
    return {
      moveDelta: moveDelta,
      moveForward: moveForward,
      moveBackward: moveBackward,
      moveToFront: moveToFront,
      moveToBack: moveToBack,
      cut: cut,
      copy: copy,
      paste: paste,
      setEditMode: setEditMode,
      getEditMode: getEditMode
    };
  });

}).call(this);
