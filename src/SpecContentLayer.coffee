# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define ['KineticJS'], (kin) ->

    "use strict"

    createView = (attributes) ->
        return new kin.Layer(attributes)

    onadd = (container, component, index, e) ->

    onremove = (container, component, e) ->

    onchangemodel = (after, before) ->
        for layer in this.findComponent 'content-layer'
            layer.remove before if before
            layer.add after if after
            this.findView "\##{layer.get('id')}"

    controller =
        '#application' :
            'change-model' : onchangemodel
        'content-layer' :
            'add' : onadd
            'remove' : onremove

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
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_content_layer.png'
    }
