class monaco_file {
    constructor(handle) {
        this.fullname = handle.name;
        this.prefix = this.fullname.indexOf('_') === -1 ? '' : this.fullname.substring(this.fullname.indexOf('_'), this.fullname.indexOf('.'));
        this.ext = this.fullname.substring(this.fullname.indexOf('.'), this.fullname.length);
        this.handle = handle;
        if (this.prefix.length === 0) {
            this.name = this.fullname.substring(0, this.fullname.indexOf('.'));
        }
        else {
            this.name = this.fullname.substring(0, Math.min(this.fullname.indexOf('.'), this.fullname.indexOf('_')));
        }
    }
}
const monaco_handleName = "monaco";
let isFileSelectSync = true;
const readFileButtonCreate = () => {
    const modeChangeDiff = document.getElementById('control-FolderSelect');
    modeChangeDiff.addEventListener('click', async () => {
        console.log(await Directory_Handle_RegisterV2(monaco_handleName, true));
        await pullDownCreate();
        await fileReadBoth();
    });

    const modeChangeSync = document.getElementById('control-Reload');
    modeChangeSync.addEventListener('click', async () => {
        console.log(await Directory_Handle_RegisterV2(monaco_handleName, false));
        await pullDownCreate();
        await fileReadBoth();

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

    const fileReadBoth = async () => {
        const FileLeft = document.getElementById('control-File-Left');
        const FileRight = document.getElementById('control-File-Right');
        let Left = FileList.Left.file[FileLeft.value];
        let Right = FileList.Right.file[FileRight.value];
        let LeftText = await file_read_text(Left.fullname, Left.handle, false, "text", false);

        await monacoRead(addIndent(LeftText), "rpg-indent", "");
        LeftText = await addSpaces(LeftText);
        await monacoRead(LeftText, "rpg", await addSpaces(await file_read_text(Right.fullname, Right.handle, false, "text", false)));
    }
    const fileSelectSync_Process = async (target, fullname) => {
        let reverse = target === 'Left' ? 'Right' : 'Left';

        let search_target = Object.keys(FileList[reverse]["file"]);

        for (let i = 0; i < search_target.length; i++) {
            if (FileList[target]["file"][fullname].name === FileList[reverse]["file"][search_target[i]].name) {
                console.log("Sync");
                let revPulldown = document.getElementById('control-File-' + reverse);
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
            const FileLR = document.getElementById('control-File-' + L_R);
            if (file === 'Folder') {
                await monaco_pulldownCreate(FileLR, L_R, FileList[L_R]["directory"][e.target.value].handle, "file");
            }
            //sync 
            if (isFileSelectSync) {
                await fileSelectSync_Process(L_R, FileLR.value);
            }
            await fileReadBoth();

        });
    });
}
const pullDownCreate = async (target = 'All') => {
    if (target === 'All' || target === 'Left') {
        const FolderLeft = document.getElementById('control-Folder-Left');
        await monaco_pulldownCreate(FolderLeft, "Left", linkStatus[monaco_handleName].handle, "directory");
        const FileLeft = document.getElementById('control-File-Left');
        await monaco_pulldownCreate(FileLeft, "Left", FileList["Left"]["directory"][FolderLeft.value].handle, "file");
    }
    if (target === 'All' || target === 'Right') {
        const FolderRight = document.getElementById('control-Folder-Right');
        await monaco_pulldownCreate(FolderRight, "Right", linkStatus[monaco_handleName].handle, "directory");
        const FileRight = document.getElementById('control-File-Right');
        await monaco_pulldownCreate(FileRight, "Right", FileList["Right"]["directory"][FolderRight.value].handle, "file");
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
    if (readKind === 'file' && create_target.value !== "") {
        backup_target = FileList[L_R][readKind][create_target.value];
    } else {
        backup_target = { name: "" };
    }
    create_target.innerHTML = '';
    FileList[L_R][readKind] = {};
    for await (const handle of readHandle.values()) {
        if (handle.kind === 'file' && readKind === handle.kind) {

            let insert = document.createElement('option');
            insert.value = handle.name;
            insert.text = handle.name;
            await create_target.appendChild(insert);
            let file_set = new monaco_file(handle);
            FileList[L_R][readKind][file_set.fullname] = file_set;
            if (backup_target.name === file_set.name) {
                console.log("Restore", backup_target.name);
                create_target.selectedIndex = count;
            }
            count++;
        } else if (handle.kind === 'directory' && readKind === handle.kind) {

            let insert = document.createElement('option');
            insert.value = handle.name;
            insert.text = handle.name;
            await create_target.appendChild(insert);
            let file_set = new monaco_file(handle);
            FileList[L_R][readKind][file_set.fullname] = file_set;
            count++;
        }
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
    console.log(regPattern_Open, regPattern_Close);
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
        let bracket = " ".repeat(10);
        /*
        if (lines[i].substring(5, 6) !== lastFormatType) {
            if (lines[i].substring(5, 6) === "C") {
                //"closeOnly"
                bracket = "}";
                bracket += " ".repeat(9);
            } else if (lastFormatType === "C"||lastFormatType === "") {
                //"OpenOnly"
                bracket = "{";
                bracket += " ".repeat(9);

            } else {
                //CloseOpen
                bracket = "}{";
                bracket += " ".repeat(8);
            }
            lastFormatType = lines[i].substring(5, 6);
        } else {
            bracket = " ".repeat(10);
        }*/
        if (lines[i].substring(6, 7) !== "*" && lines[i].substring(5, 6) === "C") {
            let insertText = '';
            insertText = " ".repeat(14);
            if (regPattern_Open.test(lines[i].substring(27, 32))) {
                counter_open++;
                if (counter_open > 9) {
                    console.warn('Error Inline over 9');
                    counter_open = 9;
                }
                insertText += '+' + counter_open;

                const arr_bracket = bracket.split("");
                arr_bracket[counter_open - 1] = "{";
                bracket = arr_bracket.join("");
            }
            else if (regPattern_Close.test(lines[i].substring(27, 32))) {
                insertText += '+' + counter_open;

                const arr_bracket = bracket.split("");
                arr_bracket[counter_open - 1] = "}";
                bracket = arr_bracket.join("");

                counter_open--;
                if (counter_open < 0) {
                    console.warn('Error Inline under 0');
                    counter_open = 0;
                }
            }
            else if (lines[i].substring(27, 32) === "ELSE ") {
                insertText += 'L' + counter_open;

                const arr_bracket = bracket.split("");
                arr_bracket[counter_open - 1] = "}";
                arr_bracket[counter_open] = "{";
                bracket = arr_bracket.join("");
            }
            else {
                insertText += ' ' + counter_open;
            }
            if (Math.max(counter_open, maxIndent) !== maxIndent) {
                maxIndent = counter_open;
            }
            insertText += '-' + maxIndent;
            lines[i] = bracket + lines[i].substring(0, 27) + insertText + lines[i].substring(27, lines[i].length);
            if (counter_open === 0) {
                maxIndent = 0;
            }
        } else {
            lines[i] = bracket + lines[i];
        }
    }
    //indent line Create

    const indentMaxLength = 9;
    for (let i = lines.length - 1; i > 0; i--) {
        let line = lines[i];
        if (line.substr(15, 1) === "C" && line.substr(16, 1) !== "*") {
            let indent = Number(line.substr(10 + 27 + 14 + 3, 1)) + 1;
            let indentLevel = Number(line.substr(10 + 27 + 14 + 1, 1));
            let indentLine = line.substr(10 + 27 + 14, 1);
            //console.debug(indentLine, indentLevel, indent);
            maxIndent = Math.max(maxIndent, indent);
            let replaceIndentText = "  ".repeat(indentMaxLength);
            if (indentLevel === 0) {
                maxIndent = 0;
            } else {
                //create
                if (indentLine === "+") {
                    replaceIndentText = "  ".repeat(indentMaxLength - (maxIndent - indentLevel));
                    replaceIndentText += "+"
                    replaceIndentText += "-".repeat((maxIndent - indentLevel) * 2 - 1);
                } else if (indentLine === "L") {
                    replaceIndentText = "  ".repeat(indentMaxLength - (maxIndent - indentLevel));
                    replaceIndentText += "*"
                    replaceIndentText += "-".repeat((maxIndent - indentLevel) * 2 - 1);
                }
            }
            lines[i] = lines[i].substring(0, 37) + replaceIndentText + lines[i].substring(55, lines[i].length);
        }
    }
    let nowRow = (" ".repeat(indentMaxLength * 2)).split("");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.substr(15, 1) === "C" && line.substr(16, 1) !== "*") {
            console.log(line);
            let readRow = line.substring(37, 55).split("");;

            let isPlus = false;
            for (let i = 0; i < nowRow.length; i++) {
                if (readRow[i] === "+") {
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
            lines[i] = lines[i].substring(0, 37) + insertText + lines[i].substring(55, lines[i].length);

        }
    }
    return lines.join("\n");
}
var linkStatus = {};
class linkStatusClass {
    constructor() {
        this.handle = null;
        this.ishandle = false;
    }
}