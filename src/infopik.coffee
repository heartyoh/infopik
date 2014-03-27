# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './ApplicationContext'
    './Command'
    './CommandManager'
    './command/CommandPropertyChange'
    './Component'
    './ComponentFactory'
    './ComponentRegistry'
    './ComponentSelector'
    './ComponentSpec'
    './Container'
    './EventEngine'
    './EventPump'
    './EventTracker'
    './Module'
    './MVCMixin'
    './SelectionManager'
    './handle/HandleChecker'
    './spec/SpecBarcode'
    './spec/SpecContentEditLayer'
    './spec/SpecContentViewLayer'
    './spec/SpecGroup'
    './spec/SpecGuideLayer'
    './spec/SpecHandleLayer'
    './spec/SpecImage'
    './spec/SpecInfographic'
    './spec/SpecPainter'
    './spec/SpecPresenter'
    './spec/SpecRect'
    './spec/SpecCircle'
    './spec/SpecRing'
    './spec/SpecRuler'
    './spec/SpecRulerLayer'
    './spec/SpecStar'
    './spec/SpecText'
], (
    ApplicationContext
    Command
    CommandManager
    CommandPropertyChange
    Component
    ComponentFactory
    ComponentRegistry
    ComponentSelector
    ComponentSpec
    Container
    EventEngine
    EventPump
    EventTracker
    Module
    MVCMixin
    SelectionManager
    HandleChecker
    SpecBarcode
    SpecContentEditLayer
    SpecContentViewLayer
    SpecGroup
    SpecGuideLayer
    SpecHandleLayer
    SpecImage
    SpecInfographic
    SpecPainter
    SpecPresenter
    SpecRect
    SpecCircle
    SpecRing
    SpecRuler
    SpecRulerLayer
    SpecStar
    SpecText
) ->
    
    "use strict"

    {
        app: (options) ->
            new ApplicationContext(options)
        spec:
            painter         : SpecPainter
            presenter       : SpecPresenter
            rect            : SpecRect
            circle          : SpecCircle
            ring            : SpecRing
            ruler           : SpecRuler
            star            : SpecStar
            infographic     : SpecInfographic
            barcode         : SpecBarcode
            image           : SpecImage
            group           : SpecGroup
    }
