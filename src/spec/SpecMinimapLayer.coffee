# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (
    kin
) ->

    "use strict"

    view_factory = (attributes) ->
        stage = @getView().getStage()
        layer = new kin.Layer(attributes)

        controller = this
        targetLayer = null

        zeroOffset = {x: 0, y: 0}
        background = new kin.Rect
            name: 'background for minimap-layer'
            draggable: true
            listening: true
            x: 0
            y: 0
            width: stage.width()
            height: stage.height()
            stroke: attributes.stroke
            fill: 'white'
            opacity: 0.5
            dragBoundFunc: -> zeroOffset

        layer.getTargetLayer = -> 
            return targetLayer if targetLayer

            targetComponent = controller.findComponent(attributes['target_layer'])[0]

            return null if not targetComponent

            targetLayer = controller.getAttachedViews(targetComponent)[0]
            if targetLayer
                targetComponent.addDisposer ->
                    targetLayer = null

            targetLayer 

        layer.getBackground = -> background

        layer.add background
        layer

    _mousePointOnEvent = (layer, e) ->
        scale = layer.getStage().scale()

        {
            x: Math.round(e.offsetX / scale.x)
            y: Math.round(e.offsetY / scale.y)
        }

    onresize = (e) ->
        layer = @listener

        background = layer.getBackground()
        background.setSize(e.after)

        layer.batchDraw()

    ondragstart = (e) ->
        layer = @listener
        targetLayer = layer.getTargetLayer()
        
        return if not targetLayer

        @targetLayerOffsetOnStart = targetLayer.offset()

        @mousePointOnStart = _mousePointOnEvent(layer, e)

        e.cancelBubble = true

    ondragmove = (e) ->
        controller = @context
        layer = @listener
        targetLayer = layer.getTargetLayer()

        return if not targetLayer

        mousePointCurrent = _mousePointOnEvent(layer, e)

        moveDelta =
            x: mousePointCurrent.x - @mousePointOnStart.x
            y: mousePointCurrent.y - @mousePointOnStart.y

        # TODO remove implicit dependency to content-edit-layer
        controller.offset
            x: @targetLayerOffsetOnStart.x - moveDelta.x
            y: @targetLayerOffsetOnStart.y - moveDelta.y

        layer.batchDraw();

        e.cancelBubble = true

    ondragend = (e) ->
        layer = @listener

        layer.offset
            x: 0
            y: 0

        layer.batchDraw();

        e.cancelBubble = true

    onchange = (component, before, after) ->
        node = component.getViews()[0]
        node.setAttrs after
        node.getLayer().batchDraw()

    model_event_map =
        '(self)' :
            '(self)' :
                change : onchange

    view_event_map = 
        '(self)' :
            dragstart : ondragstart
            dragmove : ondragmove
            dragend : ondragend
        '(root)' :
            resize : onresize

    {
        type: 'minimap-layer'
        name: 'minimap-layer'
        containable: true
        container_type: 'layer'
        description: 'Minimap Layer Specification'
        defaults: {
            visible: false
            listening: true
        }
        model_event_map: model_event_map
        view_event_map: view_event_map
        view_factory_fn: view_factory
        toolbox_image: 'images/toolbox_minimap_layer.png'
        exportable: (appcontext, layer) ->
            appcontext.showMinimap = -> layer.set('visible', true)
            appcontext.hideMinimap = -> layer.set('visible', false)
    }
