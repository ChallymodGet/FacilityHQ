export const THEME_STORAGE_KEY = "facilityhq.theme";

/** Runs before hydration so the saved theme is applied without a light flash. */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;
