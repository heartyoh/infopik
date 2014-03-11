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
        infographic = new kin.Group(attributes);
        infographic.add new kin.Rect(dou.util.merge(attributes, {draggable: false, x: 0, y: 0}))
        infographic

    createHandle = (attributes) ->
        return new Kin.Group(attributes)

    {
        type: 'infographic'
        name: 'infographic'
        containable: true
        container_type: 'container'
        description: 'Infographic Specification'
        defaults: {
            width: 100
            height: 50
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_infographic.png'
    }
