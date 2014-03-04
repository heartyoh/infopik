# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './utils'
    './registry'
    './debug'
], (utils, registry, debug) ->
    
    "use strict"

    # common mixin allocates basic functionality - used by all component prototypes
    # callback context is bound to component
    componentId = 0

    teardownInstance= (instanceInfo) ->
        instance = instanceInfo.instance

        for event in instanceInfo.events.slice()
            args = [event.type]
            event.element && args.unshift(event.element);

            (typeof event.callback == 'function') && args.push(event.callback)
            instance.off.apply(instance, args)

    checkSerializable= (type, data) ->
        try
            window.postMessage(data, '*')
        catch e
            console.log('unserializable data for event', type, ':', data)
            throw new Error(
                ['The event', type, 'on component', this.toString(), 'was triggered with non-serializable data'].join(' ')
            )
        
    proxyEventTo= (targetEvent) ->
        (e, data) -> $(e.target).trigger(targetEvent, data)

    ->
        # delegate trigger, bind and unbind to an element
        # if $element not supplied, use component's node
        # other arguments are passed on
        # event can be either a string specifying the type
        # of the event, or a hash specifying both the type
        # and a default function to be called.

        this.trigger = ->
            # var $element, type, data, event, defaultFn;
            lastIndex = arguments.length - 1
            lastArg = arguments[lastIndex]

            if (typeof lastArg != 'string' && !(lastArg && lastArg.defaultBehavior))
                lastIndex--
                data = lastArg

            if (lastIndex == 1)
                $element = $(arguments[0])
                event = arguments[1]
            else
                $element = this.$node
                event = arguments[0]

            if (event.defaultBehavior)
                defaultFn = event.defaultBehavior
                event = $.Event(event.type)

            type = event.type || event

            if (debug.enabled && window.postMessage)
                checkSerializable.call(this, type, data)

            if (typeof this.attr.eventData is 'object')
                data = $.extend(true, {}, this.attr.eventData, data)

            $element.trigger((event || type), data)

            if (defaultFn && !event.isDefaultPrevented())
                (this[defaultFn] || defaultFn).call(this)

            $element

        this.on = ->
            # var $element, type, callback, originalCb;
            lastIndex = arguments.length - 1
            origin = arguments[lastIndex]

            if (typeof origin == 'object')
                # delegate callback
                originalCb = utils.delegate(this.resolveDelegateRules(origin))
            else if (typeof origin == 'string')
                originalCb = proxyEventTo(origin)
            else
                originalCb = origin

            if (lastIndex == 2)
                $element = $(arguments[0])
                type = arguments[1]
            else
                $element = this.$node
                type = arguments[0]

            if (typeof originalCb != 'function' && typeof originalCb != 'object')
                throw new Error('Unable to bind to "' + type + '" because the given callback is not a function or an object')

            callback = originalCb.bind(this)
            callback.target = originalCb
            callback.context = this

            $element.on(type, callback)

            # store every bound version of the callback
            originalCb.bound || (originalCb.bound = [])
            originalCb.bound.push(callback)

            callback

        this.off = ->
            # var $element, type, callback;
            lastIndex = arguments.length - 1

            if (typeof arguments[lastIndex] == 'function')
                callback = arguments[lastIndex]
                lastIndex -= 1

            if (lastIndex == 1)
                $element = $(arguments[0])
                type = arguments[1]
            else
                $element = this.$node
                type = arguments[0]

            if (callback)
                # set callback to version bound against this instance
                callback.bound && callback.bound.some((fn, i, arr) ->
                    if (fn.context && (this.identity == fn.context.identity))
                        arr.splice(i, 1)
                        callback = fn
                        return true
                , this)

            $element.off(type, callback)

        this.resolveDelegateRules = (ruleInfo) ->
            rules = {}

            Object.keys(ruleInfo).forEach((r) ->
                if (!(r in this.attr))
                    throw new Error('Component "' + this.toString() + '" wants to listen on "' + r + '" but no such attribute was defined.')
                rules[this.attr[r]] = if (typeof ruleInfo[r] == 'string') then proxyEventTo(ruleInfo[r]) else ruleInfo[r]
            , this)

            rules

        this.defaultAttrs = (defaults) -> utils.push(this.defaults, defaults, true) || (this.defaults = defaults)

        this.select = (attributeKey) -> this.$node.find(this.attr[attributeKey])

        this.initialize = (node, attrs) ->
            attrs || (attrs = {})
            # only assign identity if there isn't one (initialize can be called multiple times)
            this.identity || (this.identity = componentId++)

            if (!node)
                throw new Error('Component needs a node')

            # if (node.jquery) {
                # this.node = node[0];
                # this.$node = node;
            # } else {
                this.node = node
                # this.$node = $(node);
            # }

            # merge defaults with supplied options
            # put options in attr.__proto__ to avoid merge overhead
            attr = Object.create(attrs)
            for own key of this.defaults
                if (!attrs.hasOwnProperty(key))
                    attr[key] = this.defaults[key]

            this.attr = attr

            for own key, val of this.defaults || {}
                if (val is null && this.attr[key] is null)
                    throw new Error('Required attribute "' + key + '" not specified in attachTo for component "' + this.toString() + '".')

            this

        this.teardown = -> teardownInstance(registry.findInstanceInfo(this))
