define [
	'infopik'
	'kinetic'
], (infopik, kinetic) ->
	withs = [
		# with *
		'advice'
		'emitter'
		'draw'
		'node'
		'container'
		'propertyholder'
		'serialize'  # <- propertyholder
		'eventdeligate'  # <- emitter
	]

	class Polygon
		constructor : (property) ->
			# using with-emitter mixin : on
			this.on 'click', (e) ->
				# do nothing

			# using with-advice mixin : after
			this.after 'connect', (e) ->
				this.fire 'newevent', 
					target : e.target
					source : e.source
					sample : e.sample

			# using with-propertyholder mixin : set
			this.set property,
				x : 0
				y : 0
				height : 100
				width : 100
				background : 'blue'
				foreground : 'red'

		# overiding with-draw mixin
		draw : (ctx) -> kinetic.drawPolygon(ctx)

	infopik.component withs, Polygon
