# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    'KineticJS'
], (
    dou
    kin
) ->
    
    "use strict"

    createView = (attributes) ->
        fills = ['red', 'black', 'yellow', 'cyan']
        fill = Math.floor(Math.random() * 10) % (fills.length)
        new kin.Rect(dou.util.shallow_merge(attributes, {fill: fills[fill]}))

    createHandle = (attributes) ->
        new Kin.Rect(attributes)

    {
        type: 'handle-checker'
        name: 'handle-checker'
        description: 'Checker Handle Specification'
        defaults: {
            width: 10
            height: 10
            fill: 'red'
            stroke: 'black'
            strokeWidth: 2
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_handle_checker.png'
    }
