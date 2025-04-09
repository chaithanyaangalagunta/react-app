const { getMyIp } = require("./server-actions/getMyIp.js");
const { getMyLocation } = require("./server-actions/getMyLocation.js");
const axios = require("axios");
const onSampleServerAction = require("./server-actions/onSampleServerAction.js");

const WEBHOOK_SITE =
  "https://webhook.site/2e8a9eb0-2183-441b-be46-d259d4b2283e";

const serverActions = [
  {
    name: "getMyIp",
    description: "This is a sample server action",
    run: getMyIp,
    inputFields: () => {
      return [
        {
          name: "type",
          label: "Type",
          type: "SINGLE_SELECT",
          required: true,
          rerenderAllFields: false,
          defaultValue: "v4",
          hidden: false,
          secure: false,
          metaData: {
            options: [
              {
                label: "v4",
                value: "v4",
              },
              {
                label: "v6",
                value: "v6",
              },
            ],
          },
        },
      ];
    },
    triggers: ["CRON", "FE"],
    scope: ["PROJECTS", "TASKS", "ACCOUNTS"],
  },
  {
    name: "getMyLocation",
    description: "This is a sample server action",
    run: getMyLocation,
  },
  {
    name: "onSampleServerAction",
    description: "This is a sample server action",
    run: onSampleServerAction.run,
  },
];

const widgets = [
  {
    location: ["project_tab"],
    name: "Projects Tab Sample",
    description: "This is a sample widget for the projects tab",
    icon: "widgets/public/icon.svg",
    entrypoint: {
      html: "dist/index.html",
    },
    identifier: "projects-tab-sample-widget",
    // config: "inputs/projects-tab-sample.js",
  },
  {
    location: ["customer_portal_widget", "project_tab"],
    name: "Location and Ip widget",
    description: "This is a sample widget for the projects tab",
    icon: "widgets/public/icon.svg",
    entrypoint: {
      html: "dist/index.html",
    },
    identifier: "location-widget",
    inputFields: () => {
      return [
        {
          name: "type",
          label: "Type",
          type: "SINGLE_SELECT",
          required: true,
          rerenderAllFields: false,
          defaultValue: "v4",
          hidden: false,
          secure: false,
          metaData: {
            options: [
              {
                label: "v4",
                value: "v4",
              },
              {
                label: "v6",
                value: "v6",
              },
            ],
          },
        },
      ];
    },
  },
  {
    location: ["accounts_tab"],
    label: "Accounts Tab Sample",
    description: "This is a sample widget for the accounts tab",
    icon: "widgets/public/icon.svg",
    name: "Accounts Tab Sample",
    entrypoint: {
      html: "dist/index.html",
    },
    identifier: "accounts-tab-sample-widget",
    // config: "inputs/accounts-tab-sample.js",
  },
];


module.exports = {
  widgets,
  serverActions,
  version: "1003.0.3",
  installationFields: () => {
    return [
      {
        name: "apiKeySecure",
        label: "API Key",
        type: "AUTH_API_KEY",
        required: true,
        rerenderAllFields: false,
        hidden: false,
        secure: true,
      },
      {
        name: "Sample text field",
        label: "Sample text field",
        type: "TEXT",
        required: true,
        rerenderAllFields: false,
        defaultValue: "Hello world",
        hidden: false,
        secure: false,
        metaData: {
          textFieldMeta: {
            prefix: "Prefix",
            suffix: "Suffix",
          },
        },
      },
      {
        name: "ss0",
        label: "Sample select field 0",
        type: "SINGLE_SELECT",
        required: true,
        rerenderAllFields: false,
        defaultValue: "option1",
        hidden: false,
        secure: false,
        metaData: {
          options: [
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
          ],
        },
      },
      {
        name: "ss1",
        label: "Sample select field - 1",
        type: "SINGLE_SELECT",
        required: true,
        rerenderAllFields: false,
        hidden: false,
        secure: false,
        metaData: {
          options: () => {
            return [
              {
                label: "Option 1",
                value: "option1",
              },
              {
                label: "Option 2",
                value: "option2",
              },
            ];
          },
        },
      },
      {
        name: "ss2",
        label: "Sample select field - 2",
        type: "SINGLE_SELECT",
        required: true,
        rerenderAllFields: false,
        hidden: false,
        secure: false,
        metaData: {
          options: async () => {
            const response = await axios.get(
              "https://jsonplaceholder.typicode.com/users"
            );
            return response.data.map((user) => ({
              label: user.name,
              value: user.id,
            }));
          },
        },
      },
      {
        name: "Sample number field",
        label: "Sample number field",
        type: "NUMBER",
        required: true,
        rerenderAllFields: false,
        defaultValue: 10,
        secure: true,
        hidden: false,
        metaData: {
          range: {
            min: 0,
            max: 100,
          },
        },
      },
    ];
  },
  clientEvents: "./client-events.js",
  eventHandlers: {
    onAppInstall: {
      run: async (r, args) => {
        console.log("onAppInstall", r, args);
        const installation = r.installation;
        const appInstallationWebhook = installation.appInstallationWebhook;
        const webhookUrl = appInstallationWebhook.webhookUrl;

        axios.post(WEBHOOK_SITE, {
          message: "Hello world",
          webhookUrl,
          installation,
        });

        try {
          await r.schedule.scheduleAppJobs({
            schedulerName: "sa1",
            scheduledAt: Math.floor(Date.now() / 1000) + 20,
          });
        } catch (e) {
          r.logger.log("Error scheduling app jobs", e);
        }
      },
    },
    onAppUninstall: {
      run: (r, args) => {
        console.log("onAppUninstall", r, args);
      },
    },
    onEvent: {
      run: (r, args) => {
        console.log("onEvent", r, args);
      },
    },
  },
  scheduledActions: [
    {
      name: "sa1",
      run: async (r, args) => {
        const installation = r.installation;
        const appInstallationWebhook = installation.appInstallationWebhook;
        const webhookUrl = appInstallationWebhook.webhookUrl;

        axios.post(webhookUrl, {
          message: "Hello world",
          webhookUrl,
        });
      },
      nextExecution: async (r, args) => {
        const count = await r.kv.getAppValue("count-of-sa1");

        if (count === 10) {
          return -1;
        }

        if (!count) {
          await r.kv.setAppValue("count-of-sa1", 0);
        }
        const newCount = count + 1;
        await r.kv.setAppValue("count-of-sa1", newCount);
        return Math.floor(Date.now() / 1000) + 30;
      },
    },
  ],
};
