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
        layer = new kin.Layer(attributes)
        layer.handles = {}
        layer

    onchangeoffset = (e) ->
        layer = this.listener

        layer.offset {x: e.x, y: e.y}
        layer.draw()

    ondragmove = (e) ->
        layer = this.listener

        id = e.targetNode.getAttr('id')
        handle = layer.handles[id]

        if handle
            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
            layer.draw()

    ondragend = (e) ->
        layer = this.listener

        id = e.targetNode.getAttr('id')
        handle = layer.handles[id]

        if handle
            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
            layer.draw()

    onchangeselection = (after, before, added, removed, e) ->
        container = e.listener
        layer = container.attaches()[0]

        for node in removed
            id = node.getAttr('id')
            handle = layer.handles[id]
            handle_comp = handle.__component__
            container.remove(handle_comp)

            delete layer.handles[id]

        for node in added
            id = node.getAttr('id')
            pos = node.getAbsolutePosition()
            handle_comp = this.createComponent
                type: 'handle-checker'
                attrs: {}

            container.add(handle_comp)
            handle_view = handle_comp.attaches()[0]
            handle_view.setAbsolutePosition(pos)

            layer.handles[id] = handle_view

        layer.draw()

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
