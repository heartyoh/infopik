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

        view.__background__ = background
        view.__origin_offset__ = offset

        view.add background

        view

    _editmodechange = (after, before, view, model, controller) ->
        switch after
            when 'MOVE'
                view.__background__.moveToTop()
            when 'SELECT'
                view.__background__.moveToBottom()
            else
                
        view.batchDraw()

    onadded = (container, component, index, e) ->
        controller = this
        model = e.listener
        view = controller.getAttachedViews(model)[0]

        _editmodechange(controller.getEditMode(), null, view, model, controller)

    onremoved = (container, component, e) ->

    onchangemodel = (after, before, e) ->
        model = e.listener
        
        model.remove before if before
        model.add after if after

    onchangeselections = (after, before, added, removed) ->
        controller = this
        console.log 'selection-changed', after[0], controller.getAttachedModel(after[0]) if after.length > 0

    onchange = (component, before, after) ->
        view = component.getViews()[0]
        view.setAttrs after
        view.getLayer().batchDraw()

    stuck_background_position = (view) ->
        view_offset = view.offset()
        view_origin_offset = view.__origin_offset__
        view.__background__.position
            x: view_offset.x - view_origin_offset.x
            y: view_offset.y - view_origin_offset.y

    ondragstart = (e) ->
        controller = this.context
        view = this.listener

        background = view.__background__

        node = e.targetNode
        this.context.selectionManager.select(node)
            
        return if e.targetNode and e.targetNode isnt background

        this.origin_offset = view.offset()

        this.start_point =
            x: e.offsetX # e.clientX
            y: e.offsetY # e.clientY

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

        stuck_background_position view

        view.draw();

        e.cancelBubble = true

    ondragmove = (e) ->
        controller = this.context
        view = this.listener

        background = view.__background__

        return if e.targetNode and e.targetNode isnt background

        current_point = 
            x: e.offsetX # e.clientX
            y: e.offsetY # e.clientY

        switch(controller.getEditMode())
            when 'SELECT'
                this.selectbox.setAttrs({width: current_point.x - this.start_point.x, height: current_point.y - this.start_point.y})

                # TODO select components in the area of selectionbox
            when 'MOVE'
                x = this.origin_offset.x - (current_point.x - this.start_point.x)
                y = this.origin_offset.y - (current_point.y - this.start_point.y)

                view.offset
                    x: x
                    y: y

                view.fire('change-offset', {x: x, y: y}, false);
            else

        stuck_background_position view

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

        current_point = 
            x: e.offsetX # e.clientX
            y: e.offsetY # e.clientY

        switch(controller.getEditMode())
            when 'SELECT'
                this.selectbox.remove()
                delete this.selectbox
            when 'MOVE'
                x = Math.max(this.origin_offset.x - (current_point.x - this.start_point.x), -20)
                y = Math.max(this.origin_offset.y - (current_point.y - this.start_point.y), -20)

                view.offset
                    x: x
                    y: y

                view.fire('change-offset', {x: x, y: y}, false);
            else

        stuck_background_position view

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

        _editmodechange(after, before, view, model, controller)

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
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_edit_layer.png'
    }
