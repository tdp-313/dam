class monaco_file {
    constructor(handle,parent) {
        this.fullname = handle.name;
        this.prefix = this.fullname.indexOf('_') === -1 ? '' : this.fullname.substring(this.fullname.indexOf('_'), this.fullname.indexOf('.'));
        this.ext = this.fullname.substring(this.fullname.indexOf('.'), this.fullname.length);
        this.extFormat = this.fullname.substring(this.fullname.indexOf('.') + 1, this.fullname.length);
        this.handle = handle;
        this.parent = parent;
        if (this.prefix.length === 0) {
            this.name = this.fullname.substring(0, this.fullname.indexOf('.'));
            if (this.name.length === 0) {
                this.name = this.fullname;
            }
        }
        else {
            this.name = this.fullname.substring(0, Math.min(this.fullname.indexOf('.'), this.fullname.indexOf('_')));
        }
    }
}
const monaco_handleName = "monaco";
const monaco_handleName_Sub = "monaco-sub";
const monaco_handleName_RefMaster = "monaco-ref";
const fileNameExt = 'txt';

let useFileList_Open = false;
let isFileSelectSync = true;
const readFileButtonCreate = () => {
    const otherTabOpen = document.getElementById('control-otherTab');
    otherTabOpen.addEventListener('click', async () => {
        tabs_add(await getNormalEditor_Model());
    });
    otherTabOpen.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        window.open('/dam/monaco', Math.random(), "popup");
    });
    const modeChangeSync = document.getElementById('control-Reload');
    modeChangeSync.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        fileReadStart(true);
    });
    const fileReadStart = async (isNew = false) => {
        const separate = document.getElementById('control-extraFolderSeparate');
        console.log(await Directory_Handle_RegisterV2(monaco_handleName, isNew));
        if (!separate.checked) {
            console.log(await Directory_Handle_RegisterV2(monaco_handleName_Sub, isNew, 'read'));
        }
        if (extraRefButton.checked) {
            console.log(await Directory_Handle_RegisterV2(monaco_handleName_RefMaster, false, 'read'));
        }
        await pullDownCreate();
        await fileReadBoth();
    }
    modeChangeSync.addEventListener('click', async (event) => {
        fileReadStart(false)
    });
    const fileSelectSync = document.getElementById('control-FileSelectSync');
    fileSelectSync.addEventListener('click', async (e) => {
        if (isFileSelectSync) {
            //On => Off
            isFileSelectSync = false;
            e.target.src = "./icon/link-off.svg";

        } else {
            //Off => On
            isFileSelectSync = true;
            e.target.src = "./icon/link.svg";
        }
    });
    const extraRefButton = document.getElementById('control-extraRef');
    extraRefButton.addEventListener('click', async (event) => Setting.setRefMaster = event.target.checked);
    extraRefButton.checked = Setting.getRefMaster;
    const separateFolder = document.getElementById('control-extraFolderSeparate');
    separateFolder.addEventListener('click', async (event) => Setting.setHandleSeparate = event.target.checked);
    separateFolder.checked = Setting.getHandleSeparate;
    const control_extraArea = document.getElementById('control-extraButton');
    control_extraArea.addEventListener('click', () => {
        const modeChangeCode = document.getElementById('control-EditorModeChange-code');
        if (modeChangeCode.checked) {
            if (useFileList_Open) {
                extraControlClick(extraControl, "close");
                useFileList_Open = false;
            } else {
                extraControlClick(extraControl, "open");
                useFileList_Open = true;
            }
            
            return null;
        }

        extraControlClick(extraControl);
        if (extraControl) {
            extraControl = false;
        } else {
            extraControl = true;
        }
    });
    const control_LibLeft = document.getElementById('control-Library-Left');
    control_LibLeft.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        if (!Setting.getHandleSeparate) {
            Setting.setHandleSeparate = true;
            separateFolder.checked = Setting.getHandleSeparate;
        }
        fileReadStart(true);
    });
    const control_LibRight = document.getElementById('control-Library-Right');
    control_LibRight.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        if (!Setting.getHandleSeparate) {
            Setting.setHandleSeparate = true;
            separateFolder.checked = Setting.getHandleSeparate;
        }
        fileReadStart(true);
    });
    const fileReadBoth = async () => {
        const FileLeft = document.getElementById('control-File-Left');
        const FileRight = document.getElementById('control-File-Right');
        const FolderLeft = document.getElementById('control-Folder-Left');
        const FolderRight = document.getElementById('control-Folder-Right');

        let Left = FileList.Left.File[FileLeft.value];
        let Right = FileList.Right.File[FileRight.value];

        let LeftText = await file_read_text(Left.fullname, Left.handle, false, "text", false);
        let RightText = await file_read_text(Right.fullname, Right.handle, false, "text", false);

        let NormalUri = monaco.Uri.parse(control_LibLeft.value + '/' + FolderLeft.value + '/' + FileLeft.value);
        let LeftUri = monaco.Uri.parse('DIFF/' + control_LibLeft.value + '/' + FolderLeft.value + '/' + FileLeft.value);
        let RightUri = monaco.Uri.parse('DIFF/' +control_LibRight.value + '/' + FolderRight.value + '/' + FileRight.value);

        let lang = ['', '', ''];//normal original modified
        if (FolderLeft.value === 'QRPGSRC') {
            lang = ['rpg-indent', 'rpg', 'rpg'];
        } else if (FolderLeft.value === 'QDSPSRC' || FolderLeft.value === 'QDDSSRC') {
            lang = ['dds', 'dds', 'dds'];
        }

        
        let normalEditorModel = await modelChange(await addIndent(LeftText), lang[0], NormalUri);
        let diffEditorModel_Original = await modelChange(await addSpaces(LeftText), lang[1],LeftUri);
        let normalEditorModel_Modified = await modelChange(await addSpaces(RightText), lang[2],RightUri);
        await monacoRead2(normalEditorModel, diffEditorModel_Original, normalEditorModel_Modified);
        await refDefStart();
        tabs_add(normalEditorModel, false);
    }
    const fileSelectSync_Process = async (target, fullname, fileType) => {
        let reverse = target === 'Left' ? 'Right' : 'Left';
        let search_target = Object.keys(FileList[reverse][fileType]);
        if (fileType === 'Library') {
            return null;
        }
        for (let i = 0; i < search_target.length; i++) {
            if (FileList[target][fileType][fullname].name === FileList[reverse][fileType][search_target[i]].name) {
                console.log("Sync");
                let revPulldown = document.getElementById('control-' + fileType + '-' + reverse);
                revPulldown.selectedIndex = i;
                break;
            }
        }

    }
    const fileFolderPulldown = document.querySelectorAll('.control-FileFolder-pulldown');
    fileFolderPulldown.forEach((pulldown) => {
        pulldown.addEventListener('change', async (e) => {
            let file = e.target.id.substring(e.target.id.indexOf("-") + 1, e.target.id.lastIndexOf("-"));
            let L_R = e.target.id.substring(e.target.id.lastIndexOf("-") + 1, e.target.id.length);
            let FileLR = document.getElementById('control-' + file + '-' + L_R);
            if (file === 'Library') {
                const separate = document.getElementById('control-extraFolderSeparate');
                let handleName = monaco_handleName;
                if (!separate.checked) {
                    handleName = monaco_handleName_Sub;
                }
                await monaco_pulldownCreate(FileLR, L_R, linkStatus[handleName].handle, 'Library');
                let FileLR_2 = document.getElementById('control-Folder-' + L_R);
                await monaco_pulldownCreate(FileLR_2, L_R, FileList[L_R]['Library'][FileLR.value].handle, 'Folder');
                let FileLR_3 = document.getElementById('control-File-' + L_R);
                await monaco_pulldownCreate(FileLR_3, L_R, FileList[L_R]['Folder'][FileLR_2.value].handle, 'File');
            } else if (file === 'Folder') {
                let FileLR_1 = document.getElementById('control-Library-' + L_R);
                await monaco_pulldownCreate(FileLR, L_R, FileList[L_R]['Library'][FileLR_1.value].handle, 'Folder');
                let FileLR_3 = document.getElementById('control-File-' + L_R);
                await monaco_pulldownCreate(FileLR_3, L_R, FileList[L_R]['Folder'][FileLR.value].handle, 'File');
            } else if (file === 'File') {
                //await monaco_pulldownCreate(FileLR, L_R, FileList[L_R]['Folder'][FileLR.value].handle, file);
            }
            //sync 
            if (isFileSelectSync) {
                await fileSelectSync_Process(L_R, FileLR.value, file);
            }
            await fileReadBoth();
        });
    });
    const sidebar_mode_file = document.getElementById('rs-mode-file');
    sidebar_mode_file.addEventListener('click', async (event) => {
        await createUseFileList(normalRefDef);
    });
    const sidebar_mode_def = document.getElementById('rs-mode-def');
    sidebar_mode_def.addEventListener('click', async (event) => {
        await createUseFileList(normalRefDef);
    });
}
let extraControl = false;
const extraControlClick = (open,mode = "") => {
    const control_extraArea = document.getElementById('control-extraButton');
    let img = control_extraArea.querySelector("img");
    const upIcon = "./icon/caret-up.svg";
    const rightIcon = "./icon/caret-right.svg";
    const leftIcon = "./icon/caret-left.svg";
    const downIcon = "./icon/caret-down.svg";
    const control_extra = document.getElementById('control-subArea');
    const sidebar = document.getElementById('right-sideBar');
    const mainArea = document.getElementById('monaco-area'); 
    const tabArea = document.getElementById('monaco-tab');
    console.log(open,mode);
    if (mode !== "") {
        if (mode === "open") {
            img.src = rightIcon;
            sidebar.classList.add("r-side-open");
            mainArea.classList.add("monaco-area-sidebar-open");
        } else {
            img.src = leftIcon;
            sidebar.classList.remove("r-side-open");
            mainArea.classList.remove("monaco-area-sidebar-open");
        }
        if (mode !== "init") {
            return;
        }
    }
    useFileList_Open = false;
    sidebar.classList.remove("r-side-open");
    mainArea.classList.remove("monaco-area-sidebar-open");
    mainArea.classList.add('monaco-area-tab-hidden');
    if (open) {
        tabArea.classList.add('displayHide');
        img.src = upIcon;
        if (!control_extra.classList.contains('close')) {
            control_extra.classList.add('close');
        }
        
    } else {
        if (mode === "init") {
            img.src = leftIcon;
            mainArea.classList.remove("monaco-area-tab-hidden");
            tabArea.classList.remove('displayHide');
        } else {
            img.src = downIcon;
        }
        if (control_extra.classList.contains('close')) {
            control_extra.classList.remove('close');
        }
    }
}
const pullDownCreate = async (target = 'All') => {

    if (target === 'All' || target === 'Left') {
        const LibLeft = document.getElementById('control-Library-Left');
        await monaco_pulldownCreate(LibLeft, "Left", linkStatus[monaco_handleName].handle, "Library");
        const FolderLeft = document.getElementById('control-Folder-Left');
        await monaco_pulldownCreate(FolderLeft, "Left", FileList["Left"]["Library"][LibLeft.value].handle, "Folder");
        const FileLeft = document.getElementById('control-File-Left');
        await monaco_pulldownCreate(FileLeft, "Left", FileList["Left"]["Folder"][FolderLeft.value].handle, "File");
    }
    if (target === 'All' || target === 'Right') {
        const separate = document.getElementById('control-extraFolderSeparate');
        let handleName = monaco_handleName;
        if (!separate.checked) {
            handleName = monaco_handleName_Sub;
        }
        const LibRight = document.getElementById('control-Library-Right');
        await monaco_pulldownCreate(LibRight, "Right", linkStatus[handleName].handle, "Library");
        const FolderRight = document.getElementById('control-Folder-Right');
        await monaco_pulldownCreate(FolderRight, "Right", FileList["Right"]["Library"][LibRight.value].handle, "Folder");
        const FileRight = document.getElementById('control-File-Right');
        await monaco_pulldownCreate(FileRight, "Right", FileList["Right"]["Folder"][FolderRight.value].handle, "File");
    }

}
const Directory_Handle_RegisterV2 = async (name, isNew = false, rw_mode = 'readwrite') => {
    // Indexed Database から FileSystemDirectoryHandle オブジェクトを取得
    if (typeof linkStatus[name] === 'undefined') {
        linkStatus[name] = new linkStatusClass;
    }
    linkStatus[name].handle = await idbKeyval.get(name);
    if (linkStatus[name].handle) {
        if (isNew) {
            linkStatus[name].handle = await window.showDirectoryPicker();
        } else {
            // すでにユーザーの許可が得られているかをチェック
            let permission = await linkStatus[name].handle.queryPermission({ mode: rw_mode });
            if (permission !== 'granted') {
                // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
                permission = await linkStatus[name].handle.requestPermission({ mode: rw_mode });
                if (permission !== 'granted') {
                    linkStatus[name].handle = await window.showDirectoryPicker();
                    if (!linkStatus[name].handle) {
                        connect_dispNaviBar(false);
                        throw new Error('ユーザーの許可が得られませんでした。');
                    }
                }
            }
        }
    } else {
        // ディレクトリ選択ダイアログを表示
        linkStatus[name].handle = await window.showDirectoryPicker();
    }
    linkStatus[name].ishandle = true;
    // FileSystemDirectoryHandle オブジェクトを Indexed Database に保存
    await idbKeyval.set(name, linkStatus[name].handle);
    return ('OK');
}

