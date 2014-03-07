# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './ComponentSelector'
], (dou, ComponentSelector) ->
    
    "use strict"

    control = (handler_map, event, args)->
        for own selector, event_map of handler_map when ComponentSelector.match(selector, event.target)
            for own event_name, handler of event_map when event_name is event.name
                (handler.apply this, args)

    event_handler_fn = ->
        args = arguments
        e = args[args.length - 1]

        this.controllers.forEach (handler_map) ->
            control.call this, handler_map, e, args
        , this.context

    class EventController
        constructor: (target)->
            @setTarget(target)

        setTarget: (target) ->
            @target = target

        start: (context) ->
            @target.on 'all', event_handler_fn, {context:(context||null), controllers:this}

        stop: ->
            @target.off 'all', event_handler_fn

        despose: ->
            @stop()
            @clear()
            @target = null

    dou.mixin EventController, dou.with.collection.withList

    EventController
