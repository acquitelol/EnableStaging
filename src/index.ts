import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { Dialog, Users } from "enmity/metro/common";
import { reload } from "enmity/api/native";

const EnableStaging: Plugin = {
  name: "EnableStaging",
  version: "3.0.1",
  description: "Bypasses experiment gate. Fuck you aj.",
  authors: [
    {
      name: "dia ♡",
      id: "696828906191454221",
    },
    {
      name: "Rosie<3",
      id: "581573474296791211"
    }
  ],
  color: "#2F3136",

  onStart() {
    let attempts = 0;
    const maxAttempts = 20;
    const timeoutTime = 25;

    const main = () => {
      try {
        const SerializedExperimentStore = getByProps("getSerializedState");

        if (!Users.getCurrentUser()) {
          if (attempts++ >= maxAttempts) return console.error(`[EnableStaging] Attempted ${maxAttempts} times and current user is still undefined. Giving up.`)

          console.warn(`[EnableStaging] Current user has not initialized yet! Trying again in ${timeoutTime}ms.`);
          return setTimeout(() => main(), timeoutTime)
        }

        (Users.getCurrentUser().flags |= 1),
          (Users as any)._dispatcher._actionHandlers
            ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
            .forEach(function (m) {
              m.name.includes("Experiment") &&
                m.actionHandler({
                  serializedExperimentStore: SerializedExperimentStore.getSerializedState(),
                  user: { flags: 1 },
                });
            });
      } catch(e) {
        const err = new Error(e)
        console.error(err.stack);
        setTimeout(() => main(), 1000);
      }
    };

    setTimeout(() => main(), 500)
  },

  onStop() {
    Dialog.show({
      title: "Experiments Disabled.",
      body: "Disabling Experiments requires a restart, would you like to restart Discord?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: reload,
    });
  },
};

registerPlugin(EnableStaging);
