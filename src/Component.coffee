# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class Component
        constructor : (type) ->
            @type = type
            @__views__ = []

        attach : (view) ->
            @__views__.push view

        detach : (view) ->
            index = @__views__.indexOf(view)
            @__views__.splice(index, 1) if index > -1

        attaches : ->
            @__views__

    dou.mixin Component, [
        dou.with.advice
        dou.with.event
        dou.with.property
        dou.with.lifecycle
        dou.with.serialize
    ]
