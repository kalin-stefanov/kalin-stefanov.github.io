import {
  WacActivityIndicatorController,
  WacActivityIndicatorView,
} from "web-accessible-components";
import { bootstrapStore, StoreProvider } from "./ui/state/store";
import {
  AuslanHandsContainerController,
  AuslanPromptDisplayController,
} from "auslan-spell";
import { eventGroup } from "./ui/components/event-group";
import { buildPlaybackControls } from "./ui/components/playback";

// Bootstrapping

const container = document.getElementById("app");
if (!container) {
  throw new Error("App div was undefiend");
}

const controlsContainer = document.getElementById("controls");
if (!controlsContainer) {
  throw new Error("Controls div was undefiend");
}

const indicator = new WacActivityIndicatorController(
  new WacActivityIndicatorView(),
  eventGroup,
)
  .build()
  .attachTo(container);

await bootstrapStore(container);

indicator.detachFrom(container).demolish();

// Model, controls, and prompt

const store = StoreProvider.store;

new AuslanPromptDisplayController(store.handsController, eventGroup)
  .build()
  .attachTo(container);

new AuslanHandsContainerController(store.scene, eventGroup)
  .build()
  .attachTo(container);

store.handsController.setSpeedMultiplier(0.75);

const controls = buildPlaybackControls(store.handsController, eventGroup);
controls.attachTo(controlsContainer);
