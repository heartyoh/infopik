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

    match_by_id = (selector, component) ->
        (selector.substr(1)) is component.get('id')

    match_by_name = (selector, component) ->
        (selector.substr(1)) is component.get('name')

    match_by_type = (selector, component) ->
        (selector is 'all') or (selector is component.type)

    match = (selector, component) ->
        switch selector.charAt(0)
            when '#' then match_by_id(selector, component)
            when '.' then match_by_name(selector, component)
            else match_by_type(selector, component)

    select_recurse = (matcher, selector, component, result) ->
        result.push component if matcher(selector, component)
        if component instanceof Container
            component.forEach (child) ->
                select_recurse matcher, selector, child, result

        result

    select = (selector, component) ->
        matcher = switch selector.charAt(0)
            when '#' then match_by_id
            when '.' then match_by_name
            else match_by_type
        return select_recurse matcher, selector, component, []

    {
        select: select
        match: match
    }
