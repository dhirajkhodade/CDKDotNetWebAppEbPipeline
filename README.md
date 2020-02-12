# Welcome to your CDK TypeScript project!
This CDK application allows you to create aws pipeline which will build your .Net Framework based application using custom docker image
which has VS Build Tools in it for building .Net Framework apps and it will create Windows IIS Server Elastic Beanstalk environment i.e. Infrastructure and in Deploy step it will Deploy your application to  Elastic Beanstalk.
All of this will happen with only couple of command from your DEV machine :)

Full blog post on how to use this code - http://www.dontworrygeek.com/2020/02/cicd-pipeline-for-net-framework.html

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
