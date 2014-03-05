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
        setComponentRegistry : (componentRegistry) ->
            @componentRegistry = componentRegistry

        getComponentRegistry : ->
            @componentRegistry

        createView : (component) ->
            type = component.type
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            spec.view_factory.createView component.attrs

        createComponent : (type, attributes) ->
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            
            if spec.containable
                component = new Container(type)
            else
                component = new Component(type)

            component.initialize(dou.util.merge(spec.defaults, attributes));

    ComponentFactory
