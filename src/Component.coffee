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

        getContainer : ->
            @container

        setContainer : (container) ->
            @container = container

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
        MVCMixin.model
    ]
