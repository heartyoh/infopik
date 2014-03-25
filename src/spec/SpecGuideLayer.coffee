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
        controller = this
        model = e.listener
        view = controller.getAttachedViews(model)[0]

        self = model._track = model._track || {} # if not model._track

        # self = model._track

        # self.view = controller.getAttachedViews(model)[0] if not self.view
        # view = self.view

        self.changes = (self.changes || 0) + 1
        if not self.text
            self.text = new kin.Text
                x: 10
                y: 10
                listening: false
                fontSize: 12
                fontFamily: 'Calibri'
                fill: 'green'
            view.add self.text

        msg = "[ PropertyChange ] #{component.type} : #{component.get('id')}\n[ Before ] #{JSON.stringify(before)}\n[ After ] #{JSON.stringify(after)}"
        self.text.setAttr 'text', msg

        view.draw()

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
                view.draw()
            , 1000
        , 5000

    ondragstart = (e) ->
        view = this.listener

        stage = view.getStage()
        this.width = stage.getWidth()
        this.height = stage.getHeight()

        this.mouse_origin =
            x: e.x
            y: e.y

        node = e.targetNode

        this.node_origin = node.getAbsolutePosition()
        view_offset = view.offset()

        offset_x = this.node_origin.x + view_offset.x
        offset_y = this.node_origin.y + view_offset.y

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

        view.add(this.vert)
        view.add(this.hori)
        view.add(this.text)

        view.batchDraw()

    ondragmove = (e) ->
        view = this.listener

        node_new_pos = {
            x: (e.x - this.mouse_origin.x) + this.node_origin.x,
            y: (e.y - this.mouse_origin.y) + this.node_origin.y
        }
        x = Math.round(node_new_pos.x / 10) * 10
        y = Math.round(node_new_pos.y / 10) * 10

        node = e.targetNode
        node.setAbsolutePosition({x: x, y: y})

        view_offset = view.offset()

        offset_x = x + view_offset.x
        offset_y = y + view_offset.y

        this.vert.setAttrs({points:[offset_x, 0, offset_x, this.height]})
        this.hori.setAttrs({points:[0, offset_y, this.width, offset_y]})

        this.text.setAttr('text', "[ #{offset_x}(#{node.x()}), #{offset_y}(#{node.y()}) ]")
        textx = if Math.max(offset_x, 0) > (this.text.width() + 10) then offset_x - (this.text.width() + 10) else Math.max(offset_x + 10, 10)
        texty = if Math.max(offset_y, 0) > (this.text.height() + 10) then offset_y - (this.text.height() + 10) else Math.max(offset_y + 10, 10)
        this.text.setAttrs({x: textx, y: texty})

        view.draw()

    ondragend = (e) ->
        view = this.listener

        this.vert.remove()
        this.hori.remove()
        this.text.remove()

        view.draw()

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->
        controller = this
        view = controller.getView() # root view
        this.getEventHandler().off(view, guide_handler)

    model_event_map =
        '(root)' :
            '(all)' :
                'change' : onchange
        '(self)' :
            '(self)' :
                'added' : onadded
                'removed' : onremoved

    view_event_map = 
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
        model_event_map: model_event_map
        view_event_map: view_event_map
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_guide_layer.png'
    }
