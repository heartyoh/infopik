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
        new kin.Rect(attributes)

    createHandle = (attributes) ->
        new Kin.Rect(attributes)

    {
        type: 'rectangle'
        name: 'rectangle'
        description: 'Rectangle Specification'
        defaults: {
            width: 100
            height: 50
            fill: 'green'
            stroke: 'black'
            strokeWidth: 4
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_rectangle.png'
    }
