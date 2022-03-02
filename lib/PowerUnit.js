var Measurement=require("./Measurement.js"),PowerUnit=function(options){this.unit="watt",this.amount=0,this.ratios=PowerUnit.ratios,this.aliases=PowerUnit.aliases,this.aliasesLower=PowerUnit.aliasesLower,this.systems=PowerUnit.systems,this.parent(options)};for(var a in PowerUnit.prototype=new Measurement(),PowerUnit.prototype.parent=Measurement,(PowerUnit.prototype.constructor=PowerUnit).ratios={milliwatt:[1,1,.001,1e-6,1e-9,1e-12,.0737562149277,134102209e-14,.003412142450123],watt:[2,1e3,1,.001,1e-6,1e-9,.737562149277,.00134102209,3.412142450123],kilowatt:[3,1e6,1e3,1,.001,1e-6,737.562149277,1.34102209,3412.142450123],megawatt:[4,1e9,1e6,1e3,1,.001,737562.149277,1341.02209,3412142.450123],gigawatt:[5,1e12,1e9,1e6,1e3,1,737562149.277,1341022.09,3412142450.123],"foot-pound-per-hour":[6,1355.81795,1.35581795,.00135581795,135581795e-14,1.35581795e-9,1,5.05051e-7,.001285067782],horsepower:[7,745701.0335416,745.7010335416,.7457010335416,.0007457010335416,7.457010335416e-7,1979999.9829594917,1,2544.43418687714],"btu-per-hour":[8,293.071,.293071,.00293071,293071e-11,2.93071e-9,778.169069245845,.000393014685,1]},PowerUnit.prototype.getMeasure=function(){return"power"},PowerUnit.prototype.newUnit=function(params){return new PowerUnit(params)},PowerUnit.systems={metric:["milliwatt","watt","kilowatt","megawatt","gigawatt"],uscustomary:["foot-pound-per-hour","btu-per-hour","horsepower"],imperial:["foot-pound-per-hour","btu-per-hour","horsepower"],conversions:{uscustomary:{metric:{"foot-pound-per-hour":"watt","btu-per-hour":"watt","refridgeration-ton":"kilowatt",horsepower:"kilowatt"}},imperial:{metric:{"foot-pound-per-hour":"watt","btu-per-hour":"watt","refridgeration-ton":"kilowatt",horsepower:"kilowatt"}},metric:{uscustomary:{milliwatt:"horsepower",watt:"horsepower",kilowatt:"horsepower",megawatt:"horsepower",gigawatt:"horsepower"},imperial:{milliwatt:"horsepower",watt:"horsepower",kilowatt:"horsepower",megawatt:"horsepower",gigawatt:"horsepower"}}}},PowerUnit.aliases={"milli joule/second":"milliwatt","milli joule/s":"milliwatt","millijoule/second":"milliwatt","millijoule/s":"milliwatt","milliJ/second":"milliwatt","milliJ/s":"milliwatt","mJ/s":"milliwatt","joule per second":"watt","joules per second":"watt","joule/second":"watt","joules/second":"watt","joule/s":"watt","joules/s":"watt","J/s":"watt","kilojoule/second":"kilowatt","kilojoule/s":"kilowatt","kiloJ/second":"kilowatt","kiloJ/s":"kilowatt","kJ/s":"kilowatt","BTU/h":"btu-per-hour","British Thermal Unit per hour":"btu-per-hour","British Thermal Units per hour":"btu-per-hour","British Thermal Unit/hour":"btu-per-hour","British Thermal Units/hour":"btu-per-hour","BTU per hour":"btu-per-hour","BTUs per hour":"btu-per-hour","BTU/hour":"btu-per-hour","BTUs/hour":"btu-per-hour","BTU/h":"btu-per-hour","milli watt":"milliwatt",mW:"milliwatt","kilo watt":"kilowatt",kW:"kilowatt",W:"watt","mega watt":"megawatt",mW:"megawatt","giga watt":"gigawatt",gW:"gigawatt","foot pound per hour":"foot-pound-per-hour","foot pound/hour":"foot-pound-per-hour","foot pound/h":"foot-pound-per-hour","foot lb/hour":"foot-pound-per-hour","foot lb/h":"foot-pound-per-hour","ft lbf/h":"foot-pound-per-hour","ft lb/h":"foot-pound-per-hour","ft lbs/h":"foot-pound-per-hour","ft-lb/h":"foot-pound-per-hour","ft-lbs/h":"foot-pound-per-hour","f lb/h":"foot-pound-per-hour","horse power":"horsepower",hp:"horsepower","british thermal units per hour":"btu-per-hour","BTU per hour":"btu-per-hour","BTUs per hour":"btu-per-hour","british thermal units/hour":"btu-per-hour","british thermal unit/hour":"btu-per-hour","british thermal units/hr":"btu-per-hour","british thermal unit/hr":"btu-per-hour","BTU/hour":"btu-per-hour","BTUs/hour":"btu-per-hour","BTU/hr":"btu-per-hour","BTUs/hr":"btu-per-hour","BTU/h":"btu-per-hour","BTUs/h":"btu-per-hour"},PowerUnit.aliasesLower={},PowerUnit.aliases)PowerUnit.aliasesLower[a.toLowerCase()]=PowerUnit.aliases[a];PowerUnit.convert=function(to,from,power){from=Measurement.getUnitIdCaseInsensitive(PowerUnit,from)||from,to=Measurement.getUnitIdCaseInsensitive(PowerUnit,to)||to;var fromRow=PowerUnit.ratios[from],toRow=PowerUnit.ratios[to];if(void 0!==from&&void 0!==to)return power*fromRow[toRow[0]]},PowerUnit.getMeasures=function(){return Object.keys(PowerUnit.ratios)},Measurement._constructors.power=PowerUnit,module.exports=PowerUnit;