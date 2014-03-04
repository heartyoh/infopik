define(['infopik', 'kinetic'], function(infopik, kinetic) {
	var withs = [
		// with *
		'advice',
		'emitter',
		'draw',
		'node',
		'container', 
		'propertyholder',
		'serialize',  // <- propertyholder
		'eventdeligate'  // <- emitter
	];

	function Rect(property) {
		/* using with-emitter mixin : on */
		this.on('click', function(e) {

		});

		/* using with-advice mixin : after */
		this.after('connect', function(e) {
			this.fire('newevent', {
				target : e.target,
				source : e.source
			});
		});

		/* using with-propertyholder mixin : set */
		this.set(property, {
			/* default properties */
			x : 0,
			y : 0,
			height : 100,
			width : 100,
			background : 'blue',
			foreground : 'red'
		});
	};

	/* overiding with-draw mixin */
	Rect.prototype.draw = function(ctx) {
		kinetic.drawRect(ctx);
	};

	return infopik.component(withs, Rect);
});

/*
1. infopik register가 관리하는 mixin들을 이름으로 mixin 한다.
- 이들이 mixin되면 대상 컴포넌트는 각 mixin들의 속성을 갖게된다.
  만약, mixin의 메쏘드를 오버라이드 하는 경우는 mixin에 정의된 메쏘드의 구현은 사용할 수 없음을 의미한다.
  mixin에 정의된 메쏘드의 구현을 사용하기 위해서는 advice 기능을 사용하는 것을 권장한다.


*/
