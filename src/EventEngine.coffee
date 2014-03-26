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
            @eventMaps = []
            @setRoot(root)

        setRoot: (root) ->
            @root = root

        stop: ->
            for item in @eventMaps
                item.eventPump.stop()

        add: (listener, handlerMap, context) ->
            return if not @root

            for own selector, handlers of handlerMap

                targets = ComponentSelector.select(selector, @root, listener)

                for target in targets
                    eventPump = new EventPump(target)
                    eventPump.on(listener, handlers)
                    eventPump.start(context)

                    @eventMaps.push
                        eventPump: eventPump
                        listener: listener
                        handlerMap: handlerMap
                        target: target

        remove: (listener, handlerMap) ->
            maps = dou.util.clone @eventMaps
            for item, index in maps
                if item.listener is listener and (!handlerMap or item.handlerMap is handlerMap)
                    @eventMaps.splice(index, 1)
                    item.eventPump.dispose()

        clear: ->
            maps = dou.util.clone @eventMaps
            for eventMap in maps
                eventMap.eventPump.dispose()

            @eventMaps = []

        dispose: ->
            @stop()
            @clear()

    EventEngine
