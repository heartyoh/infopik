# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

# Ref. http://arcturo.github.io/library/coffeescript/03_classes.html
  
define [
], (
) ->

  moduleKeywords = ['extended', 'included']

  class Module
    @extend: (obj) ->
      for key, value of obj when key not in moduleKeywords
        @[key] = value

      obj.extended?.apply(@)
      this

    @include: (obj) ->
      for key, value of obj when key not in moduleKeywords
        # Assign properties to the prototype
        @::[key] = value

      obj.included?.apply(@)
      this