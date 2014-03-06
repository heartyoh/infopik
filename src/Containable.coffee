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

    propagation_fn = ->
        this.delegate.apply this, arguments

    add_component = (container, component) ->
        len = container.__components__.push component
        e = {
            container: container
            component: component
            index: len - 1
        }

        container.trigger 'add', e

        return if not (component instanceof Component)

        component.on 'all', propagation_fn, container

        component.trigger 'added', e

    remove_component = (container, component) ->
        idx = container.__components__.indexOf component
        return if idx is -1

        container.__components__.splice(idx, 1) if idx > -1

        e = {
            container: container
            component: component
        }

        container.trigger 'remove', e

        return if not (component instanceof Component)

        component.trigger 'removed', e
        
        component.off 'all', propagation_fn

    add = (comp) ->
        @__components__ || @__components__ = []

        return add.call(this, [comp]) if not (comp instanceof Array)
        add_component(this, i) for i in comp if @__components__.indexOf(i) is -1
        
        this

    remove = (comp) ->
        return remove.call(this, [comp]) if not (comp instanceof Array)

        return if not @__components__

        for i in comp
            remove_component this, i

        this

    select = (selector) ->
        return if not @__components__

        clone = [];

        (clone.push i) for i in @__components__ if selector is undefined

        return clone

    ->
        # For Class
        dou.mixin this, [dou.with.advice, dou.with.lifecycle]

        @add = add
        @remove = remove
        @select = select