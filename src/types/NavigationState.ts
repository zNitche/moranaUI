import type { NavigationStateType } from "./NavigationStateType";

export default interface NavigationState {
    type: NavigationStateType;
    target?: string;
}
