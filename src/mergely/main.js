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
async function mergely_folderLink_pulldownCreate(target, L_R) {
    let count = 0;
    fileList[L_R] = {};
    let create_target = $('#mergely_toolbar_' + L_R + '_file');
    create_target.html('');
    for await (const handle of diff_Directory.dir[target].handle.values()) {
        if (handle.kind === 'file') {
            count++;
            create_target.append('<option value="' + handle.name + '">' + handle.name + '</option>');
            let mergely_file_set = new mergely_file(handle.name);
            fileList[L_R][mergely_file_set.fullname] = mergely_file_set;
        } else if (handle.kind === 'directory') {
            //console.log(handle.name + '/');
        }
    }
}

$(document).on("change", "#mergely_toolbar_left_folder", async () => {
    await mergely_folderLink_pulldownCreate($("#mergely_toolbar_left_folder").val(), 'left');
    await mergely_text_set_main('left', backup.left.fullname, diff_Directory.dir[$('#mergely_toolbar_left_folder').val()].handle);
});
$(document).on("change", "#mergely_toolbar_right_folder", async () => {
    await mergely_folderLink_pulldownCreate($("#mergely_toolbar_right_folder").val(), 'right');
    await mergely_text_set_main('right', backup.right.fullname, diff_Directory.dir[$('#mergely_toolbar_right_folder').val()].handle);
});


$(document).on("change", "#mergely_toolbar_left_file", async () => {
    await mergely_text_set_main('left', $('#mergely_toolbar_left_file').val(), diff_Directory.dir[$('#mergely_toolbar_left_folder').val()].handle);
});
$(document).on("change", "#mergely_toolbar_right_file", async () => {
    await mergely_text_set_main('right', $('#mergely_toolbar_right_file').val(), diff_Directory.dir[$('#mergely_toolbar_right_folder').val()].handle);
});


$(document).on("click", "#mergely-toolbar-left-save", async () => {
    await mergely_text_save('left', $('#mergely_toolbar_left_file').val());
});
$(document).on("click", "#mergely-toolbar-right-save", async () => {
    await mergely_text_save('right', $('#mergely_toolbar_right_file').val());
});

$(document).on("click", "#mergely_toolbar_diff_prev", async () => {
    $('#mergely').mergely('scrollToDiff', 'prev');
});
$(document).on("click", "#mergely_toolbar_diff_next", async () => {
    $('#mergely').mergely('scrollToDiff', 'next');
});

$(document).on("click", "#mergely_toolbar_update_left", async () => {
    await mergely_text_set('left', $('#mergely_toolbar_left_file').val(), diff_Directory.dir[$('#mergely_toolbar_left_folder').val()].handle);
});
$(document).on("click", "#mergely_toolbar_update_right", async () => {
    await mergely_text_set('right', $('#mergely_toolbar_right_file').val(), diff_Directory.dir[$('#mergely_toolbar_right_folder').val()].handle);
});

async function mergely_text_set_main(target, fullname, handle) {
    await mergely_text_set(target, fullname, handle);
    if (mergely_fileLink) {
        await mergely_sync_both(target, fullname);
    }
}

async function mergely_sync_both(target, fullname) {
    let reverse = target === 'left' ? 'right' : 'left';

    let search_target = Object.keys(fileList[reverse]);

    for (let i = 0; i < search_target.length; i++) {
        if (fileList[target][fullname].name === fileList[reverse][search_target[i]].name) {
            await mergely_text_set(reverse, fileList[reverse][search_target[i]].fullname, diff_Directory.dir[$('#mergely_toolbar_' + reverse + '_folder').val()].handle);
            break;
        }
    }
}
let backup = { left: { fullname: '', data: '' }, right: { fullname: '', data: '' } }

async function mergely_text_set(target, fullname, handle) {
    let fileList_array = Object.keys(fileList[target]);
    for (let i = 0; i < fileList_array.length; i++) {
        if (fileList_array[i] === fullname || fullname === '') {
            let text = await file_read_text(fullname, handle);
            if (text.length === 0) {
                //text = 'Not TextFile Written';
                return null;
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
            $('#mergely_toolbar_' + target + '_file').val(fullname)
            return null;
        }
    }
    return null;
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
    await file_save_text(fullname, data, diff_Directory.dir[$('#mergely_toolbar_' + target + '_folder').val()].handle);
    backup[target].fullname = fullname;
    backup[target].data = data;
}

async function mergely_render() {
    $('#mergely').mergely();
}
let mergely_fileLink = true;

$(document).on("click", "#mergely_toolbar_link", async () => {
    let target = $("#mergely_toolbar_link");
    if (mergely_fileLink) {
        //Link -> Unlink
        target.css('color', 'red');
        target.text('link_off');
        mergely_fileLink = false;
    }
    else {
        //Unlink -> Link
        target.css('color', 'green');
        target.text('link');
        mergely_fileLink = true;
    }
});
