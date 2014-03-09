# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS', './SpecContentLayer', './SpecGroup', './SpecRect'
], (kin, SpecContentLayer, SpecGroup, SpecRect) ->
    
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
        description: 'Presenter Application Specification'
        defaults: {
        }
        controller: controller
        view_factory_fn: createView
        dependencies: {
          'content-layer' : SpecContentLayer
          'group' : SpecGroup
          'rect' : SpecRect
        }
        layers : {
          'content-layer' : {}
        }
        toolbox_image: 'images/toolbox_painter_app.png'
    }
