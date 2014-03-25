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
                when 'UP'
                    view.moveUp()
                    model.moveUp()
                when 'DOWN'
                    view.moveDown()
                    model.moveDown()
                when 'TOP'
                    view.moveToTop()
                    model.moveToTop()
                when 'BOTTOM'
                    view.moveToBottom()
                    model.moveToBottom()

            view.getLayer().draw()

        unexecute: ->
            to = @params.to
            model = @params.model
            view = @params.view

            switch to
                when 'UP'
                    view.moveDown()
                    model.moveDown()
                when 'DOWN'
                    view.moveUp()
                    model.moveUp()
                when 'TOP'
                    view.setZIndex(@i_view)
                    model.moveAt(@i_model)
                when 'BOTTOM'
                    view.setZIndex(@i_view)
                    model.moveAt(@i_model)

            view.getLayer().draw()

