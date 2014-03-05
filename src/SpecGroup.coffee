# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    class GroupViewFactory
        @createView: (attributes) ->
            return new kin.Group(attributes)

    class GroupHandleFactory
        @createHandle: (attributes) ->
            return new Kin.Group(attributes)

    {
        type: 'group'
        name: 'group'
        containable: true
        description: 'Group Specification'
        defaults: {
          width: 100
          height: 50
          fill: 'green'
          stroke: 'black'
          strokeWidth: 4
        }
        view_factory: GroupViewFactory
        handle_factory: GroupHandleFactory
        toolbox_image: 'images/toolbox_group.png'
    }
