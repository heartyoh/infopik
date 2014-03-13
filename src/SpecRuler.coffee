# ==========================================
# Copyright 2014 Hatio, Lab.
# Licensed under The MIT License
# http://opensource.org/licenses/MIT
# ==========================================

define [
    'KineticJS'
], (kin) ->
    
    "use strict"

    PIXEL_PER_MM = 3.779527559

    drawHorizontal = (context) ->
        startX = parseInt(this.getAttr('zeropos'))
        marginLeft = this.getAttr('margin')[0]
        marginRight = this.width() - this.getAttr('margin')[1]
        
        baseY = this.height() - 15
        bottomY = this.height()

        context.beginPath()

        context.moveTo(0, 0)
        context.lineTo(0, this.height())
        context.lineTo(this.width(), this.height())
        context.lineTo(this.width(), 0)
        context.lineTo(0, 0)

        plusWidth = this.width() - startX
        plusCount = Math.ceil(plusWidth / PIXEL_PER_MM)

        for i in [0..(plusCount - 1)]
            x = startX + i * PIXEL_PER_MM

            break if x > marginRight
            continue if x < marginLeft

            if (i % 10 == 0)
                context.moveTo(x, baseY)
                context.lineTo(x, bottomY)
            else if (i % 5 == 0)
                context.moveTo(x, baseY + 8)
                context.lineTo(x, bottomY)
            else
                context.moveTo(x, baseY + 11)
                context.lineTo(x, bottomY)

        minusWidth = startX
        minusCount = Math.floor(minusWidth / PIXEL_PER_MM)

        for i in [1..(minusCount - 1)]
            x = startX - i * PIXEL_PER_MM

            break if x < marginLeft
            continue if x > marginRight

            if (i % 10 == 0)
                context.moveTo(x, baseY)
                context.lineTo(x, bottomY)
            else if (i % 5 == 0)
                context.moveTo(x, baseY + 8)
                context.lineTo(x, bottomY)
            else
                context.moveTo(x, baseY + 11)
                context.lineTo(x, bottomY)

        context.closePath()
        context.fillStrokeShape(this)    

        for i in [0..(plusCount - 1)] by 10
            x = startX + i * PIXEL_PER_MM
            break if x > marginRight
            continue if x < marginLeft
            context.strokeText("#{i / 10}", x + 2, baseY + 10)

        for i in [10..(minusCount - 1)] by 10
            x = startX - i * PIXEL_PER_MM
            break if x < marginLeft
            continue if x > marginRight
            context.strokeText("-#{i / 10}", x + 2, baseY + 10)

    drawVertical = (context) ->
        startY = parseInt(this.getAttr('zeropos'))
        marginTop = this.getAttr('margin')[0]
        marginBottom = this.height() - this.getAttr('margin')[1]
        
        baseX = this.width() - 15
        endX = this.width()

        context.beginPath()

        context.moveTo(0, 0)
        context.lineTo(0, this.height())
        context.lineTo(this.width(), this.height())
        context.lineTo(this.width(), 0)
        context.lineTo(0, 0)

        plusArea = this.height() - startY
        plusCount = Math.ceil(plusArea / PIXEL_PER_MM)

        for i in [0..(plusCount - 1)]
            y = startY + i * PIXEL_PER_MM

            break if y > marginBottom
            continue if y < marginTop

            if (i % 10 == 0)
                context.moveTo(baseX, y)
                context.lineTo(endX, y)
            else if (i % 5 == 0)
                context.moveTo(baseX + 8, y)
                context.lineTo(endX, y)
            else
                context.moveTo(baseX + 11, y)
                context.lineTo(endX, y)

        minusArea = startY
        minusCount = Math.floor(minusArea / PIXEL_PER_MM)

        for i in [1..(minusCount - 1)]
            y = startY - i * PIXEL_PER_MM
            
            continue if y > marginBottom
            break if y < marginTop

            if (i % 10 == 0)
                context.moveTo(baseX, y)
                context.lineTo(endX, y)
            else if (i % 5 == 0)
                context.moveTo(baseX + 8, y)
                context.lineTo(endX, y)
            else
                context.moveTo(baseX + 11, y)
                context.lineTo(endX, y)

        context.closePath()
        context.fillStrokeShape(this)    

        for i in [0..(plusCount - 1)] by 10
            y = startY + i * PIXEL_PER_MM
            break if y > marginBottom
            continue if y < marginTop
            context.strokeText("#{i / 10}", 1, y + 10)

        for i in [10..(minusCount - 1)] by 10
            y = startY - i * PIXEL_PER_MM
            break if y < marginTop
            continue if y > marginBottom
            context.strokeText("-#{i / 10}", 1, y + 10)

    drawFunc = (context) ->
        if this.getAttr('direction') isnt 'vertical'
            drawHorizontal.apply this, arguments
        else
            drawVertical.apply this, arguments

    createView = (attributes) ->
        new Kinetic.Shape attributes

    createHandle = (attributes) ->
        new Kin.Rect(attributes)

    {
        type: 'ruler'
        name: 'ruler'
        description: 'Ruler Specification'
        defaults: {
            drawFunc: drawFunc
            fill: '#848586'
            stroke: '#C2C3C5'
            strokeWidth: 0.5
            width: 100
            height: 50
            margin: [15, 15]
            zeropos: 15
            direction: 'horizontal'
            font: '8px Verdana'
        }
        view_factory_fn: createView
        handle_factory_fn: createHandle
        toolbox_image: 'images/toolbox_ruler.png'
    }

