# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    '../Command'
], (dou, Command) ->
    
    "use strict"

    class CommandMove extends Command
        execute: ->
            to = @params.to
            model = @params.model
            view = @params.view

            @i_model = model.getContainer().indexOf(model)
            @i_view = view.getZIndex()

            switch to
                when 'FORWARD'
                    view.moveUp()
                    model.moveForward()
                when 'BACKWORD'
                    view.moveDown()
                    model.moveBackward()
                when 'FRONT'
                    view.moveToTop()
                    model.moveToFront()
                when 'BACK'
                    view.moveToBottom()
                    model.moveToBack()

            layer = view.getLayer()
            layer.draw() if layer

        unexecute: ->
            to = @params.to
            model = @params.model
            view = @params.view

            view.setZIndex(@i_view)
            model.moveAt(@i_model)

            layer = view.getLayer()
            layer.draw() if layer

