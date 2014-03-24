# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'bwip'
    'KineticJS'
], (bwip, kin) ->
    
    "use strict"

    createView = (attributes) ->
        view = new kin.Image
            x: attributes.x
            y: attributes.y
            draggable: true
            id: attributes.id

        imageObj = new Image()
        imageObj.onload = ->
            view.setAttrs
                width : imageObj.width,
                height : imageObj.height
            view.getLayer().draw()

        imageObj.src = bwip.imageUrl
            symbol : attributes['symbol']
            text : attributes['text']
            alttext : attributes['alttext']
            scale_h : attributes['scale_h']
            scale_w : attributes['scale_w']
            rotation : attributes['rotation']

        view.setImage(imageObj)

        view

    createHandle = (attributes) ->
        new Kin.Image(attributes)

    controller =
        '(self)' :
            '(self)' :
                change : (component, before, after, changed) ->
                    return if after.x or after.y

                    controller = this
                    view = controller.getAttachedViews()[0]

                    url = bwip.imageUrl
                        symbol : component.get('symbol'),
                        text : component.get('text'),
                        alttext : component.get('alttext'),
                        scale_h : component.get('scale_h'),
                        scale_w : component.get('scale_w'),
                        rotation : component.get('rotation')

                    imageObj = view.getImage()
                    imageObj.src = url

    {
        type: 'barcode'
        name: 'barcode'
        description: 'Barcode Specification'
        defaults: {
            width: 100
            height: 50
            stroke: 'black'
            strokeWidth: 1
            rotationDeg: 0
            draggable: true
        }
        controller: controller
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_barcode.png'
    }
