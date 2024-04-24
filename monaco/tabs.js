var tabs = new Map();

const tabs_eventStart = async () => {
    document.getElementById('monaco-tab').addEventListener('click', async (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'radio') {
            let now_model = await getNormalEditor_Model();
            let now_view = await getNormalEditor_View();
            let id = now_model.id;
            /*
            tabs.set(id, { model: now_model, view: now_view });
            let select_tabs_general = await tabs.get("*");
            if (typeof (select_tabs_general) !== 'undefined') {
                if (select_tabs_general.model.id === id) {
                    tabs.set("*", { model: now_model, view: now_view });
                }
            }*/
        
            let select_tabs_general = await tabs.get("*");
            if (typeof (select_tabs_general) !== 'undefined') {
                if (select_tabs_general.model.id === now_model.id) {
                    tabs.set("*", { model: now_model, view: now_view });
                    if (tabs.has(now_model.id)) {
                        tabs.set(now_model.id, { model: now_model, view: now_view });
                    }
                } else {
                    if (tabs.has(now_model.id)) {
                        tabs.set(now_model.id, { model: now_model, view: now_view });
                    }
                }
            }
            let select_tabs_MAP = await tabs.get(e.target.value);
            if (typeof (select_tabs_MAP) !== 'undefined') {
                await setNormalEditor_Model(select_tabs_MAP.model);
                await setNormalEditor_View(select_tabs_MAP.view);
                await refDefStart(select_tabs_MAP.model);
            }
        }

        if (e.target.tagName === 'IMG' && e.target.src.indexOf("x.svg") !== -1) {
            const selectedRadio = document.querySelector('input[name="rs-tab"]:checked');
            let li = e.target.parentNode.parentNode;
            if (li.getElementsByClassName('tab-item')[0].innerText === selectedRadio.value) {
                let nextTabID = "";
                let nextTabValue = null;
                const entries = [];
                for (const [key, value] of tabs.entries()) {
                    entries.push(key);
                }
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i] === selectedRadio.value) {
                        if (i === 0) {
                            if (entries.length === 1) {
                                break;
                            }
                            nextTabID = entries[i + 1];
                            nextTabValue = tabs.get(nextTabID);
                        } else {
                            nextTabID = entries[i - 1];
                            nextTabValue = tabs.get(nextTabID);
                        }
                        const next_input = document.getElementById('monaco-tab-' + nextTabID);
                        next_input.checked = true;
                        await setNormalEditor_Model(nextTabValue.model);
                        await refDefStart(nextTabValue.model);
                        break;
                    }
                }
            } else {
                selectedRadio.checked = true;
            }
            tabs.delete(li.getElementsByClassName('tab-item')[0].innerText)
            li.remove();
        }
    });
}

const tabs_add = async (model, new_data) => {
    await refDefStart(model);
    let id = "";
    let path = model.uri.path;
    let name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".") === -1 ? path.length : path.lastIndexOf("."));
    let lang_icon = "";

    if (new_data) {//その他
        id = model.id;
        lang_icon = get_langIcon(path);
    }
    else {//*の更新
        id = "*"
        lang_icon = "code-asterix";
    }
    //Prev Save
    let now_model = await getNormalEditor_Model();
    let now_view = await getNormalEditor_View();

    let select_tabs_general = await tabs.get("*");
    if (typeof (select_tabs_general) !== 'undefined') {
        if (select_tabs_general.model.id === now_model.id) {
            tabs.set("*", { model: now_model, view: now_view });
        } else {
            if (tabs.has(now_model.id)) {
                tabs.set(now_model.id, { model: now_model, view: now_view });
            }
        }
    }

    let tab_check = await tabs.get(id);
    const input_dom = document.getElementById('monaco-tab-' + id);
    if (typeof (tab_check) !== 'undefined' && input_dom !== null) {
        if (new_data) {
            await setNormalEditor_Model(tab_check.model);
            await setNormalEditor_View(tab_check.view);
        } else {
            await setNormalEditor_Model(model);
            const libnameArea = input_dom.parentNode.getElementsByClassName('tab-libnameArea')[0];
            libnameArea.textContent = name;
            let pathArea = document.createElement('span');
            pathArea.textContent = path;
            pathArea.classList.add("tab-libnameText");
            libnameArea.appendChild(pathArea);
            tabs.set(id, { model: model, view: await setNormalEditor_View() });
        }
        input_dom.checked = true;
        return null;
    }
    let filter_style = themeCSS_FilterStyle();

    const tabs_html = (name, id, lang, path, filter) => {
        let li = document.createElement("li");
        let temp = "";
        temp += '<input type="radio" class="displayHide" id="monaco-tab-' + id + '" name="rs-tab" value="' + id + '" checked></input>';
        temp += '<label for="monaco-tab-' + id + '" class="tab-design">';
        temp += '<img class="refSize" style="width: 1rem; filter:' + filter + ' " src="./icon/' + lang + '.svg">';
        temp += '<span class="tab-libnameArea">' + name + '<span class="tab-libnameText">' + path.substring(1, path.lastIndexOf('/')) + '</span></span>';
        temp += '<img class="refSize control-iconButton" style="width: 1.5rem;filter:' + filter + '" src="./icon/x.svg">';
        temp += '<span class="tab-item" style="display: none;">' + id + '</span>';
        temp += '</label>';
        li.innerHTML = temp;
        li.draggable = true;
        li.classList.add('tabLayout');
        return li;
    }
    await setNormalEditor_Model(model);
    const tabs_dom = document.getElementById('monaco-tab');
    let dom_li = tabs_html(name, id, lang_icon, path, filter_style);
    tabs_dom.appendChild(dom_li);
    tabs.set(id, { model: model, view: await setNormalEditor_View() });
}

const get_langIcon = (path, original = true, device = "") => {
    let lang_icon = "";
    if (path.indexOf("DDS") !== -1) {
        if (device === "PRINTER") {
            lang_icon = 'print';
        } else {
            if (original) {
                lang_icon = 'database';
            } else {
                lang_icon = 'database-search';
            }
        }

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