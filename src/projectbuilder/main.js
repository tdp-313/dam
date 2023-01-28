const projectBuilder_mainPage = async () => {
    let html = '';
    html += '<div id="projectBuilderSetting">';
    html += await projectBuilder_DirectorySelect();
    html += '<div>';
    console.log(html);
    return (html);
}
let directory_handletemp = [];
const projectBuilder_DirectorySelect = async () => {
    let html = '<div id="projectBuilderSetting">';
    html += '<h1>projectBuilder</h1>';
    html += '<div id="projectBuilder_Contents">'
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
            html += '<li class="projectBuilder_Contents_item" id="projectBuilder_Directory_' + key +'">';
            html += '<div class="flex">';
            html += '<div class="projectBuilder_FolderTitle">' + handle.name + '</div>';
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
$(document).on('click', 'li[id^="projectBuilder_Directory_"]', async (e) => {
    let clicked = e.currentTarget.id.substring(22, e.currentTarget.id.length);
    let handle = directory_handletemp[clicked];
    console.log(handle);
    let loaddata = await file_read_json(data_json_name, handle);
    console.log(loaddata);
    if (loaddata === []) {
        
    }
});
  
class projectbuilder_setting {
    constructor(name) {
        this.project = name;
        this.editProgram = [];
    }
}
class program_detail {
    constructor(name) {
        this.name = name;
        if (name.substring(0, 1) === '#') {
            
        }
        else {
            if (name.length > 3) {
                if (name.substring(name.length - 3, name.length) === 'DSP') {
                    this.type = 'DSPF';
                } else if (name.substring(name.length - 1, name.length) === 'P') {
                    this.type = 'DDSP';
                } else if (name.substring(name.length - 2, name.length -3 ) === 'L') {
                    this.type = 'DSPL';
                } else {
                    this.type = 'RPG';   
                }
            } else {
                this.type = 'RPG';       
            }
        }
    }
}