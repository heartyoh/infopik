# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
], () ->
    
    "use strict"

    class StandAloneTracker
        constructor : (target, handlers, self) ->
            @started = false;

            @target = target if target
            @handlers = handlers
            self = self or @target or this

            @boundhandler = {}

            (@boundhandler[ev] = handler.bind(self)) for own ev, handler of handlers when typeof handler is 'function'

        on: ->
            return if @started

            @target.on(ev, handler) for own ev, handler of @boundhandler

            @started = true

        off: -> 
            @target.off(ev, handler) for own ev, handler of @boundhandler

            @started = false

    class EventTracker
        constructor: ->
            @trackers = []

        on: (target, handlers, self) ->
            tracker = new StandAloneTracker(target, handlers, self)
            @trackers.push tracker
            tracker.on()

        off: (target, handlers) ->
            idxs = (i for tracker, i in @trackers when target is tracker.target and ((not handlers) or (handlers is tracker.handlers)))
            for idx in idxs.reverse()
                @trackers.splice(idx, 1)[0].off()

        all: ->
            (tracker for tracker in @trackers)

        despose: ->
            tracker.off() for tracker in @trackers
            @trackers = []

        @StandAlone: StandAloneTracker
