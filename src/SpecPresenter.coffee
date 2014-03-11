# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS', './SpecInfographic', './SpecContentViewLayer', './SpecGroup', './SpecRect'
], (kin, SpecInfographic, SpecContentViewLayer, SpecGroup, SpecRect) ->
    
    "use strict"

    createView = (attributes) ->
        return new kin.Stage(attributes)

    controller =
        # 'presenter-app':

    {
        type: 'presenter-app'
        name: 'presenter-app'
        containable: true
        container_type: 'application'
        description: 'Presenter Application Specification'
        defaults: {
        }
        controller: controller
        view_factory_fn: createView
        dependencies: {
          'infographic' : SpecInfographic
          'content-view-layer' : SpecContentViewLayer
          'group' : SpecGroup
          'rect' : SpecRect
        }
        components : [{
            type: 'content-view-layer'
            attrs: {}
        }]
        toolbox_image: 'images/toolbox_presenter_app.png'
    }
