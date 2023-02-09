autowatch = 1;
inlets = 2;
outlets = 2; 

var filePath = ''
var pathString = 'fileString'
var firstPatch = ''
var currentPatch = ''
var previousPatch = ''
var saveAsActive = false
var initBool = false

function save(filename) {
      var f = new File(filename, "write", "TEXT");
        if(f.isopen) {
                f.writestring(filePath);
                f.eof = f.position;
                f.close();
        }
}

function getPresets(){
	var pathName = readPath("fileString.txt")
	var f = new Folder(pathName)
	if(f){
		outlet(0, "clear")
	}
	f.typelist = []
	var i = 0;
	while (!f.end) {
		var scrubbedFile = f.filename.substring(0, f.filename.length-4)
		if (scrubbedFile.length > 0 && scrubbedFile !== 'Init'){
			if(i===0){
				firstPatch = scrubbedFile
			}
			outlet(0, 'append ' + scrubbedFile)
			i++;
		}
  		f.next()
		loadPatch(firstPatch)
	}
	f.close()
}

function deleteInitByIndex(index){
	if(initBool){
		outlet(0, 'delete ' + index)
	}
	initBool = false
}

function loadPatch(patchName){
	if (patchName != currentPatch){
		outlet(1, 'read ' + patchName)
		outlet(1, '1')
		if(currentPatch.length > 0 ){
			previousPatch = currentPatch
		}
		currentPatch = patchName
	}
}

function readPath(fileName){
	var f = new File(fileName, "read", "TEXT");
    var returnStr = ''
	while(f.isopen && f.position < f.eof){
		returnStr = f.readstring(500)
	}
        f.close()

		return returnStr
}

function writePath(pathText){
	filePath = pathText
	save(pathString)
	getPresets(false)
}

function formatUMenuOut(menuString){
	var startInd = menuString.lastIndexOf("/") + 1
	var cleanString = menuString.substring(startInd,menuString.length)
	loadPatch(cleanString)
}

function loadbang(){
	getPresets();
}

function loadSaveAs(patchName){
	post('patchname_lsa', patchName)
	if(saveAsActive && patchName !== '<none>'){
		// postMessage("patch length:", patchName)
		var scrubbedName = patchName.substring(0, patchName.indexOf('.'))
		loadPatch(scrubbedName)
		outlet(0, "append " + scrubbedName)
		if (previousPatch == 'Init'){
			initBool = true
			outlet(0, 'symbol Init')
		}
		outlet(0, "set " + scrubbedName)
	}
	saveAsActive = false
}

function saveAsPatch(){	
	saveAsActive = true
	outlet(1, 'store 1')
	outlet(1, 'write')
	// loadSaveAs()
}

function savePatch(){
	if(currentPatch !== 'Init'){
		outlet(1, 'store 1')
		outlet(1, 'writeagain')
	} else {
		saveAsPatch()
	}
}

function loadInit(){
	initBool = true
	loadPatch('Init')
	outlet(0, 'append Init')
	outlet(0, 'set Init')
}