let FileList = {}
async function monaco_pulldownCreate(create_target, L_R, readHandle, readKind) {
    let count = 0;
    let backup_target = null;

    if (typeof (FileList[L_R]) === 'undefined') {
        FileList[L_R] = {};
    }
    if (create_target.value !== "") {
        backup_target = FileList[L_R][readKind][create_target.value];
    } else {
        backup_target = { name: "" };
    }
    create_target.innerHTML = '';
    FileList[L_R][readKind] = {};
    for await (const handle of readHandle.values()) {
        let insert = document.createElement('option');
        insert.value = handle.name;
        insert.text = handle.name;
        await create_target.appendChild(insert);
        let file_set = new monaco_file(handle,readHandle.name);
        FileList[L_R][readKind][file_set.fullname] = file_set;
        if (backup_target.name === file_set.name) {
            //console.log("Restore", backup_target.name);
            create_target.selectedIndex = count;
        }
        count++;
    }
}

const createFolderExistList = async (libHandle, folder) => {
    let rtn = [];
    for await (const handle of libHandle.values()) {
        if (handle.kind === 'directory' && handle.name === folder) {
            for await (const fileHandle of handle.values()) {
                if (fileHandle.kind === 'file') {
                    rtn.push(new monaco_file(fileHandle,libHandle.name));
                }
            }
            break;
        }
    }
    return rtn;
}

