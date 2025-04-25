Work schedule AWS Lambda functions
## Build and Run locally
```
npm install
npm run start
```
## APIs:
### Get schedule for an user Id
GET http://localhost:3000/schedules/?userId=<userId>
### Update schedule for an user Id
PUT http://localhost:3000/schedules/?userId=<userId>

## For deployment
Uploading functions in functions folder to AWS Lambda using AWS Console
