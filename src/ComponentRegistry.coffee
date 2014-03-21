# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (
    dou
) ->
    
    "use strict"

    class ComponentRegistry
        constructor : ->
            @componentSpecs = {}

        despose : ->
            keys = Object.keys(@componentSpecs)
            @unregister(type) for type in keys

        setRegisterCallback : (callback, context) ->
            @callback_register = if typeof(callback) is 'function' then callback.bind(context) else undefined

        setUnregisterCallback : (callback, context) ->
            @callback_unregister = if typeof(callback) is 'function' then callback.bind(context) else undefined

        # Register application dependent ComponentSpecs recursively
        register : (componentSpec) ->
            return if @componentSpecs[componentSpec.type]

            if componentSpec.dependencies
                (this.register depspec) for name, depspec of componentSpec.dependencies

            @componentSpecs[componentSpec.type] = componentSpec
            @callback_register(componentSpec) if @callback_register
            
        unregister : (type) ->
            # TODO consider dependencies
            spec = @componentSpecs[type]
            return if not spec

            delete @componentSpecs[type]
            @callback_unregister(spec) if @callback_unregister

            spec

        forEach : (fn, context) ->
            for own name, spec of @componentSpecs
                fn.call context, name, spec

        list : (filter) ->
            Object.keys(@componentSpecs).map (key) ->
                @componentSpecs[key]
            , this

        get : (type) ->
            spec = @componentSpecs[type]
            return if spec then dou.util.clone(@componentSpecs[type]) else null


