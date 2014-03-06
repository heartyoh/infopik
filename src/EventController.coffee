# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    select = (selector, target) ->
        return selector is target.type

    control = (handler_map, event, args)->
        for own selector, event_map of handler_map when select(selector, event.target)
            for own event_name, handler of event_map when event_name is event.name
                (handler.apply null, args)

    event_handler_fn = ->
        args = arguments
        e = args[args.length - 1]

        @forEach (handler_map) ->
            control handler_map, e, args

    class EventController
        constructor: (target)->
            @setTarget(target)

        setTarget: (target) ->
            @target = target

        start: ->
            @target.on 'all', event_handler_fn, this

        stop: ->
            @target.off 'all', event_handler_fn

        despose: ->
            @stop()
            clear()
            @target = null

    dou.mixin EventController, dou.with.collection.withList

    EventController
