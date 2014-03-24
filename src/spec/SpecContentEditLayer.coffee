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

        view.add background
        view.__background__ = background

        view

    onadded = (container, component, index, e) ->
        # controller = this
        # model = e.listener
        # view = controller.getAttachedViews(model)[0]

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        model = e.listener
        
        model.remove before if before
        model.add after if after

    onchangeselections = (after, before, added, removed) ->
        controller = this
        console.log 'selection-changed', after[0], controller.getAttachedModel(after[0]) if after.length > 0

    onchange = (component, before, after) ->

    ondragstart = (e) ->
        controller = this.context
        view = this.listener

        background = view.__background__

        node = e.targetNode
        this.context.selectionManager.select(node)
            
        return if e.targetNode and e.targetNode isnt background

        view_offset = view.offset()
        background.setAttrs({x: view_offset.x + 20, y: view_offset.y + 20})

        this.start_point =
            x: e.clientX
            y: e.clientY

        this.origin_offset = view.offset()

        offset = 
            x: this.start_point.x + this.origin_offset.x
            y: this.start_point.y + this.origin_offset.y

        switch(controller.getEditMode())
            when 'SELECT'
                this.selectbox = new kin.Rect
                    stroke: 'black'
                    strokeWidth: 1
                    dash: [3, 3]

                view.add this.selectbox
                this.selectbox.setAttrs(offset)
            when 'MOVE'
            else

        view.draw();

        e.cancelBubble = true

    ondragmove = (e) ->
        controller = this.context
        view = this.listener

        background = view.__background__

        return if e.targetNode and e.targetNode isnt background

        switch(controller.getEditMode())
            when 'SELECT'
                background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
                this.selectbox.setAttrs({width: e.clientX - this.start_point.x, height: e.clientY - this.start_point.y})

                # TODO select components in the area of selectionbox
            when 'MOVE'
                x = this.origin_offset.x - (e.clientX - this.start_point.x)
                y = this.origin_offset.y - (e.clientY - this.start_point.y)

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

        switch(controller.getEditMode())
            when 'SELECT'
                background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
                this.selectbox.remove()
                delete this.selectbox
            when 'MOVE'
                x = Math.max(this.origin_offset.x - (e.clientX - this.start_point.x), -20)
                y = Math.max(this.origin_offset.y - (e.clientY - this.start_point.y), -20)

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

    onresize = (e) ->
        view = this.listener

        background = view.__background__
        background.setSize(e.after)

        view.batchDraw()

    onchangeeditmode = (after, before, e) ->
        controller = this
        model = e.listener
        view = controller.getAttachedViews(model)[0]

        switch after
            when 'MOVE'
                view.__background__.moveToTop()
            when 'SELECT'
                view.__background__.moveToBottom()
            else

    controller =
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

    view_listener =
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
        controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_edit_layer.png'
    }
