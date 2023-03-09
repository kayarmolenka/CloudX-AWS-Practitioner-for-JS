const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const products = require("./products.json");
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const dbClient = new DynamoDBClient({
  region: process.env.REGION,
});

const productsRequests = products.map((product) => ({
  PutRequest: {
    Item: {
      ...product,
    },
  },
}));

const params = {
  RequestItems: {
    ["products"]: productsRequests,
  },
};

const command = new BatchWriteItemCommand(params);

const fillDB = async () => {
  try {
    const data = await dbClient.send(command);
    console.log("Products were added to your db table", data);
    return data;
  } catch (err) {
    console.error("Error", err);
  }
};

fillDB();
