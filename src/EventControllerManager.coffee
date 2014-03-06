# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'src/EventController'
], (dou, EventController) ->
    
    "use strict"

    select = (selector, target) ->
        return selector is target.type

    control = (controller, event, target, others...)->
        handler_map = controller.getHandlerMap()

        for own selector, map of handler_map
            if select selector, target
                for own ev, handler of map when ev is event
                    (handler.apply controller, others.unshift(target))

    event_handler_fn = ->
        args = arguments
        this.forEach (controller) ->
            control controller, args
        , this

    class EventControllerManager
        setContainer: (container) ->
            @container = container

        # add: (controller) ->
        #     return add.call(this, [contoller]) if not (contoller instanceof Array)
        #     (@contollers.push i) for i in contoller if @controllers.indexOf(i) is -1
            
        #     this

        # remove: (controller) ->
        #     return remove.call(this, [controller]) if not (controller instanceof Array)

        #     for i in controller
        #         idx = @controllers.indexOf i
        #         continue if idx is -1

        #         @controllers.splice(idx, 1) if idx > -1

        #     this

        # removeAll: ->
        #     @controllers = []

        start: ->
            @container.on 'all', event_handler_fn, this

        stop: ->
            @container.off 'all', event_handler_fn

        despose: ->
            @stop()
            @controllers = []
            @container = null

    dou.mixin EventControllerManager, dou.with.collection.withList

    EventControllerManager
