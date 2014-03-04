# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
	'./Renderer'
	'KineticJS'
], (Renderer, kin) ->
    
    "use strict"

    class RectRenderer extends Renderer
        draw: (context) ->
        	@provider.get('x')

    RectRenderer