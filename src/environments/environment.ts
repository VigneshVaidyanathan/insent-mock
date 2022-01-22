// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  webSocketUrl:
    'ws://ws-mt1.pusher.com/app/67bb469433cb732caa7a?protocol=7&client=js&version=6.0.3&flash=false',
  insent: {
    botId: 'V9WxVwHha8pFPNCMz2PK',
    baseApi: 'https://insentrecruit.api.insent.ai/',
  },
};
