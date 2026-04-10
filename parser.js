function txtToHtml(txt, pathPrefix = ''){
	let html = txt;
	html = html.replace(/</g, '&lt;');
	html = html.replace(/^\s+/, '');
	html = html.replace(/\s+$/, '');
	html = html.replace(new RegExp(`^ *\\* *(?:\\{${htmlAttributes('value', 'class', 'id', 'title')} *\\} *)?(.*?[^\\s]) *$`, 'gmi'), '<li $1>$2</li>');
	html = html.replace(new RegExp(`^\\{ *${htmlAttributes('class', 'id')} *\\n((?:<li .*?>.+</li>\\n*)+)\\n\\} *$`, 'gm'), '<ul $1>$2</ul>');
	html = html.replace(/^(======) *(.+?) *\1 *$/gm, '<h6 class="heading">$2</h6>');
	html = html.replace(/^(=====) *(.+?) *\1 *$/gm, '<h5 class="heading">$2</h5>');
	html = html.replace(/^(====) *(.+?) *\1 *$/gm, '<h4 class="heading">$2</h4>');
	html = html.replace(/^(===) *(.+?) *\1 *$/gm, '<h3 class="heading">$2</h3>');
	html = html.replace(/^(==) *(.+?) *\1 *$/gm, '<h2 class="heading">$2</h2>');
	html = html.replace(/^ *([^<\s].*?) *$/gm, '<p>$1</p>');
	html = html.replace(/''' *([^'].*?) *'''/g, '<span class="bold">$1</span>');
	html = html.replace(/'' *([^'].*?) *''/g, '<span class="italic">$1</span>');
	html = html.replace(/\s+/g, ' ');
	html = html.replace(/&lt;!--([^]*?)-->/g, '<!--$1-->');
	html = html.split(/\[\[(.+?)\]\]/);

	for (let i = 1; i < html.length; i += 2){
		const linkParts = html[i].split('|');
		const displayText = linkParts[1] || linkParts[0].replace(/^.*?([^/]+)\/*$/, '$1');
		let href = linkParts[0];
		pathPrefix = pathPrefix ? pathPrefix.replace(/^\/*/, '/') : '';
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
		// TODO: Simplify with `toSpliced()`
		sourcePage = location.pathname.split('.');
		sourcePage.splice(-1, 1, 'txt');
		sourcePage = sourcePage.join('.');
	}
	return await (await fetch(sourcePage)).text();
}

function htmlAttributes(...allowList){
	return `((?: *(?:${allowList.join('|')})(?: *= *".*?")?)*)`;
}

export {txtToHtml, htmlToTxt, fetchSourceText};
