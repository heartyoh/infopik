# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './utils'
    './compose'
    './advice'
    './base'
], (utils, compose, advice, base) ->
    
    "use strict"

    actionSymbols = {on: '<-', trigger: '->', off: 'x '}

    elemToString = (elem) ->
        tagStr = if elem.tagName then elem.tagName.toLowerCase() else elem.toString()
        classStr = if elem.className then '.' + (elem.className) else ''
        result = tagStr + classStr
        if elem.tagName then ['\'', '\''].join result else result

    log = (action, component, eventArgs) ->
        return if not window.DEBUG or not window.DEBUG.enabled

        name = eventType = elem = fn = payload = logFilter = toRegExp = actionLoggable = nameLoggable = info = null

        if typeof eventArgs[eventArgs.length - 1] is 'function'
            fn = eventArgs.pop()
            fn = fn.unbound or fn  # use unbound version if any (better info)

        if eventArgs.length is 1
            elem = component.$node[0]
            eventType = eventArgs[0]
        else if ((eventArgs.length == 2) && typeof eventArgs[1] == 'object' && !eventArgs[1].type)
            # 2 args, first arg is not elem
            elem = component.$node[0]
            eventType = eventArgs[0]
            if action == "trigger"
                payload = eventArgs[1]
        else
            # 2+ args, first arg is elem
            elem = eventArgs[0]
            eventType = eventArgs[1]
            if action == "trigger"
                payload = eventArgs[2]

        name = if typeof eventType == 'object' then eventType.type else eventType

        logFilter = DEBUG.events.logFilter

        # no regex for you, actions...
        actionLoggable = logFilter.actions == 'all' || (logFilter.actions.indexOf(action) > -1)
        # event name filter allow wildcards or regex...
        toRegExp = (expr) ->
            if expr.test then expr else new RegExp('^' + expr.replace(/\*/g, '.*') + '$')

        nameLoggable =
            logFilter.eventNames == 'all' ||
            logFilter.eventNames.some (e) -> toRegExp(e).test(name)

        if actionLoggable && nameLoggable
            info = [actionSymbols[action], action, '[' + name + ']']
            payload && info.push(payload)
            info.push(elemToString(elem))
            info.push(component.constructor.describe.split(' ').slice(0, 3).join(' '))
            console.info.apply(console, info)

    ->
        # plugin dependencies
        compose.mixin this, [advice.withAdvice, base]

        this.before 'trigger', -> log 'trigger', this, utils.toArray arguments
        this.before 'on', -> log 'on', this, utils.toArray arguments
        this.before 'off', -> log 'off', this, utils.toArray arguments
