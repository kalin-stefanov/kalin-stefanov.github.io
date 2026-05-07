import {
  AuslanAnimationScrubberController,
  AuslanClearButtonController,
  AuslanPlayButtonController,
  AuslanPromptInputController,
  AuslanRestartButtonController,
  AuslanSpeedButtons,
  auslanSignTokens,
  type AuslanSignToken,
  type SignTokenCombination,
} from "auslan-spell";
import type { HandsController } from "../state/store";
import {
  WacStackController,
  WacStackView,
  type WacEventGroup,
  type WacThemeEvent,
} from "web-accessible-components";

export function buildPlaybackControls(
  controller: HandsController,
  eventGroup: WacEventGroup<WacThemeEvent>,
) {
  const slider = new AuslanAnimationScrubberController(controller, eventGroup);

  const input = new AuslanPromptInputController(
    controller,
    eventGroup,
    (str: string) => {
      const tokens = str
        .toLowerCase()
        .split("")
        .filter((char) => {
          const token = char as AuslanSignToken;
          return auslanSignTokens.includes(token);
        });
      return tokens as SignTokenCombination<AuslanSignToken>;
    },
  );

  const play = new AuslanPlayButtonController(controller, eventGroup).flex(2);
  const restart = new AuslanRestartButtonController(
    controller,
    eventGroup,
  ).flex(1);
  const clear = new AuslanClearButtonController(controller, eventGroup).flex(1);

  const buttonStack = new WacStackController(new WacStackView())
    .horizontal()
    .append(play)
    .append(restart)
    .append(clear)
    .build();

  const multipliers = [0.25, 0.75, 1, 1.5, 2];
  const speeds = new AuslanSpeedButtons(multipliers, controller, eventGroup);

  // Stacks auto-build children when the stack is build; hence, why none of the previous components are built
  const controlsStack = new WacStackController(new WacStackView())
    .vertical()
    .append(slider)
    .append(input)
    .append(buttonStack)
    .append(speeds)
    .build();

  return controlsStack;
}
