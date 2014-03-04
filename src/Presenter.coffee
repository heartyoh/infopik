# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    './Container'
], (Container) ->
    
    "use strict"

    EDIT_MODE =
        SELECT: 1
        CREATE: 2

    class Presenter extends Container
        constructor : ->

        defaults :
            edit_mode: EDIT_MODE.SELECT
            width: 600
            height: 800

    Presenter.EDIT_MODE = EDIT_MODE

    Presenter