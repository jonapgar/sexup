//test.js

var _ = require('lodash');

var environment = {
	fitness:function(life){
		var dna = life.dna;

		return -(Math.pow(dna.a,2) + Math.pow(dna.b,2) +Math.pow(dna.c,2) + Math.pow(dna.d,2));
	},
	maxPopulation:100,
	cullPortion:0.5,
	defaultProperties:{
		pulse:50,
		dna:{
			mutativeChance: 0.5,
			mutativeFactor: 1,
			incestThreshold: 1,
			xenophobia: 0,
		}
	}
}

var Life = require('./life.js').Life;
environment = require('./life.js').Environment(environment);

for (var i=0;i<10;i++) {
	new Life(environment,{dna:{a:Math.random(),b:Math.random(),c:Math.random(),d:Math.random()}});
}
setInterval(function(){
	console.log('pop: ',environment.populace.length);
	console.log('best:\n' + _(environment.populace).sortBy(function(life){
		var fitness = environment.fitness(life);
		return -fitness
	}).take(5).map(function(life){
		return JSON.stringify(_.pick(life.dna,['a','b','c','d']))
	}).value().join('\n'))
},250)


