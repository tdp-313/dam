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
        LeftText = await addSpaces(LeftText);
        await monacoRead(LeftText, "rpg", "");
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
var linkStatus = {};
class linkStatusClass {
    constructor() {
        this.handle = null;
        this.ishandle = false;
    }
}