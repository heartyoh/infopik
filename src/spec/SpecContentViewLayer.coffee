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

    view_factory = (attributes) ->
        new kin.Layer(attributes)

    model_initialize =  ->

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        model = e.listener

        if before
            model.remove before
            before.dispose()

        model.add after if after

    onchange = (component, before, after) ->
        node = component.getViews()[0]
        node.setAttrs after
        node.getLayer().batchDraw()

    _mousePointOnEvent = (layer, e) ->
        scale = layer.getStage().scale()

        {
            x: Math.round(e.offsetX / scale.x)
            y: Math.round(e.offsetY / scale.y)
        }

    model_event_map =
        '(root)' :
            '(root)' :
                'change-model' : onchangemodel
        '(self)' :
            '(self)' :
                'added' : onadded
                'removed' : onremoved
            '(all)' :
                'change' : onchange

    view_event_map =

    {
        type: 'content-view-layer'
        name: 'content-view-layer'
        containable: true
        container_type: 'layer'
        description: 'Content View Layer Specification'
        defaults: {
        }
        model_event_map: model_event_map
        view_event_map: view_event_map
        model_initialize_fn: model_initialize
        view_factory_fn: view_factory
        toolbox_image: 'images/toolbox_content_view_layer.png'
        # exportable: exportable
    }

