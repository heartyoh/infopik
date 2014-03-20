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

    onchange = (component, before, after, e) ->
        guideLayer = e.listener

        guideLayer._track = {} if not guideLayer._track

        self = guideLayer._track

        self.view = e.listener.getViews()[0] if not self.view
        layer = self.view

        self.changes = (self.changes || 0) + 1
        if not self.text
            self.text = new kin.Text
                x: 10
                y: 10
                listening: false
                fontSize: 12
                fontFamily: 'Calibri'
                fill: 'green'
            layer.add self.text

        msg = "[ PropertyChange ] #{component.type} : #{component.get('id')}\n[ Before ] #{JSON.stringify(before)}\n[ After ] #{JSON.stringify(after)}"
        self.text.setAttr 'text', msg

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

    ondragstart = (e) ->
        layer = this.listener
        app = this.context

        stage = layer.getStage()
        this.width = stage.getWidth()
        this.height = stage.getHeight()

        this.mouse_origin =
            x: e.x
            y: e.y

        node = e.targetNode

        this.node_origin = node.getAbsolutePosition()
        layer_offset = layer.offset()

        offset_x = this.node_origin.x + layer_offset.x
        offset_y = this.node_origin.y + layer_offset.y

        this.vert = new kin.Line({stroke:'red', tension: 1, points:[offset_x, 0, offset_x, this.height]})
        this.hori = new kin.Line({stroke:'red', tension: 1, points:[0, offset_y, this.width, offset_y]})

        this.text = new kin.Text
            listening: false
            fontSize: 12
            fontFamily: 'Calibri'
            fill: 'green'

        this.text.setAttr('text', "[ #{offset_x}(#{node.x()}), #{offset_y}(#{node.y()}) ]")
        textx = if Math.max(offset_x, 0) > (this.text.width() + 10) then offset_x - (this.text.width() + 10) else Math.max(offset_x + 10, 10)
        texty = if Math.max(offset_y, 0) > (this.text.height() + 10) then offset_y - (this.text.height() + 10) else Math.max(offset_y + 10, 10)
        this.text.setAttrs({x: textx, y: texty})

        layer = layer

        layer.add(this.vert)
        layer.add(this.hori)
        layer.add(this.text)

        layer.batchDraw()

    ondragmove = (e) ->
        layer = this.listener

        node_new_pos = {
            x: (e.x - this.mouse_origin.x) + this.node_origin.x,
            y: (e.y - this.mouse_origin.y) + this.node_origin.y
        }
        x = Math.round(node_new_pos.x / 10) * 10
        y = Math.round(node_new_pos.y / 10) * 10

        node = e.targetNode
        node.setAbsolutePosition({x: x, y: y})

        layer_offset = layer.offset()

        offset_x = x + layer_offset.x
        offset_y = y + layer_offset.y

        this.vert.setAttrs({points:[offset_x, 0, offset_x, this.height]})
        this.hori.setAttrs({points:[0, offset_y, this.width, offset_y]})

        this.text.setAttr('text', "[ #{offset_x}(#{node.x()}), #{offset_y}(#{node.y()}) ]")
        textx = if Math.max(offset_x, 0) > (this.text.width() + 10) then offset_x - (this.text.width() + 10) else Math.max(offset_x + 10, 10)
        texty = if Math.max(offset_y, 0) > (this.text.height() + 10) then offset_y - (this.text.height() + 10) else Math.max(offset_y + 10, 10)
        this.text.setAttrs({x: textx, y: texty})

        layer.draw()

    ondragend = (e) ->
        layer = this.listener

        this.vert.remove()
        this.hori.remove()
        this.text.remove()

        layer.draw()

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->
        app = this.getView()
        this.getEventHandler().off(app, guide_handler)

    controller =
        '(root)' :
            '(all)' :
                'change' : onchange
        '(self)' :
            '(self)' :
                'added' : onadded
                'removed' : onremoved

    view_listener = 
        '(root)' : 
            dragstart : ondragstart
            dragmove : ondragmove
            dragend : ondragend

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
