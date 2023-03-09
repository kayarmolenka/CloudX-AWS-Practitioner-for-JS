const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const stocks = require("./stocks.json");

const dbClient = new DynamoDBClient({
  region: process.env.REGION,
});

const stocksRequests = stocks.map((product) => ({
  PutRequest: {
    Item: {
      ...product,
    },
  },
}));

const params = {
  RequestItems: {
    ["stocks"]: stocksRequests,
  },
};

const command = new BatchWriteItemCommand(params);

const fillDBOfStocks = async () => {
  try {
    const data = await dbClient.send(command);
    console.log("Stocks were added to your db table", data);
    return data;
  } catch (err) {
    console.error("Error", err);
  }
};

fillDBOfStocks();
