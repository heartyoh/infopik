# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class ComponentSpec
        constructor : (config) ->
            @urn = config.urn
            @name = config.name
            @description = config.description
            @defaults = config.defaults
            @shape_factory = config.shape_factory
            @handle_factory = config.handle_factory
            @toolbox_image = config.toolbox_image
