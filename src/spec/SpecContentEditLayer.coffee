# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
    '../EventTracker'
    '../ComponentSelector'
    '../command/CommandPropertyChange'
    './SpecContentEditLayerExportable'
], (
    dou
    kin
    EventTracker
    ComponentSelector
    CommandPropertyChange
    exportable
) ->

    "use strict"

    view_factory = (attributes) ->
        stage = @getView().getStage()

        offset = attributes.offset || {x:0, y:0}

        layer = new kin.Layer(attributes)

        background = new kin.Rect
            name: 'background for ruler-layer'
            draggable: true
            listening: true
            x: 0
            y: 0
            width: Math.min(stage.width() + offset.x, stage.width())
            height: Math.min(stage.height() + offset.y, stage.height())
            stroke: attributes.stroke
            fill: 'cyan'
            opacity: 0.1
            # id: undefined

        layer.getBackground = -> background
        layer.getOriginOffset = -> offset

        layer.add background

        layer

    model_initialize =  ->
        editmode = 'SELECT'

        @getEditMode = -> editmode
        @setEditMode = (mode) ->
            return if mode is editmode
            old = editmode
            editmode = mode
            @trigger 'change-edit-mode', mode, old

    _editmodechange = (after, before, layer, model, controller) ->
        switch after
            when 'MOVE'
                layer.getBackground().moveToTop()
            when 'SELECT'
                layer.getBackground().moveToBottom()
            else
                
        layer.batchDraw()

    onadded = (container, component, index, e) ->
        controller = this
        model = e.listener
        layer = controller.getAttachedViews(model)[0]

        _editmodechange(model.getEditMode(), null, layer, model, controller)

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        model = e.listener
        
        if before
            model.remove before
            before.dispose()

        model.add after if after

    onchangeselections = (after, before, added, removed) ->
        controller = this
        console.log 'selection-changed', after[0], controller.getAttachedModel(after[0]) if after.length > 0

    onchange = (component, before, after) ->
        node = component.getViews()[0]
        node.setAttrs after
        node.getLayer().batchDraw()

    _stuckBackgroundPosition = (layer) ->
        layerOffset = layer.offset()
        layerOriginOffset = layer.getOriginOffset()
        layer.getBackground().position
            x: layerOffset.x - layerOriginOffset.x
            y: layerOffset.y - layerOriginOffset.y

    _mousePointOnEvent = (layer, e) ->
        scale = layer.getStage().scale()

        {
            x: Math.round(e.offsetX / scale.x) # e.clientX
            y: Math.round(e.offsetY / scale.y) # e.clientY
        }

    ondragstart = (e) ->
        controller = @context
        layer = @listener
        model = controller.getAttachedModel(layer)

        background = layer.getBackground()
        node = e.targetNode

        controller.selectionManager.select(node)
            
        return if node and node isnt background

        @layerOffsetOnStart = layer.offset()

        @mousePointOnStart = _mousePointOnEvent(layer, e)

        offset = 
            x: @mousePointOnStart.x + @layerOffsetOnStart.x
            y: @mousePointOnStart.y + @layerOffsetOnStart.y

        switch(model.getEditMode())
            when 'SELECT'
                @selectbox = new kin.Rect
                    stroke: 'black'
                    strokeWidth: 1
                    dash: [3, 3]

                layer.add @selectbox
                @selectbox.setAttrs offset
            when 'MOVE'
            else

        _stuckBackgroundPosition layer

        layer.draw();

        e.cancelBubble = true

    ondragmove = (e) ->
        controller = @context
        layer = @listener
        model = controller.getAttachedModel(layer)

        background = layer.getBackground()
        node = e.targetNode

        return if node and node isnt background

        mousePointCurrent = _mousePointOnEvent(layer, e)
        moveDelta =
            x: mousePointCurrent.x - @mousePointOnStart.x
            y: mousePointCurrent.y - @mousePointOnStart.y

        switch(model.getEditMode())
            when 'SELECT'
                @selectbox.setAttrs
                    width: moveDelta.x
                    height: moveDelta.y

                # TODO select components in the area of selectionbox
            when 'MOVE'
                layer.offset
                    x: @layerOffsetOnStart.x - moveDelta.x
                    y: @layerOffsetOnStart.y - moveDelta.y

                layer.fire('change-offset', layer.offset(), false);
            else

        _stuckBackgroundPosition layer

        layer.batchDraw();

        e.cancelBubble = true

    ondragend = (e) ->
        controller = @context
        layer = @listener
        model = controller.getAttachedModel(layer)
        
        dragview = e.targetNode
        dragmodel = controller.getAttachedModel(dragview)

        if dragmodel
            cmd = new CommandPropertyChange
                changes: [
                    component: dragmodel 
                    
                    before:
                        x: dragmodel.get('x')
                        y: dragmodel.get('y')
                    after:
                        x: dragview.x()
                        y: dragview.y()
                ]
            controller.execute(cmd)

        # ...

        layer = @listener

        background = layer.getBackground()

        return if e.targetNode and e.targetNode isnt background

        mousePointCurrent = _mousePointOnEvent(layer, e)
        moveDelta =
            x: mousePointCurrent.x - @mousePointOnStart.x
            y: mousePointCurrent.y - @mousePointOnStart.y

        switch(model.getEditMode())
            when 'SELECT'
                @selectbox.remove()
                delete @selectbox
            when 'MOVE'
                layer.offset
                    x: Math.max(@layerOffsetOnStart.x - moveDelta.x, -20)
                    y: Math.max(@layerOffsetOnStart.y - moveDelta.y, -20)

                layer.fire('change-offset', layer.offset(), false);
            else

        _stuckBackgroundPosition layer

        layer.draw();

        e.cancelBubble = true

    onclick = (e) ->
        node = e.targetNode
        @context.selectionManager.select(node)

    onresize = (e) ->
        layer = @listener

        background = layer.getBackground()
        background.setSize(e.after)

        layer.batchDraw()

    onchangeeditmode = (after, before, e) ->
        controller = this
        model = e.listener
        layer = controller.getAttachedViews(model)[0]

        _editmodechange(after, before, layer, model, controller)

    model_event_map =
        '(root)' :
            '(root)' :
                'change-model' : onchangemodel
                'change-selections' : onchangeselections
                'change-edit-mode' : onchangeeditmode
        '(self)' :
            '(self)' :
                'added' : onadded
                'removed' : onremoved
            '(all)' :
                'change' : onchange

    view_event_map =
        '(self)' : 
            dragstart : ondragstart
            dragmove : ondragmove
            dragend : ondragend
            click : onclick
        '(root)' :
            resize : onresize

    {
        type: 'content-edit-layer'
        name: 'content-edit-layer'
        containable: true
        container_type: 'layer'
        description: 'Selection Edit Layer Specification'
        defaults: {
            listening: true
            draggable: false
        }
        model_event_map: model_event_map
        view_event_map: view_event_map
        model_initialize_fn: model_initialize
        view_factory_fn: view_factory
        toolbox_image: 'images/toolbox_content_edit_layer.png'
        exportable: exportable
    }
