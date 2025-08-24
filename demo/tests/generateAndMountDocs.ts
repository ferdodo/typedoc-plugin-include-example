import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { Application, TSConfigReader, TypeDocReader } from "typedoc";
import { load as loadPlugin } from "typedoc-plugin-include-example";

export async function generateAndMountDocs(options: {
	entryPoints: string[];
	htmlRelativePath: string;
	outDirName?: string;
	tsconfig?: string;
}): Promise<string> {
	const testId = `typedoc-docs-${Math.random().toString(36).slice(2)}`;
	const tmpBase = mkdtempSync(
		join(tmpdir(), "typedoc-plugin-include-example-"),
	);
	const outDir = join(tmpBase, options.outDirName ?? "docs");

	const app = await Application.bootstrap(
		{
			entryPoints: options.entryPoints,
			out: outDir,
			plugin: [],
			...(options.tsconfig && { tsconfig: options.tsconfig }),
		},
		[new TSConfigReader(), new TypeDocReader()],
	);

	loadPlugin(app);

	const project = await app.convert();
	if (!project) {
		throw new Error("TypeDoc project conversion failed");
	}

	await app.generateDocs(project, outDir);

	const htmlPath = join(outDir, options.htmlRelativePath);

	if (!existsSync(htmlPath)) {
		const files = readdirSync(outDir, { recursive: true });
		const htmlFiles = files.filter(
			(file: unknown) => typeof file === "string" && file.endsWith(".html"),
		);

		if (htmlFiles.length === 0) {
			throw new Error(
				`No HTML files found in ${outDir}. Available files: ${files.join(", ")}`,
			);
		}

		const fallbackPath = join(outDir, htmlFiles[0] as string);
		const html = readFileSync(fallbackPath, "utf8");
		return mountHtmlToDom(html, testId);
	}

	const html = readFileSync(htmlPath, "utf8");

	return mountHtmlToDom(html, testId);
}

function mountHtmlToDom(html: string, testId: string): string {
	const secondaryDom = new JSDOM(html);
	const mainDoc = globalThis.document;
	if (!mainDoc) {
		throw new Error("No global document. Configure vitest to use jsdom.");
	}

	const container = mainDoc.createElement("section");
	container.setAttribute("data-testid", testId);

	const body = secondaryDom.window.document.body;
	const importedBody = mainDoc.importNode(body, true) as HTMLElement;
	for (const child of Array.from(importedBody.childNodes)) {
		container.appendChild(child);
	}
	mainDoc.body.appendChild(container);

	return testId;
}
