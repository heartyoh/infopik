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

        view = new kin.Layer(attributes)

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

        view.add background
        view.__background__ = background

        view

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        view = e.listener
        
        view.remove before if before
        view.add after if after

    onchangeselections = (after, before, added, removed) ->
        console.log 'selection-changed', after

    onchange = (component, before, after) ->

    ondragstart = (e) ->
        view = this.listener

        background = view.__background__

        node = e.targetNode
        this.context.selectionManager.select(node)
            
        return if e.targetNode and e.targetNode isnt background

        view_offset = view.offset()
        background.setAttrs({x: view_offset.x + 20, y: view_offset.y + 20})

        this.start_point =
            x: e.offsetX
            y: e.offsetY

        this.origin_offset = view.offset()

        offset = 
            x: this.start_point.x + this.origin_offset.x
            y: this.start_point.y + this.origin_offset.y

        mode = 'MOVE'
        if(mode is 'SELECT')
            this.selectbox = new kin.Rect
                stroke: 'black'
                strokeWidth: 1
                dash: [3, 3]

            view.add this.selectbox
            this.selectbox.setAttrs(offset)
        else if(mode is 'MOVE')
        else

        view.draw();

        e.cancelBubble = true

    ondragmove = (e) ->
        view = this.listener

        background = view.__background__

        return if e.targetNode and e.targetNode isnt background

        mode = 'MOVE'
        if(mode is 'SELECT')
            background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
            this.selectbox.setAttrs({width: e.offsetX - this.start_point.x, height: e.offsetY - this.start_point.y})

            # TODO select components in the area of selectionbox

        else if(mode is 'MOVE')
            x = this.origin_offset.x - (e.offsetX - this.start_point.x)
            y = this.origin_offset.y - (e.offsetY - this.start_point.y)

            view.offset
                x: x
                y: y
            background.setAttrs
                x: x + 20
                y: y + 20

            view.fire('change-offset', {x: x, y: y}, false);
        else

        view.batchDraw();

        e.cancelBubble = true

    ondragend = (e) ->
        controller = this.context
        
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

        view = this.listener

        background = view.__background__

        return if e.targetNode and e.targetNode isnt background

        mode = 'MOVE'
        if(mode is 'SELECT')
            background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
            this.selectbox.remove()
            delete this.selectbox
        else if(mode is 'MOVE')
            x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20)
            y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20)

            view.offset
                x: x
                y: y
            background.setAttrs
                x: x + 20
                y: y + 20

            view.fire('change-offset', {x: x, y: y}, false);
        else

        view.draw();

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
