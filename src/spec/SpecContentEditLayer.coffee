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
], (
    dou
    kin
    EventTracker
    ComponentSelector
    CommandPropertyChange
) ->

    "use strict"

    createView = (attributes) ->
        stage = this.getView().getStage()

        offset = attributes.offset || {x:0, y:0}

        layer = new kin.Layer(attributes)

        background = new kin.Rect
            draggable: true
            listening: true
            x: 0
            y: 0
            width: Math.min(stage.width() + offset.x, stage.width())
            height: Math.min(stage.height() + offset.y, stage.height())
            stroke: attributes.stroke
            fill: 'cyan'
            # id: undefined

        layer.add background
        layer.__background__ = background

        layer

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        layer = e.listener
        layer.remove before if before
        layer.add after if after

    onchangeselections = (after, before, added, removed) ->
        console.log 'selection-changed', after

    onchange = (component, before, after) ->

    ondragstart = (e) ->
        layer = this.listener
        background = layer.__background__

        node = e.targetNode
        this.context.selectionManager.select(node)
            
        return if e.targetNode and e.targetNode isnt background

        layer_offset = layer.offset()
        background.setAttrs({x: layer_offset.x + 20, y: layer_offset.y + 20})

        this.start_point =
            x: e.offsetX
            y: e.offsetY

        this.origin_offset = layer.offset()

        offset = 
            x: this.start_point.x + this.origin_offset.x
            y: this.start_point.y + this.origin_offset.y

        mode = 'MOVE'
        if(mode is 'SELECT')
            this.selectbox = new kin.Rect
                stroke: 'black'
                strokeWidth: 1
                dash: [3, 3]

            layer.add this.selectbox
            this.selectbox.setAttrs(offset)
        else if(mode is 'MOVE')
        else

        layer.draw();

        e.cancelBubble = true

    ondragmove = (e) ->
        layer = this.listener
        background = layer.__background__

        return if e.targetNode and e.targetNode isnt background

        mode = 'MOVE'
        if(mode is 'SELECT')
            background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
            this.selectbox.setAttrs({width: e.offsetX - this.start_point.x, height: e.offsetY - this.start_point.y})

            # TODO select components in the area of selectionbox

        else if(mode is 'MOVE')
            x = this.origin_offset.x - (e.offsetX - this.start_point.x)
            y = this.origin_offset.y - (e.offsetY - this.start_point.y)

            layer.offset
                x: x
                y: y
            background.setAttrs
                x: x + 20
                y: y + 20

            layer.fire('change-offset', {x: x, y: y}, false);
        else

        layer.batchDraw();

        e.cancelBubble = true

    ondragend = (e) ->

        application = this.context

        node = e.targetNode
        component = node.getModel() if node.getModel

        if component
            cmd = new CommandPropertyChange
                changes: [
                    component: component 
                    before:
                        x: component.get('x')
                        y: component.get('y')
                    after:
                        x: node.x()
                        y: node.y()
                ]
            application.execute(cmd)

        # ...

        layer = this.listener
        background = layer.__background__

        return if e.targetNode and e.targetNode isnt background

        mode = 'MOVE'
        if(mode is 'SELECT')
            background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
            this.selectbox.remove()
            delete this.selectbox
        else if(mode is 'MOVE')
            x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20)
            y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20)

            layer.offset
                x: x
                y: y
            background.setAttrs
                x: x + 20
                y: y + 20

            layer.fire('change-offset', {x: x, y: y}, false);
        else

        layer.draw();

        e.cancelBubble = true

    onclick = (e) ->
        node = e.targetNode
        this.context.selectionManager.select(node)

    controller =
        '(root)' :
            '(root)' :
                'change-model' : onchangemodel
                'change-selections' : onchangeselections
        '(self)' :
            '(self)' :
                'added' : onadded
                'removed' : onremoved
            '(all)' :
                'change' : onchange

    view_listener =
        '(self)' : 
            dragstart : ondragstart
            dragmove : ondragmove
            dragend : ondragend
            click : onclick

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
        controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_edit_layer.png'
    }
