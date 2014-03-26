# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './MVCMixin'
], (
    dou
    MVCMixin
) ->
    
    "use strict"

    class Component
        constructor : (type, container) ->
            @type = type
            @container = container

        dispose : ->
            @setContainer null

        getContainer : ->
            @container

        setContainer : (container) ->
            return if container is @container

            if @container
                @container.remove this

            @container = container
            if @container
                @container.add this

        moveAt: (index) ->
            return if not @getContainer()
            @container.moveChildAt(index, this)

        moveForward: ->
            return if not @getContainer()
            @container.moveChildForward(this)

        moveBackward: ->
            return if not @getContainer()
            @container.moveChildBackward(this)

        moveToFront: ->
            return if not @getContainer()
            @container.moveChildToFront(this)

        moveToBack: ->
            return if not @getContainer()
            @container.moveChildToBack(this)

    dou.mixin Component, [
        dou.with.advice
        dou.with.event
        dou.with.property
        dou.with.lifecycle
        dou.with.serialize
        dou.with.disposer
        MVCMixin.model
    ]
