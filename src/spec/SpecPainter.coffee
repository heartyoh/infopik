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
    './SpecRulerLayer'
    './SpecHandleLayer'
    './SpecGroup'
    './SpecRect'
    './SpecRing'
    './SpecRuler'
    './SpecImage'
    './SpecText'
    './SpecStar'
    './SpecBarcode'
    '../handle/HandleChecker'
], (
    kin
    SpecInfographic
    SpecContentEditLayer
    SpecGuideLayer
    SpecRulerLayer
    SpecHandleLayer
    SpecGroup
    SpecRect
    SpecRing
    SpecRuler
    SpecImage
    SpecText
    SpecStar
    SpecBarcode
    HandleChecker
) ->
    
    "use strict"

    createView = (attributes) ->
        new kin.Stage(attributes)

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
            'ruler-layer' : SpecRulerLayer
            'handle-layer' : SpecHandleLayer
            'group' : SpecGroup
            'rect' : SpecRect
            'ring' : SpecRing
            'ruler' : SpecRuler
            'image' : SpecImage
            'text' : SpecText
            'star' : SpecStar
            'barcode' : SpecBarcode
            'handle-checker' : HandleChecker
        }
        layers : [{
            type: 'content-edit-layer'
            attrs:
                offset :
                    x: -20
                    y: -20
        }, {
            type: 'handle-layer'
            attrs:
                offset_monitor_target : 'content-edit-layer'
                offset :
                    x: -20
                    y: -20
        }, {
            type: 'guide-layer'
            attrs:
                offset :
                    x: -20
                    y: -20
        }, {
            type: 'ruler-layer'
            attrs:
                offset_monitor_target : 'content-edit-layer'
        }]
        toolbox_image: 'images/toolbox_painter_app.png'
    }
