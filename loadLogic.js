autowatch = 1;
inlets = 1;
outlets = 3; 

var filePath = ''
var pathString = 'fileString'
var firstPatch = ''
var currentPatch = ''
var saveAsActive = false
var initBool = false
var patchCount = 0

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
	post('cleanstring: ', cleanString)
	outlet(2, 'set patchName ' + cleanString)
	loadPatch(cleanString)
}

function loadbang(){
	getPresets();
}

function loadSaveAs(patchName){
	if(saveAsActive && patchName !== '<none>'){
		var scrubbedName = patchName.substring(0, patchName.indexOf('.'))
		post('LSA_loadPatch: ', scrubbedName)
		outlet(0, "append " + scrubbedName)
		if (initBool){
			outlet(0, 'symbol Init')
		}
		loadPatch(scrubbedName)
		outlet(0, "set " + scrubbedName)
	}
	saveAsActive = false
}

function saveAsPatch(){	
	saveAsActive = true
	outlet(1, 'store 1')
	outlet(1, 'write')
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

function getDeviceName(){
	post('TRIGGER')
	api = new LiveAPI(this.patcher "live_set");
	post(this.patcher.name)
	if (!api) {
	post("no api object\n");
	return;
	}
	post("api.id is", api.id, "\n");
	post("api.path is", api.path, "\n");
}