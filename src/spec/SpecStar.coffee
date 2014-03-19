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
        new kin.Star(attributes)

    createHandle = (attributes) ->
        new Kin.Star(attributes)

    {
        type: 'star'
        name: 'star'
        description: 'Star Specification'
        defaults: {
            width: 100
            height: 50
            numPoints: 5
            innerRadius: 35
            outerRadius: 70
            fill: 'red'
            stroke: 'black'
            strokeWidth: 4
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_star.png'
    }
