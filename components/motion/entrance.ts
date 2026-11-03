"use client";

import { createContext, useContext } from "react";

/** Stays true outside the preloader, so pages without it animate straight away. */
export const EntranceContext = createContext(true);

/** False while the preloader covers the page, which holds first-screen animations back for the reveal. */
export const useEntranceReady = () => useContext(EntranceContext);
