# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    containable_init = ->
        # For Instance
        @components = []

    add = (comp) ->
        return add.call(this, [comp]) if not (comp instanceof Array)
        @components.push(i) for i in comp if @components.indexOf(comp) is -1
        this

    remove = (comp) ->
        return remove.call(this, [comp]) if not (comp instanceof Array)
        for i in comp
            idx = @components.indexOf i
            @components.splice(idx, 1) if idx > -1
        this

    select = (selector) ->
        clone = [];

        (clone.push i) for i in @components if selector is undefined

        return clone

    ->
        # For Class
        dou.mixin this, [dou.with.advice, dou.with.lifecycle]

        @after 'initialize', containable_init

        @add = add
        @remove = remove
        @select = select