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
        constructor : ->

        draw : (ctx) ->

    dou.mixin Component, [
        dou.with.advice
        dou.with.event
        dou.with.property
        dou.with.lifecycle
        dou.with.serialize
    ]
