# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './ApplicationContext'
    './spec/SpecPainter'
], (
	ApplicationContext
	SpecPainter
) ->
    
    "use strict"

    {
        app: (options) ->
        	new ApplicationContext(options)
        spec:
	        painter: SpecPainter
    }
