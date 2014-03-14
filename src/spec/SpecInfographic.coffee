# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
], (dou, kin) ->
    
    "use strict"

    createView = (attributes) ->
        new kin.Group(attributes);

    createHandle = (attributes) ->
        return new Kin.Group(attributes)

    {
        type: 'infographic'
        name: 'infographic'
        containable: true
        container_type: 'container'
        description: 'Infographic Specification'
        defaults: {
            draggable: false
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_infographic.png'
    }
