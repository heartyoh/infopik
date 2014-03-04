# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './compose'
    './advice'
], (compose, advice)->
    
    "use strict"

    parseEventArgs = (instance, args) ->
        end = args.length;

        callback = args[--end] if typeof(args[end - 1]) is 'function'
        --end if typeof(args[end - 1]) is 'object'
        if end is 2
            element = args[0]
            type = args[1]
        else
            element = instance.node;
            type = args[0]

        {
            element: element
            type: type
            callback: callback
        }

    matchEvent = (a, b) -> (a.element is b.element) and (a.type is b.type) and (!b.callback || a.callback is b.callback)

    class Registry
        constructor: ->
            registry = this;

            (this.reset = ->
                this.components = []
                this.allInstances = {}
                this.events = []
            ).call(this);

            class ComponentInfo
                constructor: (component) ->
                    this.component = component
                    this.attachedTo = []
                    this.instances = {}

                    this.addInstance = (instance) ->
                        instanceInfo = new InstanceInfo(instance)
                        this.instances[instance.identity] = instanceInfo
                        this.attachedTo.push(instance.node)

                        instanceInfo

                    this.removeInstance = (instance) ->
                        delete this.instances[instance.identity]
                        indexOfNode = this.attachedTo.indexOf(instance.node)
                        (indexOfNode > -1) && this.attachedTo.splice(indexOfNode, 1)

                        if !Object.keys(this.instances).length
                            registry.removeComponentInfo(this)

                    this.isAttachedTo = (node) ->
                        this.attachedTo.indexOf(node) > -1;

            class InstanceInfo
                constructor: (instance) ->
                    this.instance = instance
                    this.events = []

                    this.addBind = (event) ->
                        this.events.push(event)
                        registry.events.push(event)

                    this.removeBind = (event) ->
                        for e, i in this.events
                            this.events.splice(i, 1) if matchEvent(e, event)


            this.addInstance = (instance) ->
                component = this.findComponentInfo(instance)

                if !component
                    component = new ComponentInfo(instance.constructor)
                    this.components.push(component)

                inst = component.addInstance(instance)
                this.allInstances[instance.identity] = inst

                component

            this.removeInstance = (instance) ->
                instInfo = this.findInstanceInfo(instance)
                componentInfo = this.findComponentInfo(instance)
                componentInfo && componentInfo.removeInstance(instance)

                delete this.allInstances[instance.identity]

            this.removeComponentInfo = (componentInfo) ->
                index = this.components.indexOf(componentInfo)
                (index > -1) && this.components.splice(index, 1)

            this.findComponentInfo = (which) ->
                component = if which.attachTo then which else which.constructor

                for c in this.components
                    return c if c.component is component

                null

            this.findInstanceInfo = (instance) ->
                this.allInstances[instance.identity] || null

            this.getBoundEventNames = (instance) ->
                return this.findInstanceInfo(instance).events.map((ev) -> return ev.type)

            this.findInstanceInfoByNode = (node) ->
                result = []
                for own k, thisInstanceInfo of this.allInstances
                    result.push(thisInstanceInfo) if thisInstanceInfo.instance.node is node
                result

            this.on = (componentOn) ->
                instance = registry.findInstanceInfo(this)

                l = arguments.length
                otherArgs = new Array(l - 1)
                otherArgs[i - 1] = arguments[i] for i in [1..l - 1]

                if instance
                    boundCallback = componentOn.apply(null, otherArgs)
                    if (boundCallback)
                        otherArgs[otherArgs.length - 1] = boundCallback
                    event = parseEventArgs(this, otherArgs)
                    instance.addBind(event)


            this.off = ->
                event = parseEventArgs(this, arguments)
                instance = registry.findInstanceInfo(this)

                instance.removeBind(event) if instance

                registry.events.splice(i, 1) for e, i in registry.events when matchEvent(e, event)

            this.trigger = ->
            this.teardown = -> registry.removeInstance(this)
            this.withRegistration = ->
                compose.mixin this, [advice.withAdvice]

                this.after 'initialize', -> registry.addInstance(this)
                this.around 'on', registry.on
                this.after 'off', registry.off

                window.DEBUG && DEBUG.enabled && this.after('trigger', registry.trigger)
                this.after 'teardown', 
                    obj: registry
                    fnName: 'teardown'

    new Registry
