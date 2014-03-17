# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
    '../EventTracker'
    '../ComponentSelector'
    '../command/CommandPropertyChange'
], (
    kin
    EventTracker
    ComponentSelector
    CommandPropertyChange
) ->

    "use strict"

    createView = (attributes) ->
        return new kin.Layer(attributes)

    onadded = (container, component, index, e) ->
        # stage <= container
        # layer <= component

    onremoved = (container, component, e) ->

    onchangemodel = (after, before) ->
        for layer in this.findComponent 'content-view-layer'
            
            layer.remove before if before
            layer.add after if after
            this.findView "\##{layer.get('id')}"

    onchange = (component, before, after) ->
        view = this.findViewByComponent component
        view.setAttrs after

        this.drawView()

    controller =
        '(root)' :
            '(root)' :
                'change-model' : onchangemodel
        '(self)' :
            '(all)':
                'change' : onchange
            '(self)' :
                # 'added' : onadded
                # 'removed' : onremoved
                'change' : onchange

    # instance listeners
    # component_listener = 
        # '(all)':
        #     'change' : onchange
        # '(self)' :
        #     # 'added' : onadded
        #     # 'removed' : onremoved
        #     'change' : onchange

    view_listener =
        click : (e) ->
            node = e.targetNode
            this.selectionManager.select(node)

    {
        type: 'content-view-layer'
        name: 'content-view-layer'
        containable: true
        container_type: 'layer'
        description: 'Content View Layer Specification'
        defaults: {
        }
        controller: controller
        # component_listener: component_listener
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_view_layer.png'
    }
