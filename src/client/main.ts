import { resolveLang, htmlLang } from "./lang.ts";
import { start } from "./page.ts";

const lang = resolveLang();
htmlLang(lang);
start(lang);
