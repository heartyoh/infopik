# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './advice'
    './utils'
    './compose'
    './base'
    './registry'
    './logger'
    './debug'
], (advice, utils, compose, withBase, registry, withLogging, debug) ->
    
    "use strict"

    functionNameRegEx = /function (.*?)\s?\(/

    # teardown for all instances of this constructor
    teardownAll = ->
        componentInfo = registry.findComponentInfo(this)

        componentInfo && for k, info of componentInfo.instances
            info.instance.teardown() if info && info.instance

    checkSerializable = (type, data) ->
        try
            window.postMessage(data, '*')
        catch e
            console.log('unserializable data for event', type, ':', data)
            throw new Error ['The event', type, 'on component', this.toString(), 'was triggered with non-serializable data'].join(' ')

    attachTo = (selector) ->
        l = arguments.length
        args = new Array(l - 1)
        args[i - 1] = arguments[i] for i in [1..l - 1]

        throw new Error('Component needs to be attachTo\'d a jQuery object, native node or selector string') if !selector

        options = utils.merge.apply(utils, args)
        componentInfo = registry.findComponentInfo(this)

        $(selector).each ((i, node) ->
            return if componentInfo && componentInfo.isAttachedTo(node)

            (new this).initialize(node, options)
        ).bind(this)


    # define the constructor for a custom component type
    # takes an unlimited number of mixin functions as arguments
    # typical api call with 3 mixins: define(timeline, withTweetCapability, withScrollCapability);
    define = ->
        mixins = []
        mixins.push(arg) for arg in arguments

        class Component
            toString: ->
                mixins.map((mixin) ->
                    if mixin.name is null
                        m = mixin.toString().match(functionNameRegEx)
                        return (if m && m[1] then m[1] else '')
                    else
                        return (if mixin.name isnt 'withBase' then mixin.name else '')
                ).filter(Boolean).join(', ')

            describe: ->
                this.toString()

        # Static methods
        Component.attachTo = attachTo
        Component.teardownAll = teardownAll

        mixins.unshift(withLogging) if debug.enabled
        mixins.unshift(withBase, advice.withAdvice, registry.withRegistration)

        compose.mixin(Component.prototype, mixins)

        Component

    define.teardownAll = ->
        registry.components.slice().forEach (c) ->
            c.component.teardownAll();
        registry.reset()

    define