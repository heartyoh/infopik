# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    class Layer
        constructor: ->
            @layer = new kin.Layer()
            
        setContainer: (container) ->
            @container = container

        getContainer: ->
            @container

    Layer