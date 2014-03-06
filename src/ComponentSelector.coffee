# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './Component'
], (dou, Component) ->

    "use strict"

    select = (selector, component) ->
        selector is component.type

    {
        select: select
    }
