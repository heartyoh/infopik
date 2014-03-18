# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './EventPump'
    './ComponentSelector'
], (
    dou
    EventPump
    ComponentSelector
) ->
    
    "use strict"

    class EventEngine
        constructor: (root) ->
            @eventPumps = []
            @setRoot(root)

        setRoot: (root) ->
            @root = root

        stop: ->
            for item in @eventPumps
                item.eventPump.stop()

        add: (listener, handlerMap, context) ->
            return if not @root

            for own selector, handlers of handlerMap

                targets = ComponentSelector.select(selector, @root, listener)

                for target in targets
                    eventPump = new EventPump(target)
                    eventPump.on(listener, handlers)
                    eventPump.start(context)

                    @eventPumps.push
                        eventPump: eventPump
                        listener: listener
                        handlerMap: handlerMap
                        target: target

        remove: (listener, handlerMap) ->
            for item, index in @eventPumps
                if item.listener is listener and (!handlerMap or item.handlerMap is handlerMap)
                    @eventPumps.splice(index, 1)
                    item.eventPump.despose()

        clear: ->
            for eventPump in @eventPumps
                eventPump.despose()

            @eventPumps = []

        despose: ->
            @stop()
            @clear()

    EventEngine
