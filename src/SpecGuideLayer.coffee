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
        this.text.setAttr 'text', msg

        layer.draw()

        setTimeout ->
            return if (--self.changes) > 0
            
            tween = new Kinetic.Tween({
                node: self.text
                opacity: 0
                duration: 1
                easing: kin.Easings.EaseOut
            })

            tween.play();

            setTimeout ->
                if self.changes > 0
                    tween.reset()
                    tween.destroy()
                    return

                tween.finish()
                tween.destroy()

                self.text.remove()
                delete self.text
                layer.draw()
            , 1000
        , 5000

    onchangemodel = (after, before) ->
        appcontext = this

        for screen in this.findComponent 'guide-layer'

            layer = (appcontext.findViewByComponent screen)[0]

            before.off('change', onchange) if before
            after.on('change', onchange, {layer:layer}) if after

    guide_handler = 
        dragstart : (e) ->
            this.mouse_origin =
                x: e.x
                y: e.y

            node = e.targetNode

            this.node_origin = node.getAbsolutePosition()
            layer_offset = this.layer.offset()

            offset_x = this.node_origin.x + layer_offset.x
            offset_y = this.node_origin.y + layer_offset.y

            this.vert = new kin.Line({stroke:'red', tension: 1, points:[offset_x, 0, offset_x, 1000]})
            this.hori = new kin.Line({stroke:'red', tension: 1, points:[0, offset_y, 1000, offset_y]})

            this.text = new kin.Text
                listening: false
                fontSize: 12
                fontFamily: 'Calibri'
                fill: 'green'

            this.text.setAttr('text', "[ #{offset_x}(#{node.x()}), #{offset_y}(#{node.y()}) ]")
            textx = if Math.max(offset_x, 0) > (this.text.width() + 10) then offset_x - (this.text.width() + 10) else Math.max(offset_x + 10, 10)
            texty = if Math.max(offset_y, 0) > (this.text.height() + 10) then offset_y - (this.text.height() + 10) else Math.max(offset_y + 10, 10)
            this.text.setAttrs({x: textx, y: texty})

            layer = this.layer

            layer.add(this.vert)
            layer.add(this.hori)
            layer.add(this.text)

            layer.draw()

        dragmove : (e) ->
            node_new_pos = {
                x: (e.x - this.mouse_origin.x) + this.node_origin.x,
                y: (e.y - this.mouse_origin.y) + this.node_origin.y
            }
            x = Math.round(node_new_pos.x / 10) * 10
            y = Math.round(node_new_pos.y / 10) * 10

            node = e.targetNode
            node.setAbsolutePosition({x: x, y: y})

            layer_offset = this.layer.offset()

            offset_x = x + layer_offset.x
            offset_y = y + layer_offset.y

            this.vert.setAttrs({points:[offset_x, 0, offset_x, 1000]})
            this.hori.setAttrs({points:[0, offset_y, 1000, offset_y]})

            this.text.setAttr('text', "[ #{offset_x}(#{node.x()}), #{offset_y}(#{node.y()}) ]")
            textx = if Math.max(offset_x, 0) > (this.text.width() + 10) then offset_x - (this.text.width() + 10) else Math.max(offset_x + 10, 10)
            texty = if Math.max(offset_y, 0) > (this.text.height() + 10) then offset_y - (this.text.height() + 10) else Math.max(offset_y + 10, 10)
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
