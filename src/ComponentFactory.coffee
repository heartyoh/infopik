# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './Component'
    './Container'
    './EventTracker'
    './EventPump'
], (dou, Component, Container, EventTracker, EventPump) ->
    
    "use strict"

    class ComponentFactory
        constructor: (componentRegistry, eventTracker, eventPump)->
            @componentRegistry = componentRegistry
            @eventTracker = eventTracker
            @eventPump = eventPump
            @seed = 1

        despose: ->
            @componentRegistry = null
            @eventPump.despose() if @eventPump # TO BE REMOVED

        uniqueId: ->
            "noid-#{@seed++}"

        createView : (component, context) ->
            type = component.type
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            view = spec.view_factory_fn.call context, component.getAll()

            if component instanceof Container
                component.forEach (child) ->
                    view.add this.createView child, context
                , this

            # EventTracker off 시점을 고민해야한다. 혹은 .. StandAlone을 사용하는 것 고려.
            @eventTracker.on(view, spec.view_listener, context) if spec.view_listener
                
            view

        createComponent : (obj, context) ->
            spec = @componentRegistry.get obj.type
            throw new Error "Component Spec Not Found for type '#{obj.type}'" if !spec
            
            if spec.containable
                component = new Container(obj.type)

                if spec.components
                    component.add(@createComponent(child, context)) for child in spec.components

                if obj.components
                    component.add(@createComponent(child, context)) for child in obj.components
            else
                component = new Component(obj.type)

            component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));

            component.set('id', @uniqueId()) if not component.get('id')

            # EventTracker off 시점을 고민해야한다. 혹은 .. StandAlone을 사용하는 것 고려.
            # @eventTracker.on(component, spec.component_listener, context) if spec.component_listener

            if spec.component_listener
                eventPump = new EventPump(component)
                eventPump.on(component, spec.component_listener)
                component.eventPump = eventPump
                eventPump.start(context)

            @eventPump.on(component, spec.controller) if spec.controller

            component

    ComponentFactory
