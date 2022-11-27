const specBuilder_mainPage = async () => {
    let html = '';
    html += '<div id="specBuilderSetting">';
    html += await specBuilder_DirectorySelect();
    html += '<div>';
    console.log(html);
    return (html);
}
let directory_handletemp = [];
const specBuilder_DirectorySelect = async () => {
    let html = '<div id="specBuilderSetting">';
    html += '<h1>SpecBuilder</h1>';
    html += '<div id="specBuilder_Contents">'
    html += '<div>';
    //
    if (!linkStatus.ishandle) {
        let message = await Directory_Handle_Registr();
        if (message !== 'OK') {
            return ('<div>Error:ディレクトリにアクセスできません。</div>');
        }
    }
    directory_handletemp = [];
    for await (const handle of linkStatus.handle.values()) {
        if (handle.kind === 'directory') {
            let lastmodified = 0;
            for await (const handle_low of handle) {
                if (handle_low[1].kind === 'file') {
                    let file = await handle_low[1].getFile();
                    if (lastmodified < file.lastModified) {
                        lastmodified = file.lastModified;
                    }
                }
            }
            let lastupdate_string = 'Unknown';
            if (lastmodified > 0) {
                let lastupdate = new Date(lastmodified);
                lastupdate_string = lastupdate.toLocaleDateString() + ' ' + lastupdate.toLocaleTimeString();
            }
            directory_handletemp.push(handle);
            let key = directory_handletemp.length - 1;
            html += '<li class="specBuilder_Contents_item" id="specBuilder_Directory_' + key +'">';
            html += '<div class="flex">';
            html += '<div class="specBuilder_FolderTitle">' + handle.name + '</div>';
            html += '</div>';
            html += '<div class="flex">';
            html += '<div>' + lastupdate_string + '</div>';
            html += '<div class="material-symbols-outlined padding-medium">edit</div>';
            html += '</div>';
            html += '</li>';
        }
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return (html);
}
let data_json_name = 'dam.json';
$(document).on('click', 'li[id^="specBuilder_Directory_"]', async (e) => {
    let clicked = e.currentTarget.id.substring(22, e.currentTarget.id.length);
    let handle = directory_handletemp[clicked];
    console.log(handle);
    let loaddata = await file_read_json(data_json_name, handle);
    console.log(loaddata);
    if (loaddata === []) {
        
    }
});
  
