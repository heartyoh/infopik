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

    match_by_id = (selector, component, listener, root) ->
        (selector.substr(1)) is component.get('id')

    match_by_name = (selector, component, listener, root) ->
        (selector.substr(1)) is component.get('name')

    match_by_special = (selector, component, listener, root) ->
        switch(selector)
            when '(all)' then true
            when '(self)' 
                console.log('listener', listener) 
                console.log('component', component)
                return listener is component
            when '(root)' then root is component
            else false

    match_by_type = (selector, component, listener, root) ->
        (selector is 'all') or (selector is component.type)

    match = (selector, component, listener, root) ->
        switch selector.charAt(0)
            when '#' then match_by_id(selector, component, listener, root)
            when '.' then match_by_name(selector, component, listener, root)
            when '(' then match_by_special(selector, component, listener, root)
            else match_by_type(selector, component, listener, root)

    select_recurse = (matcher, selector, component, listener, root, result) ->
        result.push component if matcher(selector, component, listener, root)
        if component instanceof Container
            component.forEach (child) ->
                select_recurse matcher, selector, child, listener, root, result

        result

    select = (selector, component, listener) ->
        return [component] if selector is '(root)'
        return [listener] if selector is '(self)'
        
        matcher = switch selector.charAt(0)
            when '#' then match_by_id
            when '.' then match_by_name
            when '(' then match_by_special
            else match_by_type
        return select_recurse matcher, selector, component, listener, component, []

    {
        select: select
        match: match
    }
