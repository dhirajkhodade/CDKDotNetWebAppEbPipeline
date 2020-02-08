import cdk = require("@aws-cdk/core");
import codecommit = require("@aws-cdk/aws-codecommit");
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
import awsEcr = require("@aws-cdk/aws-ecr");
import elasticbeanstalk = require("@aws-cdk/aws-elasticbeanstalk");
import { ElasticBeanStalkDeployAction } from "./ElasticBeanstalkDeployAction";

export class CdkDotNetWebAppEbPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Source code repository
    const sourceCodeRepo = codecommit.Repository.fromRepositoryName(
      this,
      "MVCAppRepo",
      "Sample-msf-eb-app"
    );
    //Custom docker image for .net build tools environment
    //TODO: Need to store repo id and account specific repo url somewhere else and remove hard coding.
    const ecrRepo = awsEcr.Repository.fromRepositoryArn(
      this,
      "121212121212",
      "arn:aws:ecr:us-east-1:121212121212:repository/vs_build_tools2017"
    );

    //Creating build enviroment using custom docker image
    const cdkBuild = new codebuild.PipelineProject(this, "CdkBuild", {
      description: "AWS build project for .Net web applications",
      environment: {
        buildImage: codebuild.WindowsBuildImage.fromEcrRepository(
          ecrRepo,
          "latest"
        )
      }
    });

    //Artifact stores for each pipeline stage
    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact();

    //Adding stages to code pipeline
    //No need for deploy stage as buildspec.yml file in code repo will be deploying final Publish directory to target S3 bucket i.e. sample-click-once-dev
    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: "CodeCommit_Source",
              repository: sourceCodeRepo,
              output: sourceOutput
            })
          ]
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "cdkBuild",
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput]
            })
          ]
        }
      ]
    });

    //As we are planning to deploy to Elastic Beanstalk we will create EB Environment for ourapplication before adding deploy stage

    //objects for access parameters
    const node = this.node;
    const platform = node.tryGetContext("platform");
    const appName = "SampleDotNetMVCWebApp";

    const app = new elasticbeanstalk.CfnApplication(this, "EBApplication", {
      applicationName: appName
    });

    const elbEnv = new elasticbeanstalk.CfnEnvironment(this, "Environment", {
      environmentName: "SampleMVCEBEnvironment",
      applicationName: appName,
      platformArn: platform,
      solutionStackName: "64bit Windows Server 2012 R2 v2.5.0 running IIS 8.5"
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        //As Deploy to Elastic Beanstalk action feature is not yet release by AWS we have made our own custom action by implementing codepipeline.IAction interface
        //This custom AWS CodePipeline action to deploy artifact package to Elastic Beanstalk
        new ElasticBeanStalkDeployAction({
          actionName: "DeployToEB",
          applicationName: appName,
          environmentName: "SampleMVCEBEnvironment",
          input: cdkBuildOutput
        })
      ]
    });
  }
}
