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

    createView = (attributes) ->
        group = new kin.Group(attributes);
        group.add new kin.Rect(dou.util.merge(attributes, {draggable: false, x: 0, y: 0}))
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
            fill: 'green'
            stroke: 'black'
            strokeWidth: 4
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_group.png'
    }
