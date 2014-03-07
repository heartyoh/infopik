# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class ComponentRegistry
        constructor : ->
            @componentSpecs = {}

        register : (componentSpec) ->
            @componentSpecs[componentSpec.type] = componentSpec

        unregister : (type) ->
            @componentSpecs

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


