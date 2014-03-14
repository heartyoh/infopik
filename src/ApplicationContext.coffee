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
    './Command'
    './CommandManager'
    './ComponentRegistry'
    './ComponentSelector'
    './SelectionManager'
    './ComponentSpec'
], (dou
    kin
    Component
    Container
    EventController
    EventTracker
    ComponentFactory
    Command
    CommandManager
    ComponentRegistry
    ComponentSelector
    SelectionManager
    ComponentSpec
) ->
    
    "use strict"

    class ApplicationContext
        constructor : (options) ->
            {@application_spec, container} = options

            # container option : html container of this application
            if typeof container isnt 'string'
                throw new Error('container is a mandatory string type option.')
            if not @application_spec
                throw new Error('application_spec is a mandatory option')

            @commandManager = new CommandManager()

            @selectionManager = new SelectionManager({
                onselectionchange: @onselectionchange
                context: this
            })

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
                container: options.container
                width: options.width
                height: options.height

            # First. create root container and view
            @application = @componentFactory.createComponent({
                type: @application_spec.type
                attrs: attributes
            }, this)

            @view = @componentFactory.createView(@application, this)

            # Second. attach event handlers to root container
            @eventController.setTarget @application
            @eventController.start this

            @application.on 'add', @onadd, this
            @application.on 'remove', @onremove, this

            # Third. add layers to root container
            if @application_spec.layers
                (@application.add @componentFactory.createComponent(component, this)) for component in @application_spec.layers

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

        createComponent: (obj) ->
            @componentFactory.createComponent(obj, this)

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

        onselectionchange: (changes) ->
            @application.trigger 'change-selections', changes.after, changes.before, changes.added, changes.removed

    ApplicationContext