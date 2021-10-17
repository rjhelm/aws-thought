const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const awsConfig = {
    region: 'us-east-2',
    endpoint: "http://localhost:8000",
}

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

const table = "Thoughts";

router.get('/users', (req, res) => {
    const params = {
        TableName: table
    };
    // Scan return all items in the table
    if (err) {
        res.status(500).json(err); // an error occured
    } else {
        res.json(data.Items)
    }
})

router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);
    const params = {
        TableName: 'table',
        KeyConditionExpression: "#un = :user",
        ExpressionAttributeNames: {
            "#un": "username",
            "#ca": "createdAt",
            "th": "thought"
        },
        ExpressionAttributeValues: {
            ":user": req.params.username
        },
        ProjectExpression: "#th, #ca",
        ScanIndexForward: false
    };

    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query Succeded.");
            res.json(data.Items)
        }
    });
});

// Create a new user at /api/users
router.post("/users", (req, res) => {
    const params = {
        TableName: table,
        Item: {
            "username": req.body.username,
            "createdAt": Date.now(),
            "thought": req.body.thought
        }
    };

    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.json({"Added": JSON.stringify(data, null, 2)});
        }
    });
});




module.exports = router;