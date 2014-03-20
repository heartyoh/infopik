# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './MVCMixin'
    './Component'
    './Container'
    './EventEngine'
    './EventTracker'
], (
    dou
    MVCMixin
    Component
    Container
    EventEngine
    EventTracker
) ->
    
    "use strict"

    class ComponentFactory
        constructor: (componentRegistry, eventEngine, eventTracker)->
            @componentRegistry = componentRegistry
            @eventEngine = eventEngine
            @eventTracker = eventTracker
            @seed = 1

        despose: ->
            @componentRegistry = null
            @eventEngine.despose() if @eventEngine

        uniqueId: ->
            "noid-#{@seed++}"

        createView : (component, controller) ->
            type = component.type
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            view = spec.view_factory_fn.call controller, component.getAll()

            controller.attach component, view

            if component instanceof Container
                component.forEach (child) ->
                    view.add this.createView child, controller
                , this

            if spec.view_listener

                for own selector, handlers of spec.view_listener

                    if selector.indexOf('?') == 0
                        variable = selector.substr(1)
                        selector = component.get(variable)

                        if selector is undefined
                            console.log("ComponentFactory#crateView", "variable #{selector} is not evaluated on listener")
                            continue

                    @eventTracker.on selector, handlers, view, controller
                
            view

        createComponent : (obj, controller) ->
            spec = @componentRegistry.get obj.type
            throw new Error "Component Spec Not Found for type '#{obj.type}'" if !spec
            
            if spec.containable
                component = new Container(obj.type)

                if spec.components
                    component.add(@createComponent(child, controller)) for child in spec.components

                if obj.components
                    component.add(@createComponent(child, controller)) for child in obj.components
            else
                component = new Component(obj.type)

            component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));

            component.set('id', @uniqueId()) if not component.get('id')

            @eventEngine.add(component, spec.controller, controller) if spec.controller

            component

    ComponentFactory
