const express = require('express');
const app = express();
const axios = require("axios");
const port = process.env.PORT || 4000;

// Import the appropriate class
const {
  WebhookClient
} = require('dialogflow-fulfillment');

app.use(express.json())

app.get('/', (req, res) => {
  // axios.post("https://script.google.com/macros/s/AKfycbz9viVEzAYBHnE6PiIxw5wFbHK9mfOd1wZx3gVK8CfGCSoeaErI/exec?action=addUser",{data:"sheet"})
  // .then(res => console.log(res.data))
  res.send({
    success: true
  });
})

app.post('/webhook', async (req, res) => {
  console.log('POST: /');
  console.log('Body: ',req.body);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  //Test get value of WebhookClient
  console.log('agentVersion: ' + agent.agentVersion);
  console.log('intent: ' + agent.intent);
  console.log('locale: ' + agent.locale);
  console.log('query: ', agent.query);
  console.log('session: ', agent.session);

  let {data} = await axios.get("https://covid19.ddc.moph.go.th/api/Cases/today-cases-all")
  console.log(data);

  //Function Location
  function location(agent) {
    const day = data[0].txn_date.split("-")
    const year = parseInt(day[0])+543;
    const loot = parseInt(day[1])
    const day1 = parseInt(day[2])
    
    // switch
    switch (loot) {
      case 1:
        month = "มกราคม";
        break;
      case 2:
        month = "กุมภาพันธ์";
        break;
      case 3:
        month = "มีนาคม";
        break;
      case 4:
        month = "เมษายน";
        break;
      case 5:
        month = "พฤษภาคม";
        break;
      case 6:
        month = "มิถุนายน";
        break;
      case 7:
        month = "กรกฎาคม";
        break;
      case 8:
        month = "สิงหาคม";
        break;
      case 9:
        month = "กันยายน";
        break;
      case 10:
        month = "ตุลาคม";
        break;
      case 11:
        month = "พฤศจิกายน";
        break;  
      case 12:
        month = "ธันวาคม";
        
    }
    
    agent.add(`วันที่ ${day1} ${month} พ.ศ.${year}`);
    agent.add(`มีผู้ติดเชื้อรายใหม่ ${data[0].new_case.toLocaleString("en-US")} คน`);
    agent.add(`ผู้ที่รักษาหายแล้ว ${data[0].new_recovered.toLocaleString("en-US")} คน`);
    agent.add(`ผู้เสียชีวิต ${data[0].new_death.toLocaleString("en-US")} คน`);
    agent.add(`สามารถดูกราฟผู้ติดเชื้อรวมได้ http://localhost:3000/graph`);
    
  }
  let intentTest = new Map()
  intentTest.set("Test",location)
  agent.handleRequest(intentTest)

  
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});


////////////////////////////////////////////////////

