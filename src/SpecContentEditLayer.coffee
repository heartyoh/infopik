# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
    './EventTracker'
    './CommandPropertyChange'
    './ComponentSelector'
], (
    dou
    kin
    EventTracker
    CommandPropertyChange
    ComponentSelector
) ->

    "use strict"

    draghandler = 
        dragstart: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            background.setAttrs({x: 0, y: 0})

            this.start_point =
                x: e.offsetX
                y: e.offsetY

            this.selectbox = new kin.Rect
                stroke: 'black'
                strokeWidth: 1
                dash: [3, 3]

            this.layer.add this.selectbox
            this.selectbox.setAttrs(this.start_point)

            this.layer.draw();

            e.cancelBubble = true

        dragmove: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            background.setAttrs({x: 0, y: 0})

            this.selectbox.setAttrs({width: e.offsetX - this.start_point.x, height: e.offsetY - this.start_point.y})

            this.layer.draw();

            e.cancelBubble = true

        dragend: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            background.setAttrs({x: 0, y: 0})

            this.selectbox.remove()
            delete this.selectbox

            this.layer.draw();

            e.cancelBubble = true


    createView = (attributes) ->
        layer = new kin.Layer(attributes)
        background = new kin.Rect dou.util.shallow_merge({}, attributes, 
            draggable: true
            listening: true
            x: 0
            y: 0
            width: 1000
            height: 1000
            id: undefined
            stroke: 'black'
        )

        layer.add background

        this.getEventTracker().on(layer, draghandler, {layer: layer, background: background})

        layer

    onadded = (container, component, index, e) ->
        # stage <= container
        # layer <= component

        # background = new Kinetic.Rect({
        #     width: container.get('width')
        #     height: container.get('height')
        #     # fill: 'white',
        #     stroke: 'black',
        #     strokeWidth: 1,
        #     name: 'background',
        #     x : 0,
        #     y : 0,
        #     draggable: true,
        #     dragBoundFunc: function(pos) {
        #       return {
        #         x: this.getX(),
        #         y: this.getY()
        #       }
        #     }
        # });

        # layer = this.findViewByComponent component
        # this.getEventTracker().on layer, draghandler, this

    onremoved = (container, component, e) ->
        # layer = this.findViewByComponent component
        # this.getEventTracker().off layer, draghandler

    onchangemodel = (after, before) ->
        for layer in this.findComponent 'content-edit-layer'
            layer.remove before if before
            layer.add after if after
            this.findView "\##{layer.get('id')}"

    onchangeselections = (after, before, added, removed) ->
        console.log 'selection-changed', after

    onchange = (component, before, after) ->
        # view = this.findViewByComponent component
        # view.setAttrs after

        # this.drawView()

    controller =
        '#application' :
            'change-model' : onchangemodel
            'change-selections' : onchangeselections
        'content-edit-layer' :
            'added' : onadded
            'removed' : onremoved
            'change' : onchange

    # instance listeners
    component_listener = 
        'change' : onchange

    view_listener = 
        dragstart : (e) ->
            # console.log(e)
        dragmove : (e) ->
            # console.log(e)
        dragend : (e) ->
            node = e.targetNode
            id = e.targetNode.getAttr('id')
            component = this.findComponent("\##{id}")[0]

            console.log(e)
            return if not component

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
            this.execute(cmd)
        click : (e) ->
            node = e.targetNode
            this.selectionManager.select(node)

        mouseover: (e) ->
            # console.log(e.type, e)
        mousemove: (e) ->
            # console.log(e.type, e)
        mouseout: (e) ->
            # console.log(e.type, e)
        mouseenter: (e) ->
            # console.log(e.type, e)
        mouseleave: (e) ->
            # console.log(e.type, e)

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
        component_listener: component_listener
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_edit_layer.png'
    }
