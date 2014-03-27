# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    '../command/CommandPropertyChange'
    '../command/CommandMove'
], (
    CommandPropertyChange
    CommandMove
) ->

    _move = (context, to) ->
        view = context.selectionManager.focus()
        return if not view

        context.execute new CommandMove
            to: to
            view: view
            model: context.getAttachedModel(view)

    moveForward = ->
        _move this, 'FORWARD'

    moveBackward = ->
        _move this, 'BACKWARD'

    moveToFront = ->
        _move this, 'FRONT'

    moveToBack = ->
        _move this, 'BACK'

    cut = ->
        @clipboard.cut @selectionManager.get()

    copy = ->
        @clipboard.copy @selectionManager.get()

    paste = ->
        components = @clipboard.paste()
        nodes = (@getAttachedModel(component) for component in components)
        @selectionManager.select(nodes)

    moveDelta = (delta) ->
        nodes = @selectionManager.get()
        changes = []
    
        for node in nodes
            component = @getAttachedModel(node)

            before = {}
            after = {}

            for attr of delta
                before[attr] = component.get(attr)
                after[attr] = component.get(attr) + delta[attr]
    
            changes.push
                component : component
                before : before
                after : after
    
        @commandManager.execute(new CommandPropertyChange {
            changes : changes
        })

    setEditMode = (mode) ->
        old = @editMode or 'SELECT'
        return if old is mode
        @editMode = mode
        @application.trigger 'change-edit-mode', mode, old

    getEditMode = ->
        return @editMode if @editMode
        return 'SELECT'

    ->
        exportableFunctions =
            moveDelta: moveDelta
            moveForward: moveForward
            moveBackward: moveBackward
            moveToFront: moveToFront
            moveToBack: moveToBack
            cut: cut
            copy: copy
            paste: paste
            setEditMode: setEditMode
            getEditMode: getEditMode

        this[name] = func for name, func of exportableFunctions
