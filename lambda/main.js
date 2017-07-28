var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({
  endpoint: 'a1udr0qzhg5qir.iot.us-east-1.amazonaws.com',
  accessKeyId: 'AKIAJTKDBJ57NKDMCBDA',
  secretAccessKey: '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',
  region:'us-east-1'
});

//I want to increase the sum of votes for a person-animal combination
votePerson="anthonio";
voteAnimal="bear";

data ={  "payload": "{\"state\":{\"desired\":{\"welcome\":\"aws-iot\",\"nathan\":{\"lion\":\"5\",\"bear\":\"2\"},\"anthonio\":{\"lion\":2,\"bear\":8}},\"reported\":{\"welcome\":\"aws-iot\",\"anthonio\":{\"lion\":\"2\",\"bear\":8},\"nathan\":{\"lion\":\"5\",\"bear\":\"2\"}}},\"metadata\":{\"desired\":{\"welcome\":{\"timestamp\":1500964419},\"nathan\":{\"lion\":{\"timestamp\":1500964419},\"bear\":{\"timestamp\":1500964419}},\"anthonio\":{\"lion\":{\"timestamp\":1500964419},\"bear\":{\"timestamp\":1500964419}}},\"reported\":{\"welcome\":{\"timestamp\":1500964385},\"anthonio\":{\"lion\":{\"timestamp\":1500964419},\"bear\":{\"timestamp\":1500964419}},\"nathan\":{\"lion\":{\"timestamp\":1500964419},\"bear\":{\"timestamp\":1500964419}}}},\"version\":21,\"timestamp\":1500964864}"};
console.log(data.payload);
payload = JSON.parse(data.payload);
console.log("Version is " + payload.version);
voteStr=JSON.stringify( payload.state.reported[votePerson][voteAnimal]);
if (voteStr==null)
  vote=1;
else
  vote=parseInt(voteStr)+1;

var params = {
  topic: '$aws/things/Mqtt_Client/shadow/update', /* required version:'+payload.version +',*/
  payload: '{"state":{"reported":{"'+votePerson+'":{"'+voteAnimal+'":'+vote+'}}},"version":'+payload.version+'}',
  qos: 1
};
iotdata.publish(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
    }
  });






