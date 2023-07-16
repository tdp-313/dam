var tabs = new Map();

const tabs_eventStart = () => {

    document.getElementById('monaco-tab').addEventListener('click', async (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'radio') {
            let now_model = await getNormalEditor_Model();
            tabs.set(now_model.id, now_model);
            let select_tabs_MAP = await tabs.get(e.target.value);
            if (typeof (select_tabs_MAP) !== 'undefined') {
                setNormalEditor_Model(select_tabs_MAP);
            }
        }

        if (e.target.tagName === 'IMG' && e.target.src.indexOf("x.svg") !== -1) {
            const selectedRadio = document.querySelector('input[name="rs-tab"]:checked');
            let li = e.target.parentNode.parentNode;
            if (li.getElementsByClassName('tab-item')[0].innerText === selectedRadio.value) {
                let nextTabID = "";
                let nextTabValue = null;
                let breakOK = false;
                const entries = [];
                for (const [key, value] of tabs.entries()) {
                    entries.push(key);
                }
                for (let i = 0; i < entries.length; i++){
                    if (entries[i] === selectedRadio.value) {
                        if (i === 0) {
                            if (entries.length === 1) {
                                return null;
                            }
                            nextTabID = entries[i - 1];
                            nextTabValue = tabs.get(nextTabID);
                        } else {
                            nextTabID = entries[i - 1];
                            nextTabValue = tabs.get(nextTabID);
                        }
                        break;
                    }
                }
                const next_input = document.getElementById('monaco-tab-' + nextTabID);
                next_input.checked = true;
                setNormalEditor_Model(nextTabValue);
            } else {
                selectedRadio.checked = true;
            }
            tabs.delete(li.getElementsByClassName('tab-item')[0].innerText)
            li.remove();
        }

    });
}
const tabs_replace = (model) => {
    const selectedRadio = document.querySelector('input[name="rs-tab"]:checked');
}

const tabs_add = async (model) => {
    let id = model.id
    let tab_check = await tabs.get(id);
    if (typeof (tab_check) !== 'undefined') {
        await setNormalEditor_Model(tab_check);
        const input_dom = document.getElementById('monaco-tab-' + id);
        input_dom.checked = true;
        await refDefStart();
        return null;
    }
    let path = model.uri.path;
    let name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".") === -1 ? path.length : path.lastIndexOf("."));
    let lang_icon = get_langIcon(path);

    const tabs_html = (name, id, lang,path) => {
        let li = document.createElement("li");
        let temp = "";
        temp += '<input type="radio" class="displayHide" id="monaco-tab-' + id + '" name="rs-tab" value="' + id + '" checked></input>';
        temp += '<label for="monaco-tab-' + id + '" class="tab-design">';
        temp += '<img class="refSize" style="width: 1rem; " src="./icon/' + lang + '.svg">';
        temp += '<span class="tab-libnameArea">' + name + '<span class="tab-libnameText">'+ path.substring(1,path.lastIndexOf('/')) +'</span></span>';
        temp += '<img class="refSize control-iconButton" style="width: 1.5rem;" src="./icon/x.svg">';
        temp += '<span class="tab-item" style="display: none;">' + id + '</span>';
        temp += '</label>';
        li.innerHTML = temp;
        li.draggable = true;
        return li;
    }
    await setNormalEditor_Model(model);
    const tabs_dom = document.getElementById('monaco-tab');
    tabs_dom.appendChild(tabs_html(name, id, lang_icon,path));
    tabs.set(id, model);
}

const get_langIcon = (path) => {
    let lang_icon = "";
    if (path.indexOf("DDS") !== -1) {
        lang_icon = 'database';
    } else if (path.indexOf("DSP") !== -1) {
        lang_icon = 'terminal-2';
    } else if (path.indexOf("RPG") !== -1) {
        lang_icon = 'letter-r';
    } else if (path.indexOf("CL") !== -1) {
        lang_icon = 'hash';
    } else {
        lang_icon = 'code-asterix';
    }
    return (lang_icon);
}