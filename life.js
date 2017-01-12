//life.js

//requires
var _ = require('lodash');


var Life = function(environment, p) {
	_.assign(this, p)
	this.environment = environment;
	_.defaultsDeep(this,environment.defaultProperties)
	this.birth();
}




var i = {};
i.err = err
i.birth = birth
i.mate = mate
i.start = start
i.stop = stop
i.find = find
i.similarity = similarity
i.mutate = mutate
i.is = is
i.was = was
i.likes=likes
i.meiosis = meiosis
i.depress = depress;
i.die = die;




_.assign(Life.prototype, i);

module.exports = {
	Life:Life,
	Environment:function(environment){
			environment = environment || {}
			_.defaultsDeep(environment,{ 
			influences: {
				discernment:{
					type:'float',

				}
			},
			desparationIncrement:0.1,
			matingHappinessBoost:1,
			inc:0,
			populace:[],
			maxPopulation:100,
			cullPortion:0.2,
			defaultInfluence:{type:'float',step:0.1,weight:1},
			defaultProperties:{
				pulse: 1000,
				attributes: {},
				formerly: {},
				dna: {
					mutativeChance: 0.1,
					mutativeFactor: 0.1,
					incestThreshold: 0.1,
					xenophobia: 0.1,
					discernment:0
				}
			},
			fitness: function(life) {
				return 0;
			}
		});
		
		return environment
	}
};



function err(e) {
	throw e;
}

function birth(name) {
	this.age=0;
	name = name || 'unnamed';
	this.inc = ++this.environment.inc
	name = this.name = name + '-' + this.inc;
	var environment = this.environment;
	var population = environment.populace.push(this);
	if (population > environment.maxPopulation) {
		
		environment.populace = _.sortBy(environment.populace,function(life){
			return environment.fitness(life);
		});
		_.each(environment.populace.splice(0,Math.floor(environment.maxPopulation*environment.cullPortion)),function(life){
			life.die();
		})
	}
	var sex = this.sex = chance() ? 'male' : 'female',
		act

	switch (sex) {
		case 'male':
			act = this.depress
			break;
		case 'female':
			act = this.seek = seek
			break;
	}
	this.desparation=0;

	var self = this;
	act = _.bind(act,this)
	this.hearbeat = setInterval(function(){
		act()
		self.age++
	}, this.pulse)

	
}

function die(){
	clearInterval(this.hearbeat);
}

function seek() {
	var male = this.find('male')
	if (male && this.likes(male)) {
		if (male.likes(this)) {
			// console.log('we be fucking')
			this.mate(male)
		} else {
			// console.log('he doesnt like me though')
			this.depress();		
		}
	} 
	// else if (male){
	// 	// console.log('he wasnt hot enoughh')
	// } else {
	// 	console.log('no dudes');
	// }
}

function depress() {
	this.desparation+=this.environment.desparationIncrement
}

function likes(other) {

	if (this.dna.incestThreshold<1) {
		var sim = this.similarity(other.dna, this.dna);
		if (sim > this.dna.incestThreshold) {
			console.log('ew incest')
			return false;
		}
	}

	if (this.dna.xenophobia > 0) {
		sim = sim===undefined ? this.similarity(other.dna, this.dna):sim;
		if (sim < this.dna.xenophobia) {
			console.log("but I'm racist")
			return false;
		}
	}
	var hisFitness = this.environment.fitness(other);
	var myDesparation = (this.desparation-this.dna.discernment)*Math.abs(hisFitness);
	var myFitness = this.environment.fitness(this);
	return hisFitness + myDesparation >= myFitness
	

}

function similarity(a, b) {
	_.defaults(a, b)
	_.defaults(b, a)
	var environment = this.environment,
		influences = environment.influences,
		m
	m = _.reduce(a, function(m, v, k) {
		var inf = influences[k] = influences[k] || {}
		_.defaults(inf,environment.defaultInfluence)
		switch (inf.type) {
			case 'integer':
			case 'float':
				var p = [a[k], b[k]].sort()
				m.diff += Math.abs(p[1] / p[0] - 1) * inf.weight
				m.weight += inf.weight
			default:
				break;
		}
		return m
	}, 0)
	return m.total / m.weight
}

function meiosis() {
	var m = this.dna.mutativeChance,
		f = this.dna.mutativeFactor;
	var self=this;
	return _.mapValues(this.dna, function(v, k) {

		return chance(m) ? self.mutate(v, k, f) : v
	},this)
}

function mutate(v, k, f) {
	var environment = this.environment,
		influences = environment.influences,
		inf = influences[k] = influences[k] || {}
	_.defaults(inf,environment.defaultInfluence)
	switch (inf.type) {
		case 'float':
			return v += posneg() * Math.max(inf.step,inf.step  * Math.abs(v)) * f
		case 'integer':
			return v += Math.round(posneg() * Math.max(inf.step,inf.step  * Math.abs(v)) * f)
		default:
			return v;
	}
}

function mate(male) {
	//females are not desparate after sex
	this.desparation=0;
	//males become somewhat less desparate after sex
	male.desparation=Math.max(0,male.desparation-this.environment.matingHappinessBoost);
	return new Life(this.environment,{
		dna: merge(male.meiosis(), this.meiosis())
	});
}

function is(attribute, value) {
	if (!_.isString(attribute))
		return _.matches(attribute)(this.attributes)
	else if (value === undefined)
		return this.attributes[attribute] !== undefined
	else
		return _.isEqual(this.attributes[attribute], value)
}

function was(attribute) {
	return this.formerly[attribute] !== undefined
}

function start(action, v) {
	this.attributes[action] = v
}

function stop(action) {
	this.formerly[action] = this.attributes[action]
	delete this.attributes[action]
}

function find(sex) {
	var i=Math.round(Math.random()*this.environment.populace.length-1);
	var v = this.environment.populace[i];
	if (v && v.sex==sex)
		return v;
	else
		return null;
}

function merge(a, b) {
	_.defaults(a, b)
	_.defaults(b, a)
	return _.mapValues(a, function(v, k) {
		return chance() ? a[k] : b[k]
	})
}

function chance(z) {
	if (z === undefined)
		z = 0.5
	return rand() <= z
}

function posneg() {
	return 2 * (rand() - 0.5);
}

function rand() {
	return Math.random();
}



