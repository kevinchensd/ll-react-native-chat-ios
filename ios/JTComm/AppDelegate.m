/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <NIMSDK/NIMSDK.h>
#import "NTESSDKConfigDelegate.h"
//#import "RCTLinkingManager.h"

#import "DWCustomAttachmentDecoder.h"
#import <AMapFoundationKit/AMapFoundationKit.h>
#import "RCCManager.h"



@interface AppDelegate ()
@property (nonatomic,strong) NTESSDKConfigDelegate *sdkConfigDelegate;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AMapServices sharedServices].apiKey = @"3d4d1e79ba0e513fd975fb238dfab942";

  /*
   * 原项目code保留
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"JTComm"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  */
  
  /*
   * react-native-chat-demo代码
   
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  */
  
  // react-native-navigation代码
  // https://github.com/wix/react-native-navigation/blob/master/example/ios/example/AppDelegate.m
  
  NSURL *jsCodeLocation;
  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];

  
  //上面有原其他代码，在return YES 命令前面写
  [self setupNIMSDK];
  [self registerAPNs];
  if (launchOptions) {//未启动时，点击推送消息
    NSDictionary * remoteNotification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (remoteNotification) {
      [self performSelector:@selector(clickSendObserve:) withObject:remoteNotification afterDelay:0.5];
    }
  }
  
  return YES;
}

- (void)clickSendObserve:(NSDictionary *)dict{
  [[NSNotificationCenter defaultCenter]postNotificationName:@"ObservePushNotification" object:@{@"dict":dict,@"type":@"launch"}];
}
- (void)setupNIMSDK
{
  //在注册 NIMSDK appKey 之前先进行配置信息的注册，如是否使用新路径,是否要忽略某些通知，是否需要多端同步未读数
  self.sdkConfigDelegate = [[NTESSDKConfigDelegate alloc] init];
  [[NIMSDKConfig sharedConfig] setDelegate:self.sdkConfigDelegate];
  [[NIMSDKConfig sharedConfig] setShouldSyncUnreadCount:YES];
  //appkey 是应用的标识，不同应用之间的数据（用户、消息、群组等）是完全隔离的。
  //注册APP，请将 NIMSDKAppKey 换成您自己申请的App Key
  [[NIMSDK sharedSDK] registerWithAppID:@"53b9ee6515d4d7286704dda229f95a67" cerName:@"wztestp12"];
  //注册自定义消息的解析器
  [NIMCustomObject registerCustomDecoder:[DWCustomAttachmentDecoder new]];
}
#pragma mark - misc

- (void)registerAPNs
{
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  UIUserNotificationType types = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:settings];

}

- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [[NIMSDK sharedSDK] updateApnsToken:deviceToken];
}

//在后台时处理点击推送消息
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
  
  [[NSNotificationCenter defaultCenter]postNotificationName:@"ObservePushNotification" object:@{@"dict":userInfo,@"type":@"background"}];
}
- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  NSLog(@"fail to get apns token :%@",error);
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
  NSInteger count = [[[NIMSDK sharedSDK] conversationManager] allUnreadCount];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:count];
}
@end
