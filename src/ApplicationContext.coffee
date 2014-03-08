# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
    './Component'
    './Container'
    './EventController'
    './EventTracker'
    './ComponentFactory'
    './CommandManager'
    './ComponentRegistry'
    './ComponentSelector'
], (dou
    kin
    Component
    Container
    EventController
    EventTracker
    ComponentFactory
    CommandManager
    ComponentRegistry
    ComponentSelector
) ->
    
    "use strict"

    class ApplicationContext
        constructor : (options) ->
            {@application_spec, @html_container} = options

            if typeof(@html_container) isnt 'string'
                throw new Error('html_container should be a string.')

            @commandManager = new CommandManager()

            @eventTracker = new EventTracker()

            @eventController = new EventController()

            @componentRegistry = new ComponentRegistry()

            @componentRegistry.setRegisterCallback (spec) ->
                @eventController.append spec.controller if spec.controller
            , this
            @componentRegistry.setUnregisterCallback (spec) ->
                @eventController.remove spec.controller if spec.controller
            , this

            @componentFactory = new ComponentFactory(@componentRegistry, @eventTracker)

            @componentRegistry.register @application_spec

            # Create model and view
            # model - Root Container (Application)
            # view - Stage of KineticJS

            attributes =
                id: 'application'
                container: @html_container
                width: 578 # TODO should be passed as options
                height: 200

            @application = @componentFactory.createComponent(@application_spec.type, attributes, this)
            @view = @componentFactory.createView(@application, this)

            @eventController.setTarget @application
            @eventController.start this

            @application.on 'add', @onadd, this
            @application.on 'remove', @onremove, this

            # Add layers into the application along to application_spec

            if @application_spec.layers
                (@application.add @componentFactory.createComponent(layer, attrs, this)) for layer, attrs of @application_spec.layers

        despose: ->
            @eventTracker.despose()
            @eventController.despose()
            @eventRegistry.despose()
            @componentFactory.despose()

        getEventTracker: ->
            @eventTracker

        getView: ->
            @view

        # TODO Clarify Model concept
        getModel: ->
            @model

        setModel: (model) ->
            before = @model
            @model = model
            @application.trigger 'change-model', @model, before

        getController: ->
            @eventController

        getApplication: ->
            @application

        findComponent: (selector) ->
            ComponentSelector.select selector, @application

        findView: (selector) ->
            @view.find selector

        findViewByComponent: (component) ->
            @view.find "\##{component.get('id')}"

        createView: (component) ->
            @componentFactory.createView(component, this)

        createComponent: (type, attrs) ->
            @componentFactory.createComponent(type, attrs, this)

        drawView: ->
            @view.draw()

        execute: (command) ->
            @commandManager.execute command

        onadd: (container, component, index, e) ->
            vcontainer = if container is @application then @view else this.findViewByComponent container
            vcomponent = this.createView(component);

            vcontainer.add(vcomponent);

            this.drawView()

        onremove: (container, component, e) ->
            vcontainer = if container is @application then @view else this.findViewByComponent container
            vcomponent = this.findViewByComponent component

            vcontainer.remove(vcomponent);

            this.drawView()


    ApplicationContext