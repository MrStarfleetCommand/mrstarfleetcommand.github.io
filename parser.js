function txtToHtml(txt, pathPrefix){
	pathPrefix = pathPrefix ? pathPrefix.replace(/^\/*/, '/') : '';
	txt = txt.trim();
	txt = txt.replace(/</g, '&lt;');
	processor(txt);
	/*
	html = html.replace(new RegExp(`^ *\\* *(?:\\{${htmlAttributes('value', 'class', 'id', 'title')} *\\} *)?(.*?[^\\s]) *$`, 'gmi'), '<li $1>$2</li>');
	html = html.replace(new RegExp(`^\\{ *${htmlAttributes('class', 'id')} *\\n((?:<li .*?>.+</li>\\n*)+)\\n\\} *$`, 'gm'), '<ul $1>$2</ul>');
	html = html.replace(/&lt;!--([^]*?)-->/g, '<!--$1-->');
	html = html.replace(/^ *([^<\s].*?) *$/gm, '<p>$1</p>');
	html = html.replace(/\s+/g, ' ');
	html = html.split(/\[\[(.+?)\]\]/);

	for (let i = 1; i < html.length; i += 2){
		const linkParts = html[i].split('|');
		const displayText = linkParts[1] || linkParts[0].split('/').at(-1);
		let href = linkParts[0];
		href = href[0] === '/' && href[1] !== '/' ? href : `${pathPrefix}/${href}`;
		href = href.toLowerCase();
		href = href.normalize('NFD').replace(/\p{Diacritic}/gu, '');
		href = href.replace(/[\s\u2013\u2014]/g, '-');
		href = href.replace(/([a-zA-Z])\.(?!html$|txt$|css$|js$)/g, '$1');
		href = href.replace(/['":;,]/g, '');
		html[i] = `<a href="${href}">${displayText}</a>`;
	}

	html = html.join('');
	html = html.replace(/\[ *([^\s"]+?) +(.+?) *\]/g, '<a href="$1" class="external-link">$2</a>');
	return html;
	*/
}

function htmlToTxt(html){
	let txt = html;
	txt = txt.replace(/\s*<h6 class="heading">(.+?)<\/h6>\s*/g, '\n====== $1 ======\n');
	txt = txt.replace(/\s*<h5 class="heading">(.+?)<\/h5>\s*/g, '\n===== $1 =====\n');
	txt = txt.replace(/\s*<h4 class="heading">(.+?)<\/h4>\s*/g, '\n==== $1 ====\n');
	txt = txt.replace(/\s*<h3 class="heading">(.+?)<\/h3>\s*/g, '\n=== $1 ===\n');
	txt = txt.replace(/\s*<h2 class="heading">(.+?)<\/h2>\s*/g, '\n== $1 ==\n');
	txt = txt.replace(/\s*<p>(.+?)<\/p>\s*/g, '\n\n$1\n\n');
	txt = txt.replace(/<span class="bold">(.+?)<\/span>/g, `'''$1'''`);
	txt = txt.replace(/<span class="italic">(.+?)<\/span>/g, `''$1''`);
	txt = txt.replace(/\n\n\n+/g, '\n\n');
	txt = txt.replace(/^(==+ .+? ==+\n)\n/gm, '$1');
	txt = txt.replace(/^\s+/, '');
	txt = txt.replace(/\s+$/, '');
	// TODO: Add full support for decoding HTML links
	txt = txt.replace(/<a href="(.+?)"(?: class="external-link")?>(.+?)<\/a>/g, '[$1 $2]');
	return txt;
}

async function fetchSourceText(){
	let sourcePage = `${location.pathname}.txt`;
	if (location.pathname.at(-1) === '/'){
		sourcePage = `${location.pathname}index.txt`;
	} else if (location.pathname.split('.').at(-1) === 'html'){
		sourcePage = location.pathname.split('.').toSpliced(-1, 1, 'txt').join('.');
	}
	return await (await fetch(sourcePage)).text();
}

function processor(txt, html = '', isUnclosed = {}){
	const c0 = txt[0];
	const c1 = txt[1];
	const c2 = txt[2];
	const c3 = txt[3];
	const c4 = txt[4];
	const c5 = txt[5];
	const c6 = txt[6];

	if (c0 === '\n'){
		isUnclosed.h6 = false;
		isUnclosed.h5 = false;
		isUnclosed.h4 = false;
		isUnclosed.h3 = false;
		isUnclosed.h2 = false;
		isUnclosed.bold = false;
		isUnclosed.italic = false;
	}

	if (/^`(?!`).+?(?<![`\\])`(?!`)/.test(txt)){
		html += `<code class="markup">${decode(txt.replace(/^`(.+?)(?<![`\\])`(?!`)[^]*$/, '$1'))}</code>`;
		txt = txt.replace(/^`.+?(?<![`\\])`(?!`)/, '');
	} else if (/^```.+?(?<!\\)```/.test(txt)){
		html += `<pre class="markup">${decode(txt.replace(/^```\s*(.+?)\s*(?<!\\)```[^]*$/, '$1'))}</pre>`;
		txt = txt.replace(/^```.+?(?<!\\)```/, '');
	} else if (c0 === '\n' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '=' && c5 === '=' && c6 === '='){
		html += '<h6 class="heading">';
		txt = txt.replace(/^\n====== */, '');
		isUnclosed.h6 = true;
	} else if (c0 === '=' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '=' && c5 === '=' && c6 === '\n' && isUnclosed.h6){
		html += '</h6>';
		txt = txt.replace(/^======/, '');
		isUnclosed.h6 = false;
	} else if (c0 === '\n' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '=' && c5 === '='){
		html += '<h5 class="heading">';
		txt = txt.replace(/^\n===== */, '');
		isUnclosed.h5 = true;
	} else if (c0 === '=' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '=' && c5 === '\n' && isUnclosed.h5){
		html += '</h5>';
		txt = txt.replace(/^=====/, '');
		isUnclosed.h5 = false;
	} else if (c0 === '\n' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '='){
		html += '<h4 class="heading">';
		txt = txt.replace(/^\n==== */, '');
		isUnclosed.h4 = true;
	} else if (c0 === '=' && c1 === '=' && c2 === '=' && c3 === '=' && c4 === '\n' && isUnclosed.h4){
		html += '</h4>';
		txt = txt.replace(/^====/, '');
		isUnclosed.h4 = false;
	} else if (c0 === '\n' && c1 === '=' && c2 === '=' && c3 === '='){
		html += '<h3 class="heading">';
		txt = txt.replace(/^\n=== */, '');
		isUnclosed.h3 = true;
	} else if (c0 === '=' && c1 === '=' && c2 === '=' && c3 === '\n' && isUnclosed.h3){
		html += '</h3>';
		txt = txt.replace(/^===/, '');
		isUnclosed.h3 = false;
	} else if (c0 === '\n' && c1 === '=' && c2 === '='){
		html += '<h2 class="heading">';
		txt = txt.replace(/^\n== */, '');
		isUnclosed.h2 = true;
	} else if (c0 === '=' && c1 === '=' && c2 === '\n' && isUnclosed.h2){
		html += '</h2>';
		txt = txt.replace(/^==/, '');
		isUnclosed.h2 = false;
	} else if (c0 === "'" && c1 === "'" && c2 === "'"){
		if (isUnclosed.bold){
			html += '</span>';
			txt = txt.replace(/^'''/, '');
			isUnclosed.bold = false;
		} else {
			html += '<span class="bold">';
			txt = txt.replace(/^''' */, '');
			isUnclosed.bold = true;
		}
	} else if (c0 === "'" && c1 === "'"){
		if (isUnclosed.italic){
			html += '</span>';
			txt = txt.replace(/^''/, '');
			isUnclosed.italic = false;
		} else {
			html += '<span class="italic">';
			txt = txt.replace(/^'' */, '');
			isUnclosed.italic = true;
		}
	}

	processor(txt, html, isUnclosed);
}

function htmlAttributes(...allowList){
	return `((?: *(?:${allowList.join('|')})(?: *= *".*?")?)*)`;
}

function decode(txt){
	return txt.replace(/\\(.)/g, '$1');
}

export {txtToHtml, htmlToTxt, fetchSourceText};
