import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import CdkDotNetWebAppEbPipeline = require('../lib/cdk_dot_net_web_app_eb_pipeline-stack');

// test('Empty Stack', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new CdkDotNetWebAppEbPipeline.CdkDotNetWebAppEbPipelineStack(app, 'MyTestStack');
//     // THEN
//     expectCDK(stack).to(matchTemplate({
//       "Resources": {}
//     }, MatchStyle.EXACT))
// });
