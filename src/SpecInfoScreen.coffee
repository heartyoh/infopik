# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (
    kin
) ->

    "use strict"

    createView = (attributes) ->
        layer = new kin.Layer(attributes)
        layer.add new kin.Text
            x: 10
            y: 10
            listening: false
            fontSize: 12
            fontFamily: 'Calibri'
            fill: 'green'

        layer

    onchange = (component, before, after) ->
        self = this
        self.changes++
        layer = this.layer
        text = this.text

        msg = "[ PropertyChange ] #{component.type} : #{component.get('id')}\n[ Before ] #{JSON.stringify(before)}\n[ After ] #{JSON.stringify(after)}"
        text.setAttr('text', msg)

        layer.draw()

        setTimeout ->
            return if (--self.changes) > 0
            text.setAttr('text', '')
            layer.draw()
        , 5000

    onchangemodel = (after, before) ->
        for screen in this.findComponent 'info-screen'

            layer = (this.findViewByComponent screen)[0]
            text = layer.find('Text').toArray()[0]
            
            before.off('change', onchange) if before
            after.on('change', onchange, {layer:layer, text:text, changes: 0}) if after

    controller =
        '#application' :
            'change-model' : onchangemodel

    {
        type: 'info-screen'
        name: 'info-screen'
        containable: true
        container_type: 'layer'
        description: 'Information Screen Specification'
        defaults: {
            draggable: false
        }
        controller: controller
        view_factory_fn: createView
        toolbox_image: 'images/toolbox_info_screen.png'
    }
