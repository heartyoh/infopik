# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
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


        setSelector: (selector) ->
            @selector = selector

        on: (target, handlers, listener, context) ->
            deliverers = switch(typeof target)
                when 'object' then [target]
                when 'string' then @selector.select(target, listener)
                else []

            deliverers = [deliverers] if not (deliverers instanceof Array)

            for deliverer in deliverers
                tracker = new StandAloneTracker deliverer, handlers,
                    listener: listener
                    deliverer: deliverer
                    context: context || deliverer
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
            @selector = null

        @StandAlone: StandAloneTracker
