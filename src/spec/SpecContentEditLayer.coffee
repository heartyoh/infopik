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

    draghandler = 
        dragstart: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            layer_offset = this.layer.offset()
            background.setAttrs({x: layer_offset.x + 20, y: layer_offset.y + 20})

            this.start_point =
                x: e.offsetX
                y: e.offsetY

            this.origin_offset = this.layer.offset()

            offset = 
                x: this.start_point.x + this.origin_offset.x
                y: this.start_point.y + this.origin_offset.y

            mode = 'MOVE'
            if(mode is 'SELECT')
                this.selectbox = new kin.Rect
                    stroke: 'black'
                    strokeWidth: 1
                    dash: [3, 3]

                this.layer.add this.selectbox
                this.selectbox.setAttrs(offset)
            else if(mode is 'MOVE')
            else

            this.layer.draw();

            e.cancelBubble = true

        dragmove: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            mode = 'MOVE'
            if(mode is 'SELECT')
                background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
                this.selectbox.setAttrs({width: e.offsetX - this.start_point.x, height: e.offsetY - this.start_point.y})

                # TODO select components in the area of selectionbox

            else if(mode is 'MOVE')
                x = this.origin_offset.x - (e.offsetX - this.start_point.x)
                y = this.origin_offset.y - (e.offsetY - this.start_point.y)

                this.layer.offset
                    x: x
                    y: y
                this.background.setAttrs
                    x: x + 20
                    y: y + 20

                this.layer.fire('change-offset', {x: x, y: y}, false);
            else

            this.layer.draw();

            e.cancelBubble = true

        dragend: (e) ->
            return if e.targetNode and e.targetNode isnt this.background

            background = this.background

            mode = 'MOVE'
            if(mode is 'SELECT')
                background.setAttrs({x:this.origin_offset.x + 20, y:this.origin_offset.y + 20})
                this.selectbox.remove()
                delete this.selectbox
            else if(mode is 'MOVE')
                x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20)
                y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20)

                this.layer.offset
                    x: x
                    y: y
                this.background.setAttrs
                    x: x + 20
                    y: y + 20

                this.layer.fire('change-offset', {x: x, y: y}, false);
            else

            this.layer.draw();

            e.cancelBubble = true

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

    onchangemodel = (after, before, e) ->
        layer = e.listener
        layer.remove before if before
        layer.add after if after
        this.findView "\##{layer.get('id')}"

        # for layer in this.findComponent 'content-edit-layer'
            # layer.remove before if before
            # layer.add after if after
            # this.findView "\##{layer.get('id')}"

    onchangeselections = (after, before, added, removed) ->
        console.log 'selection-changed', after

    onchange = (component, before, after) ->
        # view = this.findViewByComponent component
        # view.setAttrs after

        # this.drawView()

    controller =
        '(root)' :
            'change-model' : onchangemodel
            'change-selections' : onchangeselections
        # '(self)' :
        #     'added' : onadded
        #     'removed' : onremoved
        #     'change' : onchange

    # instance listeners
    component_listener = 
        '(self)' :
            'added' : onadded
            'removed' : onremoved
            'change' : onchange
        # 'change' : onchange

    view_listener = 
        dragstart : (e) ->
            # console.log(e)
        dragmove : (e) ->
            # console.log(e)
        dragend : (e) ->
            node = e.targetNode
            id = e.targetNode.getAttr('id')
            component = this.findComponent("\##{id}")[0]

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
