#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkDotNetWebAppEbPipelineStack } from '../lib/cdk_dot_net_web_app_eb_pipeline-stack';

const app = new cdk.App();
new CdkDotNetWebAppEbPipelineStack(app, 'CdkDotNetWebAppEbPipelineStack');
