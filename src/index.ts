import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { Dialog, Users } from "enmity/metro/common";
import { reload } from "enmity/api/native";

const FluxDispatcher = getByProps("_currentDispatchActionType");
const SerializedExperimentStore = getByProps("getSerializedState");

const EnableStaging: Plugin = {
  name: "EnableStaging",
  version: "3.0.2",
  description: "Provides you access to staff-only features by assigning you pseudo-staff.",
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
    function enableExperiments() {
      try {
        Users.getCurrentUser().flags |= 1;

        (Users as any)._dispatcher._actionHandlers
          ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
          .forEach(m => {
            m.name.includes("Experiment") &&
              m.actionHandler({
                serializedExperimentStore: SerializedExperimentStore.getSerializedState(),
                user: { flags: 1 },
              });
          });
      } catch(e) {
        const err = new Error(e)
        console.error(err.stack);
      }
    };

    if (Users.getCurrentUser()) {
      enableExperiments()
    } else {
      function event() {
        FluxDispatcher.unsubscribe("CONNECTION_OPEN", event);
        enableExperiments();
      };

      FluxDispatcher.subscribe("CONNECTION_OPEN", event);
    }
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
