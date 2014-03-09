# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'dou'
], (dou) ->
    
    "use strict"

    class SelectionManager
        constructor: (config) ->
            @onselectionchange = config.onselectionchange
            @selections = []

        get: ->
            dou.util.clone @selections
    
        toggle: (target) ->

            # target : 대상이 있는 경우는 Object. 없는 경우는 falsy
            # toggle : 기존 선택된 것들을 기반으로 하면 true, 새로운 선택이면 false 또는 falsy
            
            # 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
            old_sels = dou.util.clone(@selections)

            # 2 단계 : 현재 선택된 리스트를 별도로 보관한다.
            added = []
            removed = []

            # 3 단계 : target이 현재 선택된 것인지 확인한다.
            if(@selections.indexOf(target) >= 0)
                removed.push(target)
                @selections = _.without(@selections, target)
            else
                added.push(target)
                @selections.push(target)
            
            if(@onselectionchange)
                @onselectionchange
                    added : added
                    removed : removed
                    selected : @selections
                    before : old_sels

        select : (target) ->

            # target : 복수개가 선택된 경우는 Array, 하나인 경우는 Object. 없는 경우는 falsy
            # append : 기존 선택된 것들에 추가이면 true, 새로운 선택이면 false 또는 falsy
        
            # 1 단계 : 현재 선택된 리스트를 별도로 보관한다.
            old_sels = _.clone(@selections)
        
            # 2 단계 : target 타입을 Array로 통일한다.
            if not target instanceof Array
                target = if not target then [] else [target]
            
            # 3 단계 : 새로운 선택 리스트를 만든다.
            @selections = target
            
            # 4 단계 : 변화된 리스트를 찾는다.(선택리스트에서 빠진 것 찾기)
            added = _.difference(@selections, old_sels)
            removed = _.difference(old_sels, @selections)
            
            if @onselectionchange
                @onselectionchange
                    added : added
                    removed : removed
                    selected : @selections
                    before : old_sels
        
        reset : ->
            @selections = []
