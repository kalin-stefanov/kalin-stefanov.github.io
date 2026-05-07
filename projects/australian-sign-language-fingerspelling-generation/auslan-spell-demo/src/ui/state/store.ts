import {
  AuslanDefaultHandsController,
  AuslanDefaultScene,
  type AuslanCameraControls,
  type AuslanModelController,
  type AuslanPlaybackController,
  type AuslanPromptController,
  type AuslanScene,
  type AuslanSpeedController,
  type AuslanSignToken,
  type AuslanElapsedTimeController,
} from "auslan-spell";
import {
  SESSION_2_REALISTIC,
  type AuslanModel,
} from "../auslan/models/session2-realistic";

export type HandsController = AuslanModelController<AuslanSignToken> &
  AuslanSpeedController &
  AuslanPromptController<AuslanSignToken> &
  AuslanPlaybackController &
  AuslanElapsedTimeController;

interface Store {
  readonly handsController: HandsController;
  readonly scene: AuslanScene;
  readonly rightHandedRealistic: AuslanModel;
}

class GlobalStore implements Store {
  public readonly handsController: HandsController;
  public readonly scene: AuslanScene;
  public readonly rightHandedRealistic: AuslanModel;

  public constructor(
    handsController: HandsController,
    sceneController: AuslanScene & AuslanCameraControls,
    rightHandedRealistic: AuslanModel,
  ) {
    this.handsController = handsController;
    this.scene = sceneController;
    this.rightHandedRealistic = rightHandedRealistic;
  }
}

export class StoreProvider {
  private static _store?: Store;

  public static set store(store: Store) {
    this._store = store;
  }

  public static get store(): Store {
    if (!this._store) throw new Error();
    return this._store;
  }
}

export async function bootstrapStore(container: HTMLElement) {
  const rightHandedRealistic = SESSION_2_REALISTIC;

  const scene = new AuslanDefaultScene(
    container.offsetWidth,
    container.offsetHeight,
  ).initAnimationCycle();
  const controller = new AuslanDefaultHandsController(scene, [
    rightHandedRealistic,
  ]);

  await controller.setActiveModel(SESSION_2_REALISTIC);

  const store = new GlobalStore(controller, scene, rightHandedRealistic);

  StoreProvider.store = store;
}
