# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './Command'
], (Command) ->
    
    "use strict"

    class CommandManager
        constructor : (params) ->
            this.reset()

        despose : ->
            this.reset()

        execute: (command) ->
            return if not command instanceof Command

            command.execute()

            @exq.push command
            @uxq = []

        undo: ->
            command = @exq.pop()

            if command
                command.unexecute()
                @uxq.push command

        redo: ->
            command = @uxq.pop()

            if command
                command.execute()
                @exq.push command
    
        undoable: ->
            @exq.length > 0

        redoable: ->
            @uxq.length > 0

        reset: ->
            @exq = []
            @uxq = []

    CommandManager