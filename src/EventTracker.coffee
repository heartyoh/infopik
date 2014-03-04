# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
], ->
    
    "use strict"

    class EventTracker
        constructor : (target, handlers, self) ->
            @started = false;

            @target = target if target
            @self = self or @target or this
            @handlers = {}

            (@handlers[ev] = handler.bind(@self)) for own ev, handler of handlers when typeof handler is 'function'

        on: ->
            return if @started

            @target.on(ev, handler) for own ev, handler of @handlers

            @started = true

        off: -> 
            @target.off(ev, handler) for own ev, handler of @handlers

            @started = false
