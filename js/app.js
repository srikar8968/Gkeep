const toolbar = ['pinned', 'delete', 'archive', 'colorpallete'];
const themes = ['#cbf0f8', '#e8eaed', '#e6c9a8', '#fff475', '#f28b82'];
var notesData = [
	{
		title: 'Note 1',
		note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aliquid quos alias voluptatum ab eos, tenetur temporibus dolor debitis vitae fugit provident obcaecati porro rerum tempore, possimus deserunt odit dolores',
		pinned: true,
		archived: false,
		theme: '#cbf0f8',
		createdAt: new Date()
	},
	{
		title: 'Note 3',
		note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aliquid quos alias voluptatum ab eos, tenetur temporibus dolor debitis vitae fugit provident obcaecati porro rerum tempore, possimus deserunt odit dolores',
		pinned: true,
		archived: false,
		theme: '#e8eaed',
		createdAt: new Date()
	},
	{
		title: 'Note 2',
		note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aliquid quos alias voluptatum ab eos, tenetur temporibus dolor debitis vitae fugit provident obcaecati porro rerum tempore, possimus deserunt odit dolores',
		pinned: false,
		archived: false,
		theme: null,
		createdAt: new Date()
	}
];
var notes = [...notesData];
var localNotes = [];
var searchQuery = null;

function init(){
	if(notes.length){
		noteInit('nt__note_pinned', false, true);
		noteInit('nt__note_oth');
		noteInit('nt__note_archived', true);
	}else{
		document.getElementById('nt__notes').innerHTML = '<div class="nt__empty__bx"><img src="images/empty.svg" /><button onclick="addNote()">No notes yet, Add new now</button></div>';
	}
}

function noteInit(element, ntArchived = false, ntPinned = false) {
	var el = document.getElementById(element);
	el.innerHTML = '';
	el.style.display = 'block';
	let parentNode = document.createElement('div');
	let parentNodeTitle = document.createElement('h2');
	parentNode.classList.add('nt__card_section');
	parentNodeTitle.classList.add('nt__cat__title');
	let prop = (ntArchived) ? 'Archived' : ((ntPinned) ? 'Pinned' : 'Others');
	let parentNodeTitleTxt = document.createTextNode(prop);
	el.appendChild(parentNodeTitle).appendChild(parentNodeTitleTxt);
	let count = 0;
	for (let index in notes) {
		if(((notes[index].pinned === ntPinned) || notes[index].archived) && (notes[index] !== null)){
			if(notes[index].archived === ntArchived){
				let card = createNote(notes[index], index);
				parentNode.appendChild(card);
				count++;
			}
		}
	}
	if(count > 0) {
		el.appendChild(parentNode);
	} else {
		el.style.display = 'none';
		el.innerHTML = '<span class="alert">No notes under this category</span>';
	}
}
function createNote(nt, index) {
	let node = document.createElement('div');
	node.classList.add('nt__card');
	node.id = 'note_' + index;
	node.style.backgroundColor = nt.theme || '#fff';
	// form El
	let formNode = document.createElement('form');
	// input [title]
	let nodeTitle = document.createElement('input');
	nodeTitle.classList.add('nt__title');
	nodeTitle.type = 'text';
	nodeTitle.placeholder = 'Title';
	nodeTitle.value = nt.title;
	nodeTitle.setAttribute('data-item', index);
	nodeTitle.addEventListener('input', function() {
		notes[nodeTitle.getAttribute('data-item')].title = nodeTitle.value;
	});
	// note msg
	let nodeNote = document.createElement('textarea');
	let nodeNoteTxt = document.createTextNode(nt.note);
	nodeNote.classList.add('nt__msg');
	nodeNote.placeholder = 'Your Note';
	nodeNote.addEventListener('focus', function(el) { auto_grow(nodeNote) });
	nodeNote.addEventListener('input', function(el) { auto_grow(nodeNote) });
	nodeNote.addEventListener('focusout', function(el) { nodeNote.style.height = 'auto' });
	nodeNote.appendChild(nodeNoteTxt);
	nodeNote.setAttribute('data-item', index);
	nodeNote.addEventListener('input', function() {
		notes[nodeNote.getAttribute('data-item')].note = nodeNote.value;
	});
	// Toolbar actions
	let nodeToolbar = document.createElement('div');
	nodeToolbar.classList.add('nt__toolbar');
	let nodeToolbarChildOne = document.createElement('div');
	nodeToolbarChildOne.classList.add('nt__actions');
	let nodeToolbarChildTwo = document.createElement('span');
	let nodeDate = document.createTextNode(nt.createdAt.toDateString());
	nodeToolbarChildTwo.appendChild(nodeDate);
	// create color pallete
	let nodeColorPallete = document.createElement('ul');
	nodeColorPallete.className = 'nt__color';
	for(let theme in themes){
		let nodePalleteChild = document.createElement('li');
		nodePalleteChild.style.backgroundColor = themes[theme];
		nodePalleteChild.setAttribute('data-color', themes[theme]);
		nodePalleteChild.setAttribute('data-item', index);
		nodePalleteChild.addEventListener('click', function() { changeColor(nodePalleteChild) })
		nodeColorPallete.appendChild(nodePalleteChild);
	}
	// creating toolbar action buttons
	for(let idx in toolbar){
		let nodeBtn = document.createElement('button');
		nodeBtn.className = 'ic ic__' + toolbar[idx];
		nodeBtn.type = 'button';
		nodeBtn.title = toolbar[idx];
		nodeBtn.id = toolbar[idx] + '-' + index;
		nodeBtn.setAttribute('data-item', index);
		if(toolbar[idx]  === 'delete'){
			nodeBtn.addEventListener('click', function() { deleteNote(nodeBtn) });
		}else if(toolbar[idx] === 'archive') {
			nodeBtn.addEventListener('click', function() { archiveNote(nodeBtn) });
		}else if(toolbar[idx] === 'pinned') {
			nodeBtn.addEventListener('click', function() { pinNote(nodeBtn) });
		}else if(toolbar[idx] === 'colorpallete') {
			nodeBtn.appendChild(nodeColorPallete);
		}
		nodeToolbarChildOne.appendChild(nodeBtn);
	}
	// create note cards
	nodeToolbar.appendChild(nodeToolbarChildOne);
	nodeToolbar.appendChild(nodeToolbarChildTwo);
	formNode.appendChild(nodeTitle);
	formNode.appendChild(nodeNote);
	formNode.appendChild(nodeToolbar);
	node.appendChild(formNode);
	return node;
}

