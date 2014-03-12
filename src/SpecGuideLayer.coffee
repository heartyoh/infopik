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
        new kin.Layer(attributes)

    onchange = (component, before, after) ->
        self = this
        layer = this.layer

        this.changes = (this.changes || 0) + 1
        if not this.text
            this.text = new kin.Text
                x: 10
                y: 10
                listening: false
                fontSize: 12
                fontFamily: 'Calibri'
                fill: 'green'
            layer.add this.text

        msg = "[ PropertyChange ] #{component.type} : #{component.get('id')}\n[ Before ] #{JSON.stringify(before)}\n[ After ] #{JSON.stringify(after)}"
        this.text.setAttr('text', msg)

        layer.draw()

        setTimeout ->
            return if (--self.changes) > 0
            self.text.remove()
            delete self.text
            layer.draw()
        , 5000

    onchangemodel = (after, before) ->
        appcontext = this

        for screen in this.findComponent 'guide-layer'

            layer = (appcontext.findViewByComponent screen)[0]

            before.off('change', onchange) if before
            after.on('change', onchange, {layer:layer}) if after

    bound_fn = (x, y) ->
        node = this
        pos = node.getAbsolutePosition();
        console.log('before', pos)
        pos.x = Math.round(pos.x / 10) * 10
        pos.y = Math.round(pos.y / 10) * 10
        console.log('after', pos)
        pos

    guide_handler = 
        dragstart : (e) ->
            this.mouse_origin = {
                x: e.x,
                y: e.y
            }

            node = e.targetNode

            this.node_origin = node.getAbsolutePosition();

            pos = node.getAbsolutePosition()

            x = pos.x
            y = pos.y

            this.vert = new kin.Line({stroke:'red', tension: 1, points:[x, 0, x, 1000]})
            this.hori = new kin.Line({stroke:'red', tension: 1, points:[0, y, 1000, y]})
            this.text = new kin.Text
                x: x
                y: y
                listening: false
                fontSize: 12
                fontFamily: 'Calibri'
                fill: 'green'
            this.text.setAttr('text', "[ #{x}(#{node.x()}), #{y}(#{node.y()}) ]")
            textx = if Math.max(x, 0) > (this.text.width() + 10) then x - (this.text.width() + 10) else Math.max(x + 10, 10)
            texty = if Math.max(y, 0) > (this.text.height() + 10) then y - (this.text.height() + 10) else Math.max(y + 10, 10)
            this.text.setAttrs({x: textx, y: texty})

            layer = this.layer

            layer.add(this.vert)
            layer.add(this.hori)
            layer.add(this.text)

            layer.draw()

        dragmove : (e) ->
            pos = {
                x: e.x - this.mouse_origin.x + this.node_origin.x,
                y: e.y - this.mouse_origin.y + this.node_origin.y
            }
            x = Math.round(pos.x / 10) * 10
            y = Math.round(pos.y / 10) * 10

            node = e.targetNode
            node.setAbsolutePosition({x: x, y:y})

            this.vert.setAttrs({points:[x, 0, x, 1000]})
            this.hori.setAttrs({points:[0, y, 1000, y]})
            this.text.setAttr('text', "[ #{x}(#{node.x()}), #{y}(#{node.y()}) ]")
            textx = if Math.max(x, 0) > (this.text.width() + 10) then x - (this.text.width() + 10) else Math.max(x + 10, 10)
            texty = if Math.max(y, 0) > (this.text.height() + 10) then y - (this.text.height() + 10) else Math.max(y + 10, 10)
            this.text.setAttrs({x: textx, y: texty})

            this.layer.draw()

        dragend : (e) ->
            this.vert.remove()
            this.hori.remove()
            this.text.remove()

            this.layer.draw()

    onadded = (container, component, index, e) ->
        layer = (this.findView "\##{component.get('id')}")[0]

        this.getEventTracker().on(this.getView(), guide_handler, {layer:layer})

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
