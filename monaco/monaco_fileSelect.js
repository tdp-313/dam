class monaco_file {
    constructor(handle) {
        this.fullname = handle.name;
        this.prefix = this.fullname.indexOf('_') === -1 ? '' : this.fullname.substring(this.fullname.indexOf('_'), this.fullname.indexOf('.'));
        this.ext = this.fullname.substring(this.fullname.indexOf('.'), this.fullname.length);
        this.handle = handle;
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
let isFileSelectSync = true;
const readFileButtonCreate = () => {

    const modeChangeSync = document.getElementById('control-Reload');
    modeChangeSync.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        fileReadStart(true);
    });
    const fileReadStart = async (isNew = false) => {
        const separate = document.getElementById('control-extraFolderSeparate');
        console.log(await Directory_Handle_RegisterV2(monaco_handleName, isNew));
        if (!separate.checked) {
            console.log(await Directory_Handle_RegisterV2(monaco_handleName_Sub, isNew));
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
    const separateFolder = document.getElementById('control-extraFolderSeparate');
    separateFolder.addEventListener('click', async (event) => Setting.setHandleSeparate = event.target.checked);
    separateFolder.checked = Setting.getHandleSeparate;
    const control_extraArea = document.getElementById('control-extraButton');
    control_extraArea.addEventListener('click', () => {
        const modeChangeCode = document.getElementById('control-EditorModeChange-code');
        if (modeChangeCode.checked) {
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
        let Left = FileList.Left.File[FileLeft.value];
        let Right = FileList.Right.File[FileRight.value];
        let LeftText = await file_read_text(Left.fullname, Left.handle, false, "text", false);

        await monacoRead(addIndent(LeftText), "rpg-indent", "");
        LeftText = await addSpaces(LeftText);
        await monacoRead(LeftText, "rpg", await addSpaces(await file_read_text(Right.fullname, Right.handle, false, "text", false)));
    }
    const fileSelectSync_Process = async (target, fullname, fileType) => {
        let reverse = target === 'Left' ? 'Right' : 'Left';
        let search_target = Object.keys(FileList[reverse][fileType]);

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
}
let extraControl = false;
const extraControlClick = (open) => {
    const control_extraArea = document.getElementById('control-extraButton');
    let img = control_extraArea.querySelector("img");
    const upIcon = "./icon/caret-up.svg";
    const downIcon = "./icon/caret-down.svg";
    const control_extra = document.getElementById('control-subArea');
    if (open) {
        img.src = upIcon;
        if (!control_extra.classList.contains('close')) {
            control_extra.classList.add('close');
        }

    } else {
        img.src = downIcon;
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
const Directory_Handle_RegisterV2 = async (name, isNew = false) => {
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
            let permission = await linkStatus[name].handle.queryPermission({ mode: 'readwrite' });
            if (permission !== 'granted') {
                // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
                permission = await linkStatus[name].handle.requestPermission({ mode: 'readwrite' });
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
        let file_set = new monaco_file(handle);
        FileList[L_R][readKind][file_set.fullname] = file_set;
        if (backup_target.name === file_set.name) {
            //console.log("Restore", backup_target.name);
            create_target.selectedIndex = count;
        }
        count++;
    }
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

function addIndent(text) {
    const lines = text.split("\n");
    const maxLength = 80;
    const regPattern_Open = new RegExp(`(${Operetor_OpenArray.concat(Subroutine_OpenArray).join("|")})`);
    const regPattern_Close = new RegExp(`(${Operetor_CloseArray.concat(Subroutine_CloseArray).join("|")})`);
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
            else if (lines[i].substring(27, 32) === "ELSE ") {
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

