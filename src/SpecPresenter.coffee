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
        return new kin.Stage(attributes)

    onadd = (container, component) ->
        vcontainer = @view.find("\##{container.get('id')}")
        vcomponent = @componentFactory.createView(component)

        vcontainer.add(vcomponent);

    onremove = (container, component) ->

    controller =
        'presenter-app':
            'add' : onadd
            'remove' : onremove

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
        toolbox_image: 'images/toolbox_presenter_app.png'
    }
