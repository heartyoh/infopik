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
            layer = image.getLayer()
            layer.draw() if layer

        imageObj.src = attributes['url']

        image.setImage(imageObj)

        image

    createHandle = (attributes) ->
        new Kin.Image(attributes)

    model_event_map =
        '(self)' :
            '(self)' :
                change : (component, before, after) ->
                    return if not (before['url'] or after['url'])
                    
                    controller = this
                    view = controller.getAttachedViews(component)[0]

                    imageObj = view.getImage()
                    imageObj.src = after['url']

    view_event_map = 
        '(self)' : # fot Test only
            click : (e) ->
                controller = this.context
                view = this.listener
                model = controller.getAttachedModel view

                this.count = if this.count then ++this.count else 1
                if(this.count % 2)
                    model.set('url', 'http://www.baidu.com/img/bdlogo.gif')
                else
                    model.set('url', 'http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png')

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
        model_event_map: model_event_map
        view_event_map: view_event_map
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_image.png'
    }
