x#!/bin/bash

# Setup CloudWatch monitoring for Zuno Amplify application
# This script creates CloudWatch alarms and dashboards for monitoring

echo "Setting up CloudWatch monitoring for Zuno application..."

# Get stack name and resources
STACK_NAME="amplify-zuno-dev"
REGION="us-east-2"

# Get AppSync API ID
APPSYNC_API_ID=$(aws appsync list-graphql-apis --region $REGION --query 'graphqlApis[?name==`zuno`].apiId' --output text)
echo "AppSync API ID: $APPSYNC_API_ID"

# Get DynamoDB table names
DYNAMODB_TABLES=$(aws dynamodb list-tables --region $REGION --query 'TableNames[?contains(@, `zuno`) || contains(@, `Zuno`)]' --output text)
echo "DynamoDB Tables: $DYNAMODB_TABLES"

# Get CloudFront Distribution ID
CLOUDFRONT_ID=$(aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Origins.Items[0].DomainName, `zuno-hosting-bucket`)].Id' --output text)
echo "CloudFront Distribution ID: $CLOUDFRONT_ID"

# Create CloudWatch Dashboard
cat > /tmp/dashboard-config.json << EOF
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/AppSync", "4XXError", "GraphQLAPIId", "$APPSYNC_API_ID" ],
          [ ".", "5XXError", ".", "." ],
          [ ".", "Latency", ".", "." ],
          [ ".", "ConnectCount", ".", "." ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "$REGION",
        "title": "AppSync API Metrics",
        "period": 300
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/CloudFront", "Requests", "DistributionId", "$CLOUDFRONT_ID" ],
          [ ".", "BytesDownloaded", ".", "." ],
          [ ".", "4xxErrorRate", ".", "." ],
          [ ".", "5xxErrorRate", ".", "." ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "CloudFront Distribution Metrics",
        "period": 300
      }
    }
  ]
}
EOF

# Create the dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "Zuno-Application-Monitoring" \
  --dashboard-body file:///tmp/dashboard-config.json \
  --region $REGION

echo "CloudWatch dashboard created: Zuno-Application-Monitoring"

# Create CloudWatch Alarms
echo "Creating CloudWatch alarms..."

# AppSync 4XX Error Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Zuno-AppSync-4XX-Errors" \
  --alarm-description "High 4XX error rate in AppSync API" \
  --metric-name "4XXError" \
  --namespace "AWS/AppSync" \
  --statistic "Sum" \
  --period 300 \
  --threshold 10 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2 \
  --dimensions Name=GraphQLAPIId,Value=$APPSYNC_API_ID \
  --region $REGION

# AppSync 5XX Error Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Zuno-AppSync-5XX-Errors" \
  --alarm-description "High 5XX error rate in AppSync API" \
  --metric-name "5XXError" \
  --namespace "AWS/AppSync" \
  --statistic "Sum" \
  --period 300 \
  --threshold 5 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 1 \
  --dimensions Name=GraphQLAPIId,Value=$APPSYNC_API_ID \
  --region $REGION

# AppSync High Latency Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Zuno-AppSync-High-Latency" \
  --alarm-description "High latency in AppSync API" \
  --metric-name "Latency" \
  --namespace "AWS/AppSync" \
  --statistic "Average" \
  --period 300 \
  --threshold 5000 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 3 \
  --dimensions Name=GraphQLAPIId,Value=$APPSYNC_API_ID \
  --region $REGION

# CloudFront 4XX Error Rate Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "Zuno-CloudFront-4XX-Errors" \
  --alarm-description "High 4XX error rate in CloudFront" \
  --metric-name "4xxErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic "Average" \
  --period 300 \
  --threshold 5 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2 \
  --dimensions Name=DistributionId,Value=$CLOUDFRONT_ID \
  --region us-east-1

echo "CloudWatch alarms created successfully!"
echo "Monitoring setup complete. Check the AWS Console for:"
echo "- Dashboard: Zuno-Application-Monitoring"
echo "- Alarms: Zuno-AppSync-* and Zuno-CloudFront-*"