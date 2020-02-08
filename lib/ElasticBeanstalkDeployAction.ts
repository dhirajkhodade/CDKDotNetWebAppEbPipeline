import codepipeline = require("@aws-cdk/aws-codepipeline");
import events = require("@aws-cdk/aws-events");
import iam = require("@aws-cdk/aws-iam");
import { Construct } from "@aws-cdk/core";

export interface ElasticBeanStalkDeployActionProps
  extends codepipeline.CommonAwsActionProps {
  applicationName: string;

  environmentName: string;

  input: codepipeline.Artifact;
}

export class ElasticBeanStalkDeployAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private readonly props: ElasticBeanStalkDeployActionProps;

  constructor(props: ElasticBeanStalkDeployActionProps) {
    this.actionProperties = {
      ...props,
      provider: "ElasticBeanstalk",
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0
      },
      inputs: [props.input]
    };
    this.props = props;
  }

  public bind(
    _scope: Construct,
    _stage: codepipeline.IStage,
    options: codepipeline.ActionBindOptions
  ): codepipeline.ActionConfig {
    options.bucket.grantRead(options.role);
    options.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AWSElasticBeanstalkFullAccess"
        )
    );

    return {
      configuration: {
        ApplicationName: this.props.applicationName,
        EnvironmentName: this.props.environmentName
      }
    };
  }

  public onStateChange(
    _name: string,
    _target?: events.IRuleTarget,
    _options?: events.RuleProps
  ): events.Rule {
    throw new Error("unsupported");
  }
}
