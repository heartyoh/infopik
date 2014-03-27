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

    abs_calculator = (layer, pos) ->
        x: (layer.offsetX() + pos.x) * layer.getStage().getScale().x
        y: (layer.offsetY() + pos.y) * layer.getStage().getScale().y

    logic_calculator = (layer, pos) ->
        x: pos.x / layer.getStage().getScale().x + layer.offsetX()
        y: pos.y / layer.getStage().getScale().y + layer.offsetY()

    ondragstart = (e) ->
        layer = @listener
        node = e.targetNode

        stage = layer.getStage()

        @scale = stage.getScale()
        @width = stage.getWidth()
        @height = stage.getHeight()

        @mouse_origin =
            x: Math.round(e.x / @scale.x)
            y: Math.round(e.y / @scale.y)

        @node_origin = node.position()

        @layer_offset =
            x: node.getLayer().offset().x - layer.offset().x
            y: node.getLayer().offset().y - layer.offset().y 

        x = @node_origin.x - @layer_offset.x
        y = @node_origin.y - @layer_offset.y

        @vert = new kin.Line({stroke:'red', tension: 1, points:[x, 0, x, @height]})
        @hori = new kin.Line({stroke:'red', tension: 1, points:[0, y, @width, y]})

        @text = new kin.Text
            listening: false
            fontSize: 12
            fontFamily: 'Calibri'
            fill: 'green'

        @text.setAttr('text', "[ #{x}(#{node.x()}), #{y}(#{node.y()}) ]")
        textx = if Math.max(x, 0) > (@text.width() + 10) then x - (@text.width() + 10) else Math.max(x + 10, 10)
        texty = if Math.max(y, 0) > (@text.height() + 10) then y - (@text.height() + 10) else Math.max(y + 10, 10)
        @text.setAttrs({x: textx, y: texty})

        layer.add(@vert)
        layer.add(@hori)
        layer.add(@text)

        layer.batchDraw()

    ondragmove = (e) ->
        layer = @listener
        node = e.targetNode

        mouse_current = 
            x: Math.round(e.x / @scale.x)
            y: Math.round(e.y / @scale.y)

        node_current = {
            x: (mouse_current.x - @mouse_origin.x) + @node_origin.x,
            y: (mouse_current.y - @mouse_origin.y) + @node_origin.y
        }

        node_x = Math.round(node_current.x / 10) * 10
        node_y = Math.round(node_current.y / 10) * 10

        node.position({x: node_x, y: node_y})

        # layer_offset = layer.offset()

        x = node_x - @layer_offset.x
        y = node_y - @layer_offset.y

        @vert.setAttrs({points:[x, 0, x, @height]})
        @hori.setAttrs({points:[0, y, @width, y]})

        @text.setAttr('text', "[ #{x}(#{node.x()}), #{y}(#{node.y()}) ]")
        textx = if Math.max(x, 0) > (@text.width() + 10) then x - (@text.width() + 10) else Math.max(x + 10, 10)
        texty = if Math.max(y, 0) > (@text.height() + 10) then y - (@text.height() + 10) else Math.max(y + 10, 10)
        @text.setAttrs({x: textx, y: texty})

        layer.batchDraw()

    ondragend = (e) ->
        layer = @listener

        @vert.remove()
        @hori.remove()
        @text.remove()

        layer.batchDraw()

    onadded = (container, component, index, e) ->

    onremoved = (container, component, e) ->
        controller = this
        view = controller.getView() # root view
        # @getEventHandler().off(view, guide_handler)

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
