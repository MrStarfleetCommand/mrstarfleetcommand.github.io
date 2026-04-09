/*
import {txtToHtml, htmlToTxt} from '/parser.js';
(async () => {
	const sourcePage = `${location.pathname.replace(/\/+$/, '')}/index.html`.replace(/\.html(?:\/index\.html)?$/, '.txt');
	const txt = await (await fetch(sourcePage)).text();
	const contentArea = document.createElement('div');
	const pageHeading = document.createElement('h2');
	const parserOutput = document.createElement('div');

	pageHeading.innerText = document.title;
	parserOutput.id = 'parser-output';
	parserOutput.innerHTML = txtToHtml(txt);
	contentArea.classList.add('content-area', 'scrollbox');
	contentArea.appendChild(pageHeading);
	contentArea.appendChild(parserOutput);
	document.body.append(contentArea);
})();
*/
