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
        new kin.Layer(attributes)

    onchangeoffset = (e) ->
        layer = this.listener

        if not layer.__hori__
            children = layer.getChildren().toArray()
            layer.__hori__ = children[0]
            layer.__vert__ = children[1]

        layer.__hori__.setAttr('zeropos', -e.x)
        layer.__vert__.setAttr('zeropos', -e.y)

        layer.draw()

    view_listener = 
        '?offset_monitor_target':
            'change-offset': onchangeoffset

    {
        type: 'ruler-layer'
        name: 'ruler-layer'
        containable: true
        container_type: 'layer'
        description: 'Ruler Layer Specification'
        defaults:
            draggable: false

        # controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        components: [{
            type: 'ruler'
            attrs:
                direction: 'horizontal'
                margin: [20, 0]
                opacity: 0.8
                x: 0
                y: 0
                width: 1000
                height: 20
                zeropos: 20
        }, {
            type: 'ruler'
            attrs:
                direction: 'vertical'
                margin: [20, 0]
                opacity: 0.8
                x: 0
                y: 0
                width: 20
                height: 1000
                zeropos: 20
        }]
        toolbox_image: 'images/toolbox_ruler_layer.png'
    }
