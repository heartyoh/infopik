# Layer의 특징
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
], (dou, kin, Component, Container, EventController) ->
    
    "use strict"

    onadd = (i, e) ->
        container = i.container
        component = i.component

        vcontainer = if container is @model then @view else @view.find("\##{container.get('id')}");
        vcomponent = @componentFactory.createView(component);

        vcontainer.add(vcomponent);

        @view.draw()

    onremove = (i, e) ->
        i.container
        i.component
        e.target

    container_controller =
        'all' :
            'add' : onadd
            'remove' : onremove

    class ComponentBaseLayer
        constructor : (options) ->
            {@commandManager, @componentFactory} = options

            attributes =
                id: 'root'
                # width: 300
                # height:200

            @model = new Container('root')
            @model.initialize attributes

            @view = new kin.Layer attributes

            @controller = new EventController()

            @controller.append container_controller
            @controller.setTarget @model
            @controller.start this

        getView: ->
            @view

        getModel: ->
            @model

        getController: ->
            @controller

    ComponentBaseLayer