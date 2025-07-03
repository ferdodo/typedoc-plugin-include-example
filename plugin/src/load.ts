import type { Application as ApplicationType } from "typedoc";
import { Application, Converter } from "typedoc";
import { processComments } from "./processComments.js";

export function load(application: ApplicationType) {
	application.on(Application.EVENT_BOOTSTRAP_END, () => {
		application.options.setValue("blockTags", [
			...new Set([
				...application.options.getValue("blockTags"),
				"@includeExample",
			]),
		]);
	});

	application.converter.on(Converter.EVENT_RESOLVE_BEGIN, processComments);
}
