# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    createView = (attributes) ->
        image = new kin.Image(attributes)

        imageObj = new Image()
        imageObj.onload = ->
            image.getLayer().draw()

        imageObj.src = attributes['url']

        image.setImage(imageObj)

        image

    createHandle = (attributes) ->
        new Kin.Image(attributes)

    controller =
        '(self)' :
            '(self)' :
                change : (component, before, after) ->
                    return if not (before['url'] or after['url'])
                    imageObj = component.attaches()[0].getImage()
                    imageObj.src = after['url']


    view_listener = 
        '(self)' : # fot Test only
            click : (e) ->
                this.count = if this.count then ++this.count else 1
                if(this.count % 2)
                    this.listener.__component__.set('url', 'http://www.baidu.com/img/bdlogo.gif')
                else
                    this.listener.__component__.set('url', 'http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png')

    {
        type: 'image'
        name: 'image'
        description: 'Image Specification'
        defaults: {
            width: 100
            height: 50
            stroke: 'black'
            strokeWidth: 1
            rotationDeg: 0
            draggable: true
        }
        controller: controller
        view_listener: view_listener
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_image.png'
    }
