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

    moveForward = (appcontext) ->
        _move appcontext, 'FORWARD'

    moveBackward = (appcontext) ->
        _move appcontext, 'BACKWARD'

    moveToFront = (appcontext) ->
        _move appcontext, 'FRONT'

    moveToBack = (appcontext) ->
        _move appcontext, 'BACK'

    cut = (appcontext) ->
        appcontext.clipboard.cut appcontext.selectionManager.get()

    copy = (appcontext) ->
        appcontext.clipboard.copy appcontext.selectionManager.get()

    paste = (appcontext) ->
        components = appcontext.clipboard.paste()
        nodes = (appcontext.getAttachedModel(component) for component in components)
        appcontext.selectionManager.select(nodes)

    moveDelta = (appcontext, component, delta) ->
        nodes = appcontext.selectionManager.get()
        changes = []
    
        for node in nodes
            comp = appcontext.getAttachedModel(node)

            before = {}
            after = {}

            for attr of delta
                before[attr] = comp.get(attr)
                after[attr] = comp.get(attr) + delta[attr]
    
            changes.push
                component : comp
                before : before
                after : after
    
        appcontext.commandManager.execute(new CommandPropertyChange {
            changes : changes
        })

    offset = (appcontext, component, offset) ->
        layer = component.getAttachedViews()[0]
        layer.offset offset

    (appcontext, component) ->
        exportableFunctions =
            moveDelta: (delta) -> moveDelta(appcontext, component, delta)
            moveForward: -> moveForward(appcontext, component)
            moveBackward: -> moveBackward(appcontext, component)
            moveToFront: -> moveToFront(appcontext, component)
            moveToBack: -> moveToBack(appcontext, component)
            offset: (offset) -> offset(appcontext, component, offset)
            cut: -> cut(appcontext, component)
            copy: -> copy(appcontext, component)
            paste: -> paste(appcontext, component)
            setEditMode: (mode) -> component.setEditMode(mode)
            getEditMode: -> component.getEditMode()

        appcontext[name] = func for name, func of exportableFunctions
