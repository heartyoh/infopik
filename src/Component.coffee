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
            console.log 'component disposed', @type

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

        moveUp: ->
            return if not @getContainer()
            @container.moveChildUp(this)

        moveDown: ->
            return if not @getContainer()
            @container.moveChildDown(this)

        moveToTop: ->
            return if not @getContainer()
            @container.moveChildToTop(this)

        moveToBottom: ->
            return if not @getContainer()
            @container.moveChildToBottom(this)

    dou.mixin Component, [
        dou.with.advice
        dou.with.event
        dou.with.property
        dou.with.lifecycle
        dou.with.serialize
        dou.with.disposer
        MVCMixin.model
    ]
