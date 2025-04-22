import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb"

export const handler = async (event) => {
    // Create shedule function
    const client = new DynamoDBClient({region: 'ap-southeast-1'});
    const docClient = DynamoDBDocumentClient.from(client)
    const userId = event.queryStringParameters?.userId
    const data = JSON.parse(event.body);
    console.log('userId:', userId);
    console.log('data:', data);
    if (!userId || userId == undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User ID is required' }),
        }
    }

    if (typeof data !== 'object') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data is invalid' }),
        }
    }

    try {
        const TableName = 'Schedules'
        // get current schedules by userId
        let params = {
            TableName: TableName,
            Key: { userId: userId }
        }
        const result = await docClient.send(new GetCommand(params));
        
        if (result.Item) {
            // merge the new schedule with existing schedule 
            const schedules = Object.assign({}, result.Item.schedules, data)
            console.log('Updating schedule:', schedules)
            params = {
                TableName: TableName,
                Key: { userId: userId },
                UpdateExpression: 'SET #s = :schedules',
                ExpressionAttributeNames: { '#s': 'schedules' },
                ExpressionAttributeValues: {
                    ':schedules': schedules,
                },
                ReturnValues: 'ALL_NEW'
            }
            const command = new UpdateCommand(params)
            docClient.send(command)
        }
        else {
            // Create new schedules with userId
            const item = { userId, schedules: data }
            console.log('Creating new item:', item)
            params = {
                TableName: TableName,
                Item: item
            }
            
            const command = new PutCommand(params)
            docClient.send(command)
        }

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Schedule created successfully' }),
        };
    }
    catch (err) {
        console.error('DynamoDB Error:', err);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Could not update schedule' }),
        };
      }
};