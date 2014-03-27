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

    view_factory = (attributes) ->
        new kin.Layer(attributes)

    onchange = (component, before, after, e) ->
        controller = this
        model = e.listener
        view = controller.getAttachedViews(model)[0]

        self = model._track = model._track || {}

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

    _nodeTracker = (guideLayer, node) ->
        guideLayerOffset = guideLayer.offset()
        nodeLayerOffset = node.getLayer().offset()
        nodePosition = node.position()

        {
            x: nodePosition.x + nodeLayerOffset.x - guideLayerOffset.x
            y: nodePosition.y + nodeLayerOffset.y - guideLayerOffset.y
        }

    ondragstart = (e) ->
        layer = @listener
        node = e.targetNode

        stage = layer.getStage()

        @scale = stage.getScale()
        @width = stage.getWidth()
        @height = stage.getHeight()

        # @mouseOrigin =
        #     x: Math.round(e.x / @scale.x)
        #     y: Math.round(e.y / @scale.y)

        guidePosition = _nodeTracker(layer, node)

        @vert = new kin.Line
            stroke: 'red'
            tension: 1
            points: [guidePosition.x, 0, guidePosition.x, @height]

        @hori = new kin.Line
            stroke: 'red'
            tension: 1
            points: [0, guidePosition.y, @width, guidePosition.y]

        @text = new kin.Text
            listening: false
            fontSize: 12
            fontFamily: 'Calibri'
            fill: 'green'

        @text.setAttrs
            text: "[ #{guidePosition.x}(#{node.x()}), #{guidePosition.y}(#{node.y()}) ]"
            x: if Math.max(guidePosition.x, 0) > (@text.width() + 10) then guidePosition.x - (@text.width() + 10) else Math.max(guidePosition.x + 10, 10)
            y: if Math.max(guidePosition.y, 0) > (@text.height() + 10) then guidePosition.y - (@text.height() + 10) else Math.max(guidePosition.y + 10, 10)

        layer.add(@vert)
        layer.add(@hori)
        layer.add(@text)

        layer.batchDraw()

    ondragmove = (e) ->
        layer = @listener
        node = e.targetNode

        # mouseCurrent = 
        #     x: Math.round(e.x / @scale.x)
        #     y: Math.round(e.y / @scale.y)

        # moveDelta =
        # #     x: mouseCurrent.x - @mouseOrigin.x
        # #     y: mouseCurrent.y - @mouseOrigin.y

        nodePositionCurrent = node.position()

        node.position
            x: Math.round(nodePositionCurrent.x / 10) * 10
            y: Math.round(nodePositionCurrent.y / 10) * 10

        guidePosition = _nodeTracker(layer, node)

        @vert.setAttrs({points:[guidePosition.x, 0, guidePosition.x, @height]})
        @hori.setAttrs({points:[0, guidePosition.y, @width, guidePosition.y]})

        @text.setAttrs
            text: "[ #{guidePosition.x}(#{node.x()}), #{guidePosition.y}(#{node.y()}) ]"
            x: if Math.max(guidePosition.x, 0) > (@text.width() + 10) then guidePosition.x - (@text.width() + 10) else Math.max(guidePosition.x + 10, 10)
            y: if Math.max(guidePosition.y, 0) > (@text.height() + 10) then guidePosition.y - (@text.height() + 10) else Math.max(guidePosition.y + 10, 10)

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
        view_factory_fn: view_factory
        toolbox_image: 'images/toolbox_guide_layer.png'
    }
