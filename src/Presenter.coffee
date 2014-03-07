# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './Container'
], (Container) ->
    
    "use strict"

    EDIT_MODE =
        SELECT: 1
        CREATE: 2

    # container_controller =
    #     'all' :
    #         'add' : onadd
    #         'remove' : onremove

    class Presenter extends Container
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

        defaults :
            edit_mode: EDIT_MODE.SELECT
            width: 600
            height: 800

    Presenter.EDIT_MODE = EDIT_MODE

    Presenter