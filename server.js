const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const School = require('node-school-kr')
console.log("시작");

let mealsInfo = {};

let today = new Date();
schoolConfig = {} 
schoolConfig['type'] = School.Type.HIGH
schoolConfig['site'] = School.Region.SEOUL
schoolConfig['code'] = 'B100000439'

const getmeal = async function (schoolConfig, year, month, day) {
	let key_head = schoolConfig['code'];
	if(schoolConfig == undefined || year == undefined || month == undefined || day == undefined){
		return {message:'error'}
	}
	
	year = parseInt(year);
	if(year < 2000){
		year = year + 2000;
	}
	if(year < 2000 || year > 2100){
		return {};
	}
	key_head = key_head + '-' + year;
	month = parseInt(month);
	if(month < 1 || month > 12){
		return {};
	}
	key_head = key_head + '-' + month + '-';
	day = parseInt(day);
	if(day < 1 || day > 31){
		return {};
	}
	//key_head = key_head + '-' + day;
	// console.log(schoolConfig);	
	//console.log(key_head);
	
	if(mealsInfo[key_head + day] != undefined){
		//console.log('I know ['+key_head + day +'] data..here is!');
		return mealsInfo[key_head + day];
	}else{
		//console.log('No caching data.. get once!');
		//console.log('Init school object');
		const school = new School()
		school.init(schoolConfig['type'], schoolConfig['site'], schoolConfig['code'])
		//school.init(School.Type.HIGH, School.Region.SEOUL, 'B100000439')
		school.getTargetURL('meal', year, month);
		const meal = await school.getMeal()
		//console.log(meal)
		//console.log(schoolConfig);
		//food = meal.today.split('\n');
		
		for( var d = 0; d < 32; d ++){
			if(meal[d] == undefined) continue;

			food = meal[d].split('\n');  
			//food = meal.today.split('\n');
			//console.log(food);
			result = {};
			indexB = food.indexOf("[조식]");
			indexL = food.indexOf("[중식]");
			indexE = food.indexOf("[석식]");
			//console.log(indexB, "-", indexL, "-", indexE);
			if(indexB != -1){
				result['조식'] = [];
				for(i = 1 ; i < indexL; i++){  
				result['조식'].push(food[i]);
				}
			}
			if(indexL != -1){
				var last = indexE
				if(indexE == -1){
					last = food.length;
				}
		 		result['중식'] = [];
				for(i = indexL + 1 ; i < last; i++){
	//				console.log(i,'-',food[i])
					result['중식'].push(food[i]);
				}
			}
			if(indexE != -1){
				result['석식'] = [];
				for(i = indexE + 1 ; i < food.length; i++){   
					result['석식'].push(food[i]);
				}
			}
			mealsInfo[key_head + d] = result;
		} // for d
		return mealsInfo[key_head + day];
	}
	
};

app.get('/', async (req, res) => {
	//console.log("connect /");
	//res.send(schoolConfig);
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1
	let day = today.getDate();
 	res.json(await  getmeal(schoolConfig, year, month, day));
});

app.get('/meal', async (req, res) => {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1
	let day = today.getDate();
 	res.json(await  getmeal(schoolConfig, year, month, day));
});


app.get('/meal/:year/:month/:day', async (req, res) => {
	console.log('Request : ' + req.params.year + '-' + req.params.month + '-' + req.params.day );
	res.json(await  getmeal(schoolConfig, req.params.year, req.params.month, req.params.day));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
