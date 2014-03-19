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
        new kin.Text(attributes)

    createHandle = (attributes) ->
        new Kin.Text(attributes)

    {
        type: 'text'
        name: 'text'
        description: 'Text Specification'
        defaults:
            width: "auto"
            height: "auto"
            draggable: true
            strokeWidth: 1
            fontSize: 40
            fontFamily: "Arial"
            fontStyle: "normal"
            fill: "black"
            stroke: "black"
            text: "TEXT"
            rotationDeg: 0
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_text.png'
    }
