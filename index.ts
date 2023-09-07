import { Converter, Application } from 'typedoc';
import { processComments } from "./src/process-comments";

export function load(application: Application) {
	application.converter.on(Converter.EVENT_RESOLVE_BEGIN, processComments);
}
