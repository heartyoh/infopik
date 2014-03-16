# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
], () ->
    
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




    class StandAloneRouter
        constructor : (target, routeset) ->
            @started = false;

            @target = target if target
            @routeset = routeset
            # context = context or @target or this

            @boundhandler = {}

            (@boundhandler[ev] = handler.bind(context)) for own ev, handler of routeset when typeof handler is 'function'

        on: ->
            return if @started

            @target.on(ev, handler) for own ev, handler of @boundhandler

            @started = true

        off: -> 
            @target.off(ev, handler) for own ev, handler of @boundhandler

            @started = false

    class EventRouter
        constructor: (root) ->
            @root = root
            @routers = []

        on: (target, routeset) ->
            router = new StandAloneRouter(target, routeset)
            @routers.push router
            router.on()

        off: (target, routeset) ->
            idxs = (i for router, i in @routers when target is router.target and ((not routeset) or (routeset is router.routeset)))
            for idx in idxs.reverse()
                @routers.splice(idx, 1)[0].off()

        all: ->
            (router for router in @routers)








    class StandAloneRouter
        constructor : (target, routeset, context) ->
            @started = false;

            @target = target if target
            @routeset = routeset
            context = context or @target or this

            @boundhandler = {}

            (@boundhandler[ev] = handler.bind(context)) for own ev, handler of routeset when typeof handler is 'function'

        on: ->
            return if @started

            @target.on(ev, handler) for own ev, handler of @boundhandler

            @started = true

        off: -> 
            @target.off(ev, handler) for own ev, handler of @boundhandler

            @started = false

    class EventRouter
        constructor: ->
            @routes = []

        on: (target, routeset, context) ->
            route = new StandAloneRouter(target, routeset, context)
            @routes.push route
            route.on()

        off: (target, routeset) ->
            idxs = (i for route, i in @routes when target is route.target and ((not routeset) or (routeset is route.routeset)))
            for idx in idxs.reverse()
                @routes.splice(idx, 1)[0].off()

        all: ->
            (route for route in @routes)

        despose: ->
            route.off() for route in @routes
            @routes = []

        @StandAlone: StandAloneRouter
