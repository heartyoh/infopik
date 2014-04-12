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

    LEFT = -1
    CENTER = 0
    RIGHT = 1
    TOP = -1
    MIDDLE = 0
    BOTTOM = 1

    # Handler class.
    # 
    # This class extends the Kinetic.Circle class.
    # 
    # @param {Number} hAlign      Horizontal alignment (left: -1, center: 0,
    #                             right: 1)
    # @param {Number} vAlign      Vertical alignment (top: -1, middle: 0,
    #                             bottom: 1)
    # @param {Number} radius      Handler radius
    # @param {String} fill        Fill color
    # @param {String} stroke      Stroke color
    # @param {Number} strokeWidth Stroke width
    # 
    # @return {Void}
    class Handler extends kin.Circle
        constructor: (hAlign, vAlign, radius, fill, stroke, strokeWidth) ->
            @_align = [hAlign, vAlign]
            
            kin.Circle.call @,
                radius: radius
                fill: fill
                stroke: stroke
                strokeWidth: strokeWidth
                draggable: true

        # Gets handler alignment.
        # 
        # Returns an array of two numbers. The first number is the horizontal alignment
        # and the second number is the vertical alignment.
        # 
        # @return {Array}
        getAlign: ->
            @_align

    # RotateHandler class.
    #
    # This class extends the Kinetic.Circle class.
    #
    # @param {Number} radius      Handler radius
    # @param {String} fill        Fill color
    # @param {String} stroke      Stroke color
    # @param {Number} strokeWidth Stroke width
    #
    # @return {Void}
    class RotateHandler extends kin.Circle
        constructor: (radius, fill, stroke, strokeWidth) ->

            kin.Circle.call @,
                radius: radius
                fill: fill
                stroke: stroke
                strokeWidth: strokeWidth
                draggable: true

    # RectHandle class.
    # 
    # This class extends the Kinetic.Group class.
    # 
    # @param {Object}       options Custom options
    # 
    # @return {Void}
    class RectHandle extends kin.Group
        constructor: (options) ->
            @_options = options
            @_handlers = []
            @_rotateHandler = null
            @_border = null

            kin.Group.call @,
                width: options.width
                height: options.height
                fill: options.fill
                stroke: options.stroke
                strokeWidth: options.strokeWidth
                draggable: true

            @createBorder()

            @addHandler TOP, LEFT
            @addHandler TOP, CENTER
            @addHandler TOP, RIGHT
            @addHandler MIDDLE, LEFT
            @addHandler MIDDLE, RIGHT
            @addHandler BOTTOM, LEFT
            @addHandler BOTTOM, CENTER
            @addHandler BOTTOM, RIGHT

            @addRotateHandler()

        # Creates the border.
        # 
        # @return {Void}
        createBorder: ->
            @_border = new kin.Line
                points: [0, 0]
                stroke: @_options['border-stroke']
                strokeWidth: @_options['border-stroke-width']
            
            @add(@_border)
        
        # Creates the rotate handler.
        # 
        # @return {Kinetic.Circle}
        addRotateHandler: ->

            self = this
            
            @_rotateHandler = new RotateHandler
                radius: @_options['handler-radius']
                fill: @_options['handler-fill']
                stroke: @_options['handler-stroke']
                strokeWidth: @_options['handler-stroke-width']

            @_rotateHandler.setDragBoundFunc (pos) ->
                if @isDragging()
                    # rotateGroup = self.getParent()
                    p = rotateGroup.getAbsolutePosition()
                    v = 
                        x: p.x - pos.x
                        y: p.y - pos.y
                    angle = self.getAngle(v)
                    
                    rotateGroup.setRotation(angle)

                return pos

            @_rotateHandler.on 'dragmove', ->
                self.update()
            
            @add @_rotateHandler

            return @_rotateHandler

        # Adds a handler.
        # 
        # @param {Number}  hAlign  Horizontal alignment (left: -1, center: 0, right: 1)
        # @param {Number}  vAlign  Vertical alignment (top: -1, middle: 0, bottom: 1)
        # @param {Boolean} visible Is the handler visible?
        # 
        # @return {Handler}
        addHandler: (hAlign, vAlign) ->
            handler = new Handler(
                hAlign
                vAlign
                @_options['handler-radius']
                @_options['handler-fill']
                @_options['handler-stroke']
                @_options['handler-strokeWidth']
            )

            @add handler
            @_handlers.push handler

        # Gets a handler by alignment.
        # 
        # @param {Number} hAlign Horizontal alignment (left: -1, center: 0, right: 1)
        # @param {Number} vAlign Vertical alignment (top: -1, middle: 0, bottom: 1)
        # 
        # @return {Handler}
        getHandlerByAlign: (hAlign, vAlign) ->
            for handler in @_handlers
                align = handler.getAlign()
                return handler if (align[0] is hAlign) and (align[1] is vAlign)
            
            return null

        # Gets the opposite handler.
        # 
        # @return {Handler}
        getOppositeHandler: (handler) ->
            align = handler.getAlign()
            
            return @getHandlerByAlign -align[0], -align[1]
        
        # Set target node for handle
        #
        # @param {Kinetic.Node}
        #
        # @return {Void}
        setTarget: (target) ->
            @_target = target
            @update()

        # Set handle to visible
        #
        # @return {Void}
        showHandle: ->
            @visible true

        # Set handle to invisible
        #
        # @return {Void}
        hideHandle: ->
            @visible false

        # Updates handler positions.
        #
        # @return {Void}
        update: ->
            # target properties
            targetX = @_target.getX() - @_target.getOffsetX()
            targetY = @_target.getY() - @_target.getOffsetY()
            targetWidth = @_target.getWidth()
            targetHeight = @_target.getHeight()
            
            # positions
            rotate =
                x: targetX + targetWidth / 2
                y: targetY - @_options['rotate-distance']

            leftTop = {x: targetX, y: targetY}
            rightTop = {x: targetX + targetWidth, y: targetY}
            leftBottom = {x: targetX, y: targetY + targetHeight}
            rightBottom = {x: targetX + targetWidth, y: targetY + targetHeight}
            centerTop = {x: targetX + targetWidth / 2, y: targetY}
            leftMiddle = {x: targetX, y: targetY + targetHeight / 2}
            rightMiddle = {x: targetX + targetWidth, y: targetY + targetHeight / 2}
            centerBottom = {x: targetX + targetWidth / 2, y: targetY + targetHeight}
            
            # adds points to the border
            points = [
                centerTop
                leftTop
                leftBottom
                rightBottom
                rightTop
                centerTop
            ]
            if (@_options['allow-rotate'])
                points.unshift(rotate)

            @_border.setPoints(points)
            
            
            # sets rotate handler position
            @_rotateHandler.setPosition(rotate)
            
            # sets left-top handler position
            @getHandlerByAlign(
                LEFT,
                TOP
            ).setPosition(leftTop)
            
            # sets right-top handler position
            @getHandlerByAlign(
                RIGHT,
                TOP
            ).setPosition(rightTop)
            
            # sets left-bottom handler position
            @getHandlerByAlign(
                LEFT,
                BOTTOM
            ).setPosition(leftBottom)
            
            # sets right-bottom handler position
            @getHandlerByAlign(
                RIGHT,
                BOTTOM
            ).setPosition(rightBottom)
            
            # sets center-top handler position
            @getHandlerByAlign(
                CENTER,
                TOP
            ).setPosition(centerTop)
            
            # sets left-middle handler position
            @getHandlerByAlign(
                LEFT,
                MIDDLE
            ).setPosition(leftMiddle)
            
            # sets right-middle handler position
            @getHandlerByAlign(
                RIGHT,
                MIDDLE
            ).setPosition(rightMiddle)
            
            # sets center-bottom handler position
            @getHandlerByAlign(
                CENTER,
                BOTTOM
            ).setPosition(centerBottom)

    view_factory = (attributes) ->
        handle = new RectHandle attributes

        handle

    {
        type: 'handle-rect'
        name: 'handle-rect'
        description: 'Rectangle Handle Specification'
        defaults: {
            width: 10
            height: 10
            fill: 'red'
            stroke: 'black'
            strokeWidth: 2
            'handler-radius': 10
            'handler-fill': 'gray'
            'handler-stroke': 'black'
            'handler-strokeWidth': 2
            'rotate-distance': 10
            'border-stroke': 'black'
            'border-stroke-width': 2
        }
        view_factory_fn: view_factory
        toolbox_image: 'images/toolbox_handle_rect.png'
    }