function saveNote(){
	var ntitle = document.getElementById('n__title');
	var nNote = document.getElementById('n__note');
	var nPinned = document.getElementById('n__pinned');
	if(ntitle.value || nNote.value){
		const note = {
			title: ntitle.value,
			note: nNote.value,
			pinned: (nPinned.value === 'true'),
			archived: false,
			theme: null,
			createdAt: new Date()
		}
		notes.push(note);
		init();
		resetNote();
		notify('Added note ' + note.title);
	}else{
		notify('Please add your note content', 'error');
	}
}
function updateNote(){
}
function deleteNote(note){
	let i = note.getAttribute('data-item');
	notes.splice(i, 1);
	init();
	notify('Deleted ' + notes[i].title, 'error')
}

function archiveNote(note){
	let i = note.getAttribute('data-item');
	notes[i].archived = !notes[i].archived;
	init();
	notify('Archived ' + notes[i].title);
}
function pinNote(note){
	let i = note.getAttribute('data-item');
	notes[i].pinned = !notes[i].pinned;
	init();
	notify('Pinned ' + notes[i].title);
}
function changeColor(node){
	let color = node.getAttribute('data-color');
	let i = node.getAttribute('data-item');
	notes[i].theme = color;
	document.getElementById('note_' + i).style.backgroundColor = color;
	notify('Changed ' + notes[i].title + 'theme color');
	// init();
}

// Dom manip functions
function auto_grow(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight)+"px";
}
function changeGrid(change = true){
	let view = localStorage.getItem('gridView');
	let gridDom = document.getElementById('nt__notes');
	if(change){
		if(view === 'grid'){
			gridDom.className = 'column';
			localStorage.setItem('gridView', null);
		}else{
			gridDom.className = 'grid';
			localStorage.setItem('gridView', 'grid');
		}
	}else{
		gridDom.className = (view === 'grid') ? 'grid' : 'column';
	}
}
function resetNote(){
	document.getElementById('n__title').value = document.getElementById('n__note').value = '';
	document.getElementById('n__pinned').value = 'false';
}
function pinNewNote(){
	let pinned = document.getElementById('n__pinned');
	pinned.value = !(pinned.value === 'true');
}
function addNote(){
	resetNote();
	document.getElementById('n__title').focus();
}
function notify(msg, type = 'default'){
	let notifyNode = document.createElement('div');
	let notifyMsgSpan = document.createElement('span');
	let notifyMsg = document.createTextNode(msg);
	let notifyClose = document.createElement('button');
	let notifyClosetxt = document.createTextNode('×');
	notifyNode.className = 'nt__notify ' + type;
	notifyClose.appendChild(notifyClosetxt);
	notifyClose.addEventListener('click', function() { notifyNode.parentNode.removeChild(notifyNode) });
	notifyMsgSpan.appendChild(notifyMsg);
	notifyNode.appendChild(notifyMsgSpan);
	notifyNode.appendChild(notifyClose);
	document.getElementById('nt__notify_section').appendChild(notifyNode);
}

window.onload = init();
window.onload = changeGrid(false);
