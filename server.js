const express = require('express');
const app = express();

const School = require('node-school-kr')

const getmeal = async function () {
  const school = new School()
  school.init(School.Type.HIGH, School.Region.SEOUL, 'B100000439')
  school.getTargetURL('meal', 2019, 10);
  const meal = await school.getMeal()

  food = meal.today.split('\n');
  foods = {};
  indexB = food.indexOf("[조식]");
  indexL = food.indexOf("[중식]");
  indexE = food.indexOf("[석식]");
  console.log(indexB, indexL, indexE)
  console.log("조식");
  for(i = 1 ; i < indexL; i++){   
    console.log("[" , i, "] " ,food[i]);
  }
  console.log("중식");
  for(i = indexL + 1 ; i < indexE; i++){   
    console.log("[" , i, "] " ,food[i]);
  }
  console.log("석식");
  for(i = indexE + 1 ; i < food.length; i++){   
    console.log("[" , i, "] " ,food[i]);
  }   
  //console.log(meal.today);
  return meal.today;
}


app.get('/', async (req, res) => {
  res.send(await  getmeal());
  
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});