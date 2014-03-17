# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
], (
    dou
    kin
) ->

    "use strict"

    createView = (attributes) ->
        layer = new kin.Layer(attributes)
        layer.handles = {}

        if attributes.offset_monitor_target
            target_comp = this.findComponent(attributes.offset_monitor_target)[0]
            target_view = this.findViewByComponent(target_comp)

            target_view.on 'change-offset', (e) ->
                layer.offset {x: e.x, y: e.y}
                layer.draw()

            this.getEventTracker().on(target_view, {
                dragmove: (e) ->
                    id = e.targetNode.getAttr('id')
                    handle = layer.handles[id]

                    if handle
                        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
                        layer.draw()

                dragend: (e) ->
                    id = e.targetNode.getAttr('id')
                    handle = layer.handles[id]

                    if handle
                        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
                        layer.draw()
            }, {})

        layer

    # view_listener :
    #     '(.offset_monitor_target)' :
    #         'change-offset' : (e) ->
    #             layer = this.subscriber
    #             layer.offset {x: e.x, y: e.y}
    #             layer.draw()
    #     '(.offset_monitor_target) >' :
    #         'dragmove' : (e) ->
    #             layer = this.subscriber

    #             id = e.targetNode.id()
    #             handle = layer.handles[id]

    #             if handle
    #                 handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
    #                 layer.draw()

    #         'dragend' : (e) ->
    #             layer = this.subscriber

    #             id = e.targetNode.getAttr('id')
    #             handle = layer.handles[id]

    #             if handle
    #                 handle.setAbsolutePosition(e.targetNode.getAbsolutePosition())
    #                 layer.draw()

    onchangeselection = (after, before, added, removed, e) ->
        container = e.listener
        layer = this.findViewByComponent(container)[0]

        for node in removed
            id = node.getAttr('id')
            handle = layer.handles[id]
            handle_comp = this.findComponent("\##{handle.getAttr('id')}")[0]
            container.remove(handle_comp)

            delete layer.handles[id]

        for node in added
            id = node.getAttr('id')
            pos = node.getAbsolutePosition()
            handle_comp = this.createComponent
                type: 'handle-checker'
                attrs: {}

            container.add(handle_comp)
            handle_view = this.findViewByComponent(handle_comp)[0]
            handle_view.setAbsolutePosition(pos)

            layer.handles[id] = handle_view

        layer.draw()

    controller = 
        '(root)' :
            '(root)' :
                'change-selections' : onchangeselection

    {
        type: 'handle-layer'
        name: 'handle-layer'
        containable: true
        container_type: 'layer'
        description: 'Handle Layer Specification'
        defaults:
            draggable: false

        controller: controller
        # view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_handle_layer.png'
    }
