# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
], ->
    
    "use strict"

    class ComponentController
        constructor: (handler_map)->
            @handler_map = handler_map

        getHandlerMap: ->
            @handler_map

    ComponentController