const getFolderExistList_Text = async (List, target) => {
    for (let i = 0; i < List.length; i++) {
        if (List[i].name === target) {
            let text = await file_read_text(List[i].fullname, List[i].handle, false, 'text', false, false);
            return {
                text: await addSpaces(text), handle: List[i].handle
            };
        }
    }
    return null;
}

function addSpaces(text) {
    const lines = text.split("\n");
    const maxLength = 80;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let leadingSpaces = line.match(/^\s*/)[0];
        line = line.trim();
        let length = line.length;
        let numSpaces = maxLength - length;
        if (numSpaces > 0) {
            let spaces = "";
            for (let j = 0; j < numSpaces; j++) {
                spaces += " ";
            }
            lines[i] = leadingSpaces + line + spaces;
        }
    }

    return lines.join("\n");
}

function revIndent(textArray){
    let rtn = "";
    for (let i = 0; i < textArray.length; i++) {
        if (textArray[i].substring(6, 7) !== "*" && textArray[i].substring(5, 6) === "C") {
            rtn = rtn + textArray[i].substring(0,27) + textArray[i].substring(45,textArray[i].length) + "\n";
        } else {
            rtn = rtn + textArray[i] + "\n";
        }
    }
    return (rtn);
}
        

function addIndent(text) {
    const lines = text.split("\n");
    const maxLength = 80;
    const regPattern_Open = new RegExp(`(${Operetor_OpenArray.concat(Subroutine_OpenArray).join("|")})`);
    const regPattern_Close = new RegExp(`(${Operetor_CloseArray.concat(Subroutine_CloseArray).join("|")})`);
    const regPattern_Else = new RegExp(`(${Operetor_ElseArray.join("|")})`);
    let counter_open = 0;
    let lastFormatType = "";
    let maxIndent = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let leadingSpaces = line.match(/^\s*/)[0];
        line = line.trim();
        let length = line.length;
        let numSpaces = maxLength - length;
        if (numSpaces > 0) {
            let spaces = "";
            for (let j = 0; j < numSpaces; j++) {
                spaces += " ";
            }
            lines[i] = leadingSpaces + line + spaces;
        }
        if (lines[i].substring(6, 7) !== "*" && lines[i].substring(5, 6) === "C") {
            let insertText = '';
            insertText = " ".repeat(14);
            if (regPattern_Open.test(lines[i].substring(27, 32))) {
                counter_open++;
                if (counter_open > 9) {
                    console.warn('Error Inline over 9');
                    counter_open = 9;
                }
                insertText += 'O' + counter_open;

            }
            else if (regPattern_Close.test(lines[i].substring(27, 32))) {
                insertText += 'C' + counter_open;


                counter_open--;
                if (counter_open < 0) {
                    console.warn('Error Inline under 0');
                    counter_open = 0;
                }
            }
            else if (regPattern_Else.test(lines[i].substring(27, 32))) {
                insertText += 'L' + counter_open;
            }
            else {
                insertText += 'S' + counter_open;
            }
            if (Math.max(counter_open, maxIndent) !== maxIndent) {
                maxIndent = counter_open;
            }
            insertText += '-' + maxIndent;
            lines[i] = lines[i].substring(0, 27) + insertText + lines[i].substring(27, lines[i].length);
            if (counter_open === 0) {
                maxIndent = 0;
            }
        }
    }
    //indent line Create
    const indentMaxLength = 9;
    let lastIndent = 0;
    for (let i = lines.length - 1; i > 0; i--) {
        let line = lines[i];
        if (line.substr(5, 1) === "C" && line.substr(6, 1) !== "*") {
            let indent = Number(line.substr(27 + 14 + 3, 1)) + 1;
            let indentLevel = Number(line.substr(27 + 14 + 1, 1));
            let indentLine = line.substr(27 + 14, 1);
            //console.debug(indentLine, indentLevel, indent);
            maxIndent = Math.max(maxIndent, indent);
            let replaceIndentText = "  ".repeat(indentMaxLength);
            if (Math.abs(indent - lastIndent) > 1) {
                maxIndent = indent;
            }
            if (indentLevel === 0) {
                maxIndent = 0;
            } else {
                //create
                if (indentLine === "O") {
                    replaceIndentText = "  ".repeat(indentMaxLength - (maxIndent - indentLevel));
                    replaceIndentText += "{"
                    replaceIndentText += "-".repeat((maxIndent - indentLevel) * 2 - 1);
                }

                else if (indentLine === "C") {
                    replaceIndentText = "  ".repeat(indentMaxLength - (maxIndent - indentLevel));
                    replaceIndentText += "}";
                    replaceIndentText += "-".repeat((maxIndent - indentLevel) * 2 - 1);
                }
                else if (indentLine === "L") {
                    replaceIndentText = "  ".repeat(indentMaxLength - (maxIndent - indentLevel));
                    replaceIndentText += "*"
                    replaceIndentText += "-".repeat((maxIndent - indentLevel) * 2 - 1);
                }
            }
            lastIndent = indent;
            lines[i] = lines[i].substring(0, 27) + replaceIndentText + lines[i].substring(45, lines[i].length);
        }
    }
    let nowRow = (" ".repeat(indentMaxLength * 2)).split("");

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.substr(5, 1) === "C" && line.substr(6, 1) !== "*") {
            let readRow = line.substring(27, 45).split("");;

            let isPlus = false;
            for (let i = 0; i < nowRow.length; i++) {
                if (readRow[i] === "{" || readRow[i] === "}") {
                    isPlus = true;
                    if (nowRow[i] === "|") {
                        nowRow[i] = " ";
                    } else {
                        nowRow[i] = "|";
                    }
                    break;
                } else if (readRow[i] === "*") {
                    readRow[i] = "+";
                    isPlus = true;
                    break;
                } else {
                    readRow[i] = nowRow[i];
                }
            }

            let insertText = readRow.join('');
            lines[i] = lines[i].substring(0, 27) + insertText + lines[i].substring(45, lines[i].length);

        }
    }
    return lines.join("\n");
}

