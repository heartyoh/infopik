# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (
    kin
) ->

    "use strict"

    createView = (attributes) ->
        layer = new kin.Layer(attributes)
        layer.add new kin.Text
            x: 10
            y: 10
            listening: false
            fontSize: 12
            fontFamily: 'Calibri'
            fill: 'green'

        layer

    onchange = (component, before, after) ->
        self = this
        self.changes++
        layer = this.layer
        text = this.text

        msg = "[ PropertyChange ] #{component.type} : #{component.get('id')}\n[ Before ] #{JSON.stringify(before)}\n[ After ] #{JSON.stringify(after)}"
        text.setAttr('text', msg)

        layer.draw()

        setTimeout ->
            return if (--self.changes) > 0
            text.setAttr('text', '')
            layer.draw()
        , 5000

    onchangemodel = (after, before) ->
        appcontext = this

        for screen in this.findComponent 'guide-layer'

            layer = (appcontext.findViewByComponent screen)[0]
            text = layer.find('Text').toArray()[0]

            before.off('change', onchange) if before
            after.on('change', onchange, {layer:layer, text:text, changes: 0}) if after

    guide_handler = 
        dragstart : (e) ->
            pos = e.targetNode.getAbsolutePosition()
            layer = this.layer
            x = pos.x
            y = pos.y
            this.vert = new kin.Line({stroke:'red', tension: 1, points:[x, 0, x, 1000]})
            this.hori = new kin.Line({stroke:'red', tension: 1, points:[0, y, 1000, y]})
            layer.add(this.vert)
            layer.add(this.hori)
            layer.draw()
        dragmove : (e) ->
            pos = e.targetNode.getAbsolutePosition()
            x = pos.x
            y = pos.y
            layer = this.layer
            this.vert.setAttrs({points:[x, 0, x, 1000]})
            this.hori.setAttrs({points:[0, y, 1000, y]})
            layer.draw()
        dragend : (e) ->
            layer = this.layer
            this.vert.remove()
            this.hori.remove()
            layer.draw()

    onadded = (container, component, index, e) ->
        topview = this.getView()
        layer = this.findView "\##{component.get('id')}"

        this.getEventTracker().on(topview, guide_handler, {app:this, layer:layer[0]})

    onremoved = (container, component, e) ->
        app = this.getView()
        this.getEventHandler().off(app, guide_handler)

    controller =
        '#application' :
            'change-model' : onchangemodel
        'guide-layer' :
            'added' : onadded
            'removed' : onremoved

    view_listener = 
        dragmove : (e) ->
            node = e.targetNode

    {
        type: 'guide-layer'
        name: 'guide-layer'
        containable: true
        container_type: 'layer'
        description: 'Editing Guide Specification'
        defaults: {
            draggable: false
        }
        controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_guide_layer.png'
    }
