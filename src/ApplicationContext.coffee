# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
    './MVCMixin'
    './Component'
    './Container'
    './EventEngine'
    './EventTracker'
    './ComponentFactory'
    './Command'
    './CommandManager'
    './command/CommandPropertyChange'
    './ComponentRegistry'
    './ComponentSelector'
    './SelectionManager'
    './Clipboard'
    './ComponentSpec'
    './spec/SpecPainter'
    './spec/SpecPresenter'
    './spec/SpecInfographic'
    './command/CommandMove'
], (dou
    kin
    MVCMixin
    Component
    Container
    EventEngine
    EventTracker
    ComponentFactory
    Command
    CommandManager
    CommandPropertyChange
    ComponentRegistry
    ComponentSelector
    SelectionManager
    Clipboard
    ComponentSpec
    SpecPainter
    SpecPresenter
    SpecInfographic
    CommandMove
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
                selectable_fn: (item) -> item.getAttr('id')
            })

            @compEventTracker = new EventTracker()
            @viewEventTracker = new EventTracker()

            @eventEngine = new EventEngine()

            @componentRegistry = new ComponentRegistry()

            @componentRegistry.setRegisterCallback (spec) ->
                ;
                # @eventEngine.append spec.controller if spec.controller
            , this
            @componentRegistry.setUnregisterCallback (spec) ->
                ;
                # @eventEngine.remove spec.controller if spec.controller
            , this

            @componentFactory = new ComponentFactory(@componentRegistry, @eventEngine, @viewEventTracker)

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

            @eventEngine.setRoot @application

            rootView = @view
            rootComponent = @application

            @compEventTracker.setSelector
                select: (selector, listener) ->
                    ComponentSelector.select(selector, rootComponent, listener)

            @viewEventTracker.setSelector
                select: (selector, listener) ->
                    return listener if selector is '(self)'
                    return rootView if selector is '(root)'

                    comps = ComponentSelector.select(selector, rootComponent)

                    views = []
                    for comp in comps
                        views.push view for view in comp.getViews()

                    views

            @application.on 'add', @onadd, this
            @application.on 'remove', @onremove, this

            # Third. add layers to root container
            if @application_spec.layers
                (@application.add @componentFactory.createComponent(component, this)) for component in @application_spec.layers

        dispose: ->
            @application.dispose()
            @compEventTracker.dispose()
            @componentFactory.dispose()

        getEventTracker: ->
            @compEventTracker

        getView: ->
            @view

        # TODO Clarify Model concept
        getModel: ->
            @model

        setModel: (model) ->
            return if model is @model

            @commandManager.reset()
            @selectionManager.reset()

            before = @model
            @model = model
            @application.trigger 'change-model', @model, before

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
            @view.batchDraw()

        execute: (command) ->
            @commandManager.execute command

        setSize: (width, height) ->
            before = @view.getSize()
            @view.setSize
                width: width
                height: height
            @view.fire 'resize',
                before: before
                after :
                    width: width
                    height: height

        onadd: (container, component, index, e) ->
            vcontainer = if container is @application then @view else this.findViewByComponent container
            vcomponent = this.createView(component);

            vcontainer.add(vcomponent);

            this.drawView()

        onremove: (container, component, e) ->
            # console.log 'removed', container, component
            # vcontainer = if container is @application then @view else this.findViewByComponent container
            vcomponent = this.findViewByComponent component

            # console.log 'found-component', vcomponent
            # vcontainer.remove(vcomponent);
            vcomponent.destroy()

            this.drawView()

        onselectionchange: (changes) ->
            @application.trigger 'change-selections', changes.after, changes.before, changes.added, changes.removed

        redo: ->
            @commandManager.redo()

        undo: ->
            @commandManager.undo()

        setScale: (scale) ->
            @getView().scale
                x : scale
                y : scale

            @drawView()

        scaleEnlarge: ->
            scale = @getView().scaleX()

            @setScale (if (scale + 1 > 8) then 8 else scale + 1)

        scaleReduce: ->
            scale = @getView().scaleX()

            @setScale (if (scale - 1 < 1) then 1 else scale - 1)

    dou.mixin ApplicationContext, MVCMixin.controller

    ApplicationContext
