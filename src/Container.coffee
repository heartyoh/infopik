# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
    './Component'
    './Containable'
], (dou, Component, Containable) ->
    
    "use strict"

    class Container extends Component
        constructor : ->

    dou.mixin Container, Containable
