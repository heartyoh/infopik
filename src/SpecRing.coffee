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
        new kin.Ring(attributes)

    createHandle = (attributes) ->
        new Kin.Ring(attributes)

    {
        type: 'ring'
        name: 'ring'
        description: 'Ring Specification'
        defaults: {
            innerRadius: 40
            outerRadius: 80
            fill: 'red'
            stroke: 'black'
            strokeWidth: 5
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_ring.png'
    }
