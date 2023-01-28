async function mergely_start() {
    let rtn = '';
    rtn += await mergely_start_toolbar()
    rtn += '<div class="mergely-full-screen-8">'
    rtn += '<div class="mergely-resizer">'
    rtn += '<div id="mergely"></div>'
    rtn += '</div>'
    rtn += '</div>'
    return (rtn);
}
async function mergely_start_toolbar() {
    let rtn = '';
    rtn += '<div class="mergely-toolbar">'
    rtn += '<div class="mergely-toolbar-left">'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color" id="mergely-toolbar-left-folderlink">folder_open</span>'
    rtn += '  <select id="mergely-toolbar-left-pulldown"></select>'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color">save</span>'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color">save_as</span>'
    rtn += '</div>'
    rtn += '<div class="mergely-toolbar-centerline"></div>'
    rtn += '<div class="mergely-toolbar-right">'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color" id="mergely-toolbar-right-folderlink">folder_open</span>'
    rtn += '  <select id="mergely-toolbar-right-pulldown"></select>'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color">save</span>'
    rtn += '  <span class="material-symbols-outlined mergely-toolbar-button-color">save_as</span>'
    rtn += '</div>'
    rtn += '</div>'
    return rtn;
}

$(document).on("click", "#mergely-toolbar-left-folderlink", async () => {
    await mergely_folderLink_Check('left');
});

$(document).on("click", "#mergely-toolbar-right-folderlink", async () => {
    await mergely_folderLink_Check('right');
});

async function mergely_folderLink_Check(target) {
    let isNew = false;
    if (typeof linkStatus2['mergely_' + target] !== 'undefined') {
        //change Directory
        if (linkStatus2['mergely_' + target].ishandle) {
            isNew = true;
        }
    }
    if (await Directory_Handle_Register_2('mergely_' + target,isNew) === 'OK') {
        //new Directory
        console.log(target + '-Linked');
        await mergely_folderLink_pulldownCreate(target)
        await mergely_text_set_main(target, $('#mergely-toolbar-' + target + '-pulldown').val());
    }
}
let fileList = { left: {}, right: {} };

class mergely_file {
    constructor(fullname) {
        this.fullname = fullname;
        this.prefix = fullname.indexOf('_') === -1 ? '' : fullname.substring(fullname.indexOf('_'), fullname.indexOf('.'));
        this.ext = fullname.substring(fullname.indexOf('.'), fullname.length);
        if (this.prefix.length === 0) {
            this.name = fullname.substring(0, fullname.indexOf('.'));
        }
        else {
            this.name = fullname.substring(0, Math.min(fullname.indexOf('.'), fullname.indexOf('_')));
        }
    }
}
async function mergely_folderLink_pulldownCreate(target) {
    $("#mergely-toolbar-" + target + "-folderlink").css('color', 'green');
    let dictionary_name = linkStatus2['mergely_' + target].handle.name;
    $('#mergely-toolbar-' + target + '-pulldown').html('');
    let count = 0;
    fileList[target] = {};
    for await (const handle of linkStatus2['mergely_' + target].handle.values()) {
        if (handle.kind === 'file') {
            count++;
            if (linkStatus2['mergely_' + target].ishandle) {
                $('#mergely-toolbar-' + target + '-pulldown').append('<option value="' + handle.name + '">' + dictionary_name + '/' + handle.name + '</option>');
                let mergely_file_set = new mergely_file(handle.name);
                fileList[target][mergely_file_set.fullname] = mergely_file_set;
            }
        } else if (handle.kind === 'directory') {
            //console.log(handle.name + '/');
        }
    }
    if (count === 0) {
        $('#mergely-toolbar-' + target + '-pulldown').append('<option>' + dictionary_name + 'にファイルがありません。' + '</option>');
    }
}

$(document).on("change", "#mergely-toolbar-left-pulldown", async () => {
    await mergely_text_set_main('left', $('#mergely-toolbar-left-pulldown').val());
});
$(document).on("change", "#mergely-toolbar-right-pulldown", async () => {
    await mergely_text_set_main('right', $('#mergely-toolbar-right-pulldown').val());
});

$(document).on("click", "#mergely-toolbar-left-save", async () => {
    await mergely_text_save('left', $('#mergely-toolbar-left-pulldown').val());
});
$(document).on("click", "#mergely-toolbar-right-save", async () => {
    await mergely_text_save('right', $('#mergely-toolbar-right-pulldown').val());
});

async function mergely_text_set_main(target, fullname) {
    if (backup[target].fullname !== '') {
        if (await mergely_text_get(target) !== backup[target].data) {
            if (!window.confirm('保存されていないデータがあります。続行しますか？' + target)) {
                $('#mergely-toolbar-' + target + '-pulldown').val(backup[target].fullname);
                return null;
            }
        }
    }
    await mergely_text_set(target, fullname);
    await mergely_sync_both(target, fullname);
}

async function mergely_sync_both(target, fullname) {
    let reverse = target === 'left' ? 'right' : 'left';
    if (typeof linkStatus2['mergely_' + reverse] === 'undefined') {
        return;
    }

    if (!linkStatus2['mergely_' + reverse].ishandle) {
        console.log('reverse not linked');
        return;
    }
    
    if (backup[reverse].fullname !== '') {
        if (await mergely_text_get(reverse) !== backup[reverse].data) {
            if (!window.confirm('保存されていないデータがあります。続行しますか？' + reverse)) {
                $('#mergely-toolbar-' + reverse + '-pulldown').val(backup[reverse].fullname);
                return null;
            }
        }
    }

    let search_target = Object.keys(fileList[reverse]);
    for (let i = 0; i < search_target.length; i++) {
        if (fileList[target][fullname].name === fileList[reverse][search_target[i]].name) {
            await mergely_text_set(reverse, fileList[reverse][search_target[i]].fullname);
            break;
        }
    }
}
let backup = { left: { fullname: '', data: '' }, right: { fullname: '', data: '' } }

async function mergely_text_set(target, fullname) {
    let text = await file_read_text(fullname, linkStatus2['mergely_' + target].handle);
    if (text.length === 0) {
        text = 'Not TextFile Written';
    }
    if (target === 'left') {
        $('#mergely').mergely('lhs', text);
    }
    else if (target === 'right') {
        $('#mergely').mergely('rhs', text);
    } else {
        return;
    }
    backup[target].fullname = fullname;
    backup[target].data = text;
    $('#mergely-toolbar-' + target + '-pulldown').val(fullname)
}

async function mergely_text_get(target) {
    let data = '';
    if (target === 'right') {
        data = $('#mergely').mergely('get', 'rhs');
    }
    else if (target === 'left') {
        data = $('#mergely').mergely('get', 'lhs');
    }
    return data;
}

async function mergely_text_save(target, fullname) {
    let data = await mergely_text_get(target);
    await file_save_text(fullname, data, 'mergely_' + target);
    backup[target].fullname = fullname;
    backup[target].data = data;
}

async function mergely_render() {
    $('#mergely').mergely();
}