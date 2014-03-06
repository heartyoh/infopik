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

    add_component = (container, component) ->
        len = container.__components__.push component
        e = {
            container: container
            component: component
            index: len - 1
        }

        container.trigger 'add', e

        return if not (component instanceof Component)

        component.delegate_on container

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
        
        component.delegate_off container

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

    class Container extends Component
        constructor : (type) ->
        	super(type)

        add: add
        remove: remove
        select: select

    dou.mixin Container, [dou.with.advice, dou.with.lifecycle]