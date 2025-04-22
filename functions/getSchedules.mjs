import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
    // Get schedules function
    const client = new DynamoDBClient({region: 'ap-southeast-1'});
    const docClient = DynamoDBDocumentClient.from(client)
    const userId = event.queryStringParameters?.userId
    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
        }
    }

    const params = {
        TableName : 'Schedules',
        Key: { userId },
    }
    
    try {
        const result = await docClient.send(new GetCommand(params));
        console.log('data saved:', result)
        const response = result?.Item ? result?.Item.schedules : []
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error('DynamoDB Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch schedules' }),
        };
    }
    
};