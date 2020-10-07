# Welcome to your CDK TypeScript project!
This CDK application allows you to create aws pipeline which will build your .Net Framework based application using custom docker image
which has VS Build Tools in it for building .Net Framework apps and it will create Windows IIS Server Elastic Beanstalk environment i.e. Infrastructure and in Deploy step it will Deploy your application to  Elastic Beanstalk.
All of this will happen with only couple of command from your DEV machine :)

Full blog post on how to use this code - http://www.dontworrygeek.com/2020/02/cicd-pipeline-for-net-framework.html

## IMP commands to use cross account deployment feature
As of today there is no deploy action available in AWS CDK library to deploy to Elastic Beanstalk so in this CDK app we are creating our own "ElasticBeanStalkDeployAction" by implementing "IAction" interface from CDK library.

Considering you are creating this code pipeline in account-1 and your infrastructure i.e elastic beanstalk environment is in account-2 and you want your pipeline to deploy your application artifacts from account-1 to account-2 i.e. cross account deployment to elastic beanstalk (EB)



1] `npm install`

2] `npm run build`

3] `cdk synth`

Now we will have our stacks ready to be deployed and you will observe the output of "cdk synth" command 
will create two stacks 
"CdkDotNetWebAppEbPipelineStack" and "cross-account-support-stack-[account-2]"
Where account-2 is your destination aws account number where you have your elastic beanstalk environment running and this is where you are willing to deploy your application. 

So now lets deploy these stacks to respective account considering your pipeline is running in account-1 
and elastic beanstalk is in acount-2
so lets first deploy cross account support stack to account-2 so that when pipeline's deploy stage runs it should be able to communicate to account-2

                             
4] `cdk deploy --profile=prodProfile -e cross-account-support-stack-[account-2]`

In above command --profile options is to provide credentials for the account where you are willing to deploy given stack in my case "prodProfile" is aws credentials profile on my machine for account-2 
Second most important option is -e which tells cdk to deploy only given stack exclusively and don't include dependancies

At this point we have our EB account i.e. account-2 is configured and ready to accept deployment request from our pipeline in account-1

So lets deploy our pipeline stack in account-1 

5] `cdk deploy --profile=sharedAccountProfile -e CdkDotNetWebAppEbPipelineStack`

In above command "sharedAccountProfile" is aws credentials profile on my machine for account-1 where I am willing to deploy my code pipeline 

And that's it. We are Done!

Your pipeline from acount-1 should now deploy artifacts to EB environment in account-2