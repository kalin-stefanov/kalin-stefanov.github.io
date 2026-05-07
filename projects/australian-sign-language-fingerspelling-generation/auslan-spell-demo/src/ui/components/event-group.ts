import {
  WacEventGroup,
  WacObservableStoredValue,
  type WacThemeEvent,
} from "web-accessible-components";
import { getTheme } from "../theme";

const theme = getTheme();
export const eventGroup = new WacEventGroup<WacThemeEvent>({
  theme: new WacObservableStoredValue(theme),
});
