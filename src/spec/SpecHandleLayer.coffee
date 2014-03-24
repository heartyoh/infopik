# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
], (
    dou
    kin
) ->

    "use strict"

    createView = (attributes) ->
        view = new kin.Layer(attributes)
        view.handles = {}
        view

    onchangeoffset = (e) ->
        view = this.listener

        view.offset {x: e.x, y: e.y}
        view.batchDraw()

    ondragmove = (e) ->
        view = this.listener

        id = e.targetNode.getAttr('id')
        handle = view.handles[id]

        if handle
            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
            view.batchDraw()

    ondragend = (e) ->
        view = this.listener

        id = e.targetNode.getAttr('id')
        handle = view.handles[id]

        if handle
            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
            view.draw()

    onchangeselection = (after, before, added, removed, e) ->

        controller = this
        model = e.listener
        view = controller.getAttachedViews(model)[0]

        for node in removed

            id = node.getAttr('id')
            handle = view.handles[id]
            handle_comp = controller.getAttachedModel(handle)
            model.remove(handle_comp)

            delete view.handles[id]

        for node in added

            id = node.getAttr('id')
            pos = node.getAbsolutePosition()
            handle_comp = this.createComponent
                type: 'handle-checker'
                attrs: {}

            model.add(handle_comp)

            handle_view = controller.getAttachedViews(handle_comp)[0]
            handle_view.setAbsolutePosition(pos)

            view.handles[id] = handle_view

        view.batchDraw()

    controller = 
        '(root)' :
            '(root)' :
                'change-selections' : onchangeselection

    view_listener =
        '?offset_monitor_target' :
            'change-offset' : onchangeoffset
            dragmove : ondragmove
            dragend : ondragend

    {
        type: 'handle-layer'
        name: 'handle-layer'
        containable: true
        container_type: 'layer'
        description: 'Handle Layer Specification'
        defaults:
            draggable: false

        controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_handle_layer.png'
    }
