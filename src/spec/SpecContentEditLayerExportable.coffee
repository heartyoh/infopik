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

    _move = (appcontext, to) ->
        view = appcontext.selectionManager.focus()
        return if not view

        appcontext.execute new CommandMove
            to: to
            view: view
            model: appcontext.getAttachedModel(view)

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

    moveDelta = (component, delta) ->
        nodes = @selectionManager.get()
        changes = []
    
        for node in nodes
            comp = @getAttachedModel(node)

            before = {}
            after = {}

            for attr of delta
                before[attr] = comp.get(attr)
                after[attr] = comp.get(attr) + delta[attr]
    
            changes.push
                component : comp
                before : before
                after : after
    
        @commandManager.execute(new CommandPropertyChange {
            changes : changes
        })

    offset = (component, offset) ->
        layer = component.getAttachedViews()[0]
        layer.offset offset

    (appcontext, component) ->
        exportableFunctions =
            moveDelta: (delta) -> moveDelta(component, delta)
            moveForward: -> moveForward(component)
            moveBackward: -> moveBackward(component)
            moveToFront: -> moveToFront(component)
            moveToBack: -> moveToBack(component)
            offset: (offset) -> offset(component, offset)
            cut: -> cut(component)
            copy: -> copy(component)
            paste: -> paste(component)
            setEditMode: (mode) -> component.setEditMode(mode)
            getEditMode: -> component.getEditMode()

        appcontext[name] = func for name, func of exportableFunctions
