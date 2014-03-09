# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './ApplicationContext'
], (ApplicationContext) ->
    
    "use strict"

    {
        app: (options) ->
        	new ApplicationContext(options)
    }
