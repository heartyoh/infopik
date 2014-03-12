# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
], (dou, kin) ->
    
    "use strict"

    drag_handler = (e) ->
        e.targetNode = this if not e.targetNode or e.targetNode is this.__background__

    createView = (attributes) ->
        group = new kin.Group(attributes);
        background = new kin.Rect(dou.util.shallow_merge({}, attributes, {draggable: false, listening: true, x: 0, y: 0, id: undefined}))
        group.add background
        # Hack.. dragmove event lost its targetNode for background
        if(attributes.draggable)
            group.on 'dragstart dragmove dragend', drag_handler
            group.__background__ = background

        group

    createHandle = (attributes) ->
        return new Kin.Group(attributes)

    {
        type: 'group'
        name: 'group'
        containable: true
        container_type: 'container'
        description: 'Group Specification'
        defaults: {
            width: 100
            height: 50
            # fill: 'green'
            stroke: 'black'
            strokeWidth: 4
            draggable: true
            listening: true
            opacity: 1
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_group.png'
    }
