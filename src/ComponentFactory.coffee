# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './Component'
], (dou, Component) ->
    
    "use strict"

    class ComponentFactory
        setComponentRegistry : (componentRegistry) ->
            @componentRegistry = componentRegistry

        getComponentRegistry : ->
            @componentRegistry

        createShape : (component) ->
            type = component.type
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            spec.shape_factory.createShape component.attrs

        createComponent : (type, attributes) ->
            spec = @componentRegistry.get type
            throw new Error "Component Spec Not Found for type '#{type}'" if !spec
            component = new Component(type)
            component.initialize(dou.util.merge(attributes, spec.defaults));

    ComponentFactory
