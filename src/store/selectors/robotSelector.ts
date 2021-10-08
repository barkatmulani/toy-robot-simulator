import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "..";
import { IAppState } from "../slices/robotSlice";

export const appSelector = (state: RootState) => state.robot;

export const selectLog = createSelector(
    [appSelector],
    (state: IAppState) => state.log
);

export const selectPlacement = createSelector(
    [appSelector],
    (state: IAppState) => state.robotPlacement
);