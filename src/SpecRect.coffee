# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    class RectShapeFactory
        @createShape: (attributes) ->
            return new kin.Rect(attributes)

    class RectHandleFactory
        @createHandle: (attributes) ->
            return new Kin.Rect(attributes)

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
        shape_factory: RectShapeFactory
        handle_factory: RectHandleFactory
        toolbox_image: 'images/toolbox_rectangle.png'
    }
