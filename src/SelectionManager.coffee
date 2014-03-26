# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class SelectionManager
        constructor: (config) ->
            @onselectionchange = config.onselectionchange
            @context = config.context
            @selections = []
            @selectable_fn = config.selectable_fn

        dispose: ->
            @reset()

        focus: (target)->
            return @selections[0] if not target

            idx = @selections.indexOf(target)
            if idx > -1
                old_sels = dou.util.clone @selections

                @selections.splice(idx, 1)
                @selections.unshift(target)

                if @onselectionchange
                    @onselectionchange.call @context,
                        added : []
                        removed : []
                        before : old_sels
                        after : @selections
            else
                this.toggle(target)

        get: ->
            dou.util.clone @selections
    
        toggle: (target) ->

            return if not target

            old_sels = dou.util.clone(@selections)

            idx = @selections.indexOf(target)

            if(idx > -1)
                removed = @selections.splice(idx, 1)
            else
                added = [target]
                @selections.unshift(target)

            if @onselectionchange
                @onselectionchange.call @context,
                    added : added || []
                    removed : removed || []
                    before : old_sels
                    after : @selections

        select : (target) ->

            old_sels = dou.util.clone(@selections)
        
            if not (target instanceof Array)
                target = if not target then [] else [target]
            
            @selections = (item for item in target when (not @selectable_fn) or @selectable_fn(item))

            added = (item for item in @selections when old_sels.indexOf(item) is -1)
            removed = (item for item in old_sels when @selections.indexOf(item) is -1)

            if @onselectionchange && (added.length > 0 || removed.length > 0)
                @onselectionchange.call @context,
                    added : added
                    removed : removed
                    before : old_sels
                    after : @selections
        
        reset : ->
            old_sels = @selections
            @selections = []

            if old_sels.length > 0 and @onselectionchange
                @onselectionchange.call @context,
                    added : []
                    removed : old_sels
                    before : old_sels
                    after : @selections
