# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    attachView = (model, view, x) ->
        return if not view

        model.__views__ = [] if not model.__views__
        model.__views__.push view
        
        setModel view, model, false if x

    detachView = (model, view, x) ->
        return if (not view) or (not model.__views__)
        
        index = model.__views__.indexOf(view)
        return if index == -1
        
        model.__views__.splice(index, 1)
        
        setModel view, null, false if x

    detachAll = (model) ->
        return if not model.__views__

        for view in model.__views__
            setModel view, null, false

        model.__views__ = null

    getViews = (model) ->
        attaches = []
        return attaches if not model.__views__
        (view for view in model.__views__)

    setModel = (view, model, x) ->
        oldModel = view.__model__
        return if oldModel is model
        detachView oldModel, view, false if oldModel && x
        view.__model__ = model
        attachView model, view, false if model && x

    getModel = (view) ->
        view.__model__

    withModel = ->
        this.attachView = (view) ->
            attachView this, view, true
        this.detachView = (view) ->
            detachView this, view, true
        this.detachAll = ->
            detachAll this
        this.getViews = (filter) ->
            getViews this

    withView = ->
        this.getModel = ->
            getModel this
        this.setModel = (model) ->
            setModel this, model, true

    withController = ->
        this.attach = (model, view) ->
            attachView model, view, true
        this.detach = (model, view) ->
            detachView model, view, true
        this.detachAll = (model) ->
            detachAll model
        this.getAttachedModel = (view) ->
            getModel view
        this.getAttachedViews = (model) ->
            getViews model

    {
        controller: withController
        model: withModel
        view: withView
        # view_fns:
        #     getModel: ->
        #         getModel this
        #     setModel: (model) ->
        #         setModel this, model, true
    }
