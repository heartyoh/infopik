# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    createView = (attributes) ->
        new kin.Circle(attributes)

    createHandle = (attributes) ->
        new Kin.Circle(attributes)

    {
        type: 'circle'
        name: 'circle'
        description: 'Circle Specification'
        defaults: {
            width: 100
            height: 100
            fill: 'green'
            stroke: 'black'
            strokeWidth: 4
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_circle.png'
    }
