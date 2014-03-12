# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
    './SpecInfographic'
    './SpecContentEditLayer'
    './SpecGuideLayer'
    './SpecGroup'
    './SpecRect'
    './SpecRing'
], (
    kin
    SpecInfographic
    SpecContentEditLayer
    SpecGuideLayer
    SpecGroup
    SpecRect
    SpecRing
) ->
    
    "use strict"

    createView = (attributes) ->
        return new kin.Stage(attributes)

    controller =
        # 'painter-app':

    {
        type: 'painter-app'
        name: 'painter-app'
        containable: true
        container_type: 'application'
        description: 'Painter Application Specification'
        defaults: {
            # draggable: true
        }
        controller: controller
        view_factory_fn: createView
        dependencies: {
            'infographic' : SpecInfographic
            'content-edit-layer' : SpecContentEditLayer
            'guide-layer' : SpecGuideLayer
            'group' : SpecGroup
            'rect' : SpecRect
            'ring' : SpecRing
        }
        components : [{
            type: 'content-edit-layer'
            attrs: {}
        }, {
            type: 'guide-layer'
            attrs: {}
        }]
        toolbox_image: 'images/toolbox_painter_app.png'
    }
