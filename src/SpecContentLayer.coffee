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

    draghandler = 
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

    createView = (attributes) ->
        return new kin.Layer(attributes)

    onadded = (container, component, index, e) ->
        # stage <= container
        # layer <= component

        # layer = this.findViewByComponent component
        # this.getEventTracker().on layer, draghandler, this

    onremoved = (container, component, e) ->
        # layer = this.findViewByComponent component
        # this.getEventTracker().off layer, draghandler

    onchangemodel = (after, before) ->
        for layer in this.findComponent 'content-layer'
            layer.remove before if before
            layer.add after if after
            this.findView "\##{layer.get('id')}"

    onchange = (component, before, after) ->
        view = this.findViewByComponent component
        view.setAttrs after

        this.drawView()

    controller =
        '#application' :
            'change-model' : onchangemodel
        'content-layer' :
            'added' : onadded
            'removed' : onremoved
            'change' : onchange

    # instance listeners
    component_listener = 
        'change' : onchange

    view_listener = draghandler

    {
        type: 'content-layer'
        name: 'content-layer'
        containable: true
        container_type: 'layer'
        description: 'Content Layer Specification'
        defaults: {
            #
        }
        controller: controller
        component_listener: component_listener
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_layer.png'
    }
