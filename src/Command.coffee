# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class Command
        constructor : (params) ->
            @params = params #dou.util.clone(params)
            
        execute: ->
        unexecute: ->

    Command