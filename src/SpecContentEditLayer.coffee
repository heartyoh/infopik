# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
    './EventTracker'
    './CommandPropertyChange'
    './ComponentSelector'
], (
    kin
    EventTracker
    CommandPropertyChange
    ComponentSelector
) ->

    "use strict"

    createView = (attributes) ->
        new kin.Layer(attributes)

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
        view = this.findViewByComponent component
        view.setAttrs after

        this.drawView()

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
            console.log(e)
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
                        x: node.getAttr('x')
                        y: node.getAttr('y')
                ]
            this.execute(cmd)
        click : (e) ->
            node = e.targetNode
            this.selectionManager.select(node)

        mouseover: (e) ->
            console.log(e.type, e)
        mousemove: (e) ->
            # console.log(e.type, e)
        mouseout: (e) ->
            console.log(e.type, e)
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
            draggable: true
            # opacity: 0.5
            # draggable: true
            # dragBoundFunc: (pos) ->
            #   return {
            #     x: this.getX()
            #     y: this.getY()
            #   }
        }
        controller: controller
        component_listener: component_listener
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_edit_layer.png'
    }
