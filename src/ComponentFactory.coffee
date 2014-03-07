# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './Component'
    './Container'
], (dou, Component, Container) ->
    
    "use strict"

    class ComponentFactory
        constructor: ->
            @seed = 1

        uniqueId: ->
            "noid-#{@seed++}"

        setComponentRegistry : (componentRegistry) ->
            @componentRegistry = componentRegistry

        getComponentRegistry : ->
            @componentRegistry

        createView : (component) ->
            type = component.type
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            view = spec.view_factory_fn component.getAll()

            if component instanceof Container
                component.forEach (child) ->
                    view.add this.createView child
                , this

            view

        createComponent : (type, attributes) ->
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            
            if spec.containable
                component = new Container(type)
            else
                component = new Component(type)

            component.initialize(dou.util.shallow_merge(spec.defaults || {}, attributes || {}));

            component.set('id', @uniqueId()) if not component.get('id')

            component

    ComponentFactory
