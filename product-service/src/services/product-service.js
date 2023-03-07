import {
  GetItemCommand,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "aws-sdk";
import { dbClient } from "../db";
import { v4 as uuidv4 } from "uuid";
import { ERROR_MESSAGE, HTTP_STATUSES, SUCCESS_MESSAGE } from "../constants";
import { errorResponse } from "../utils/responces";

export class ProductService {
  getAllProducts = async () => {
    const scanParams = {
      TableName: process.env.PRODUCTS_TABLE,
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanOutput = await dbClient.send(scanCommand);

    return scanOutput.Items.map((item) => DynamoDB.Converter.unmarshall(item));
  };

  getProductById = async (id) => {
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: {
          S: id,
        },
      },
    };
    const results = await dbClient.send(new GetItemCommand(params));
    return DynamoDB.Converter.unmarshall(results.Item);
  };

  createProduct = async ({ title, description, price }) => {
    const id = uuidv4();
    const transaction = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
              id: { S: id },
              title: { S: title },
              description: { S: description },
              price: { N: `${price}` },
            },
          },
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE,
            Item: {
              id: { S: uuidv4() },
              product_id: { S: id },
              count: { N: `${10}` },
            },
          },
        },
      ],
    };

    const command = new TransactWriteItemsCommand(transaction);
    const transactionOutput = await dbClient.send(command);

    if (transactionOutput?.$metadata?.httpStatusCode !== HTTP_STATUSES.OK_200) {
      errorResponse(
        { message: ERROR_MESSAGE.SOMETHING_WRONG },
        HTTP_STATUSES.INTERNAL_SERVER_ERROR
      );
    }

    return SUCCESS_MESSAGE.CREATE_PRODUCT;
  };
}
