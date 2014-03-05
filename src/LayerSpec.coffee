# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class LayerSpec
        constructor : (config) ->
            @urn = config.urn
            @name = config.name
            @description = config.description
            @defaults = config.defaults
            @layer_factory = config.layer_factory
