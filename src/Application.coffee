# Application의 특징
# Root Container 모델 + Canvas Base View + EventControlling + 커맨드 관
# 1. Root Model을 연결
# 2. Attach된 View(Canvas)를 생성 및 제공
# 3. EventController를 생성 및 제공
# 4. View의 이벤트 핸들링
# 5. Model의 변화를 View에 직접 반영 (생성, 삭제, 속성 변경) - 커맨드를 통해서
# 6. View의 이벤트를 모델에 반영 - 커맨드를 통해서
# 7. 커맨드 관리자 처리

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
    './ComponentFactory'
    './CommandManager'
    './ComponentRegistry'
    './ComponentSelector'
], (dou, 
    kin, 
    Component, 
    Container, 
    EventController, 
    ComponentFactory, 
    CommandManager, 
    ComponentRegistry,
    ComponentSelector
) ->
    
    "use strict"

    class Application
        constructor : (options) ->
            {@application_spec, @html_container} = options

            if typeof(@html_container) isnt 'string'
                throw new Error('html_container should be a string.')

            @componentFactory = new ComponentFactory()
            @commandManager = new CommandManager()

            componentRegistry = new ComponentRegistry()
            @componentFactory.setComponentRegistry componentRegistry

            registerSpec = (spec) ->
                componentRegistry.register spec
                if spec.dependencies
                    (registerSpec depspec) for name, depspec of spec.dependencies

            registerSpec @application_spec

            # application spec의 정보를 이용해서 ComponentFactory에 종속된 ComponentSpec을 등록한다.

            # ComponentFactory로부터 Control정보를 가져와서 EventController에 추가한다.
            @controller = new EventController()
            componentRegistry.forEach (name, spec) ->
                @controller.append spec.controller if spec.controller
            , this

            # Root 컨테이너를 만든다.
            # application spec의 정보를 이용해서 Layer들을 추가한다. - 이 것은 각 application에서 처리하도록 한다.

            attributes =
                id: 'application'
                container: @html_container
                width: 578 # TODO should be passed as a option
                height: 200


            @container = @componentFactory.createComponent(@application_spec.type, attributes)
            @view = @componentFactory.createView(@container)

            @container.on 'add', @onadd, this
            @container.on 'remove', @onremove, this

            @controller.setTarget @container
            @controller.start this

            if @application_spec.layers
                (@container.add @componentFactory.createComponent(layer, attrs)) for layer, attrs of @application_spec.layers


        getView: ->
            @view

        getModel: ->
            @model

        setModel: (model) ->
            before = @model
            @model = model
            @container.trigger 'change-model', @model, before

        getController: ->
            @controller

        getContainer: ->
            @container

        findComponent: (selector) ->
            ComponentSelector.select selector, @container

        findView: (selector) ->
            @view.find selector

        createView: (component) ->
            @componentFactory.createView()

        createComponent: (type, attrs) ->
            @componentFactory.createComponent(type, attrs);

        onadd: (container, component, index, e) ->
            vcontainer = if container is @container then @view else @view.find("\##{container.get('id')}");
            vcomponent = @componentFactory.createView(component);

            vcontainer.add(vcomponent);

            @view.draw()

        onremove: (container, component, e) ->


    Application