const monacoLang = async () => {
    monaco.languages.register({ id: 'rpg' });
    monaco.languages.register({ id: 'rpg-indent' });
    monaco.languages.register({ id: 'dds' });
    monaco.languages.register({ id: 'dsp' });
    monaco.languages.register({ id: 'cl' });

    monaco.languages.setLanguageConfiguration('dds', {
        // symbols used as brackets
        "brackets": [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"]
        ],
        // symbols that that can be used to surround a selection
        "surroundingPairs": [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
            ["\"", "\""],
            ["'", "'"]
        ]
    });

    monaco.languages.setLanguageConfiguration('cl', {
        // symbols used as brackets
        "brackets": [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"]
        ],
        // symbols that that can be used to surround a selection
        "surroundingPairs": [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"],
            ["\"", "\""],
            ["'", "'"]
        ],
        "comments": {
            "blockComment": ["/*", "*/"]
        }
    });
    monaco.languages.setLanguageConfiguration('rpg-indent', {
        indentSize: 2,
        useTabStops: false,
        brackets: [
            ['{', '}'],
        ],
    });

    monaco.languages.setMonarchTokensProvider('rpg', rpg_token());
    monaco.languages.setMonarchTokensProvider('rpg-indent', rpg_token2());
    monaco.languages.setMonarchTokensProvider('dds', dds_token());
    monaco.languages.setMonarchTokensProvider('cl', cl_token());

    const flag_regex = /\*IN[0-9][0-9]/;
    monaco.languages.registerDefinitionProvider('rpg-indent', {
        provideDefinition: async function (model, position) {
            let row = model.getLineContent(position.lineNumber);
            let text = getRow_Text(row, position.column);
            const wordStr = text.text.trim();
            if (wordStr === "") {
                return null;
            }
            let ranges = [];

            let lineCount = model.getLineCount();
            for (let i = 1; i <= lineCount; i++) {
                let row = model.getLineContent(i);
                if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "C") {
                    let op_1 = row.substring(17, 27).trim();
                    let op_m = row.substring(45, 50).trim();
                    let op_2 = row.substring(50, 60).trim();
                    let fieldLen = row.substring(67, 70).trim();
                    let result = row.substring(60, 66).trim();
                    if (op_m === 'DEFN') {
                        if (wordStr === result) {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                            break;
                        }
                    } else if (op_m === 'PARM') {
                    }
                    else if (op_m === 'PLIST' || op_m === 'KLIST') {
                        if (wordStr === op_1) {
                            let found = false;
                            for (let p = i + 1; p <= lineCount; p++) {
                                let row_extend = model.getLineContent(p);
                                let op_m_extend = row_extend.substring(45, 50).trim();
                                if (op_m_extend !== 'PARM' && op_m_extend !== 'KFLD') {
                                    ranges.push({ range: new monaco.Range(i, 5, p - 1, 77), uri: model.uri });
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                            }
                            break;
                        }
                    } else {
                        if (wordStr === result && fieldLen !== '') {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                        } else if (wordStr === result && wordStr.substring(0, 1) === "*") {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                        }
                    }
                    if (text.type === 'flag' || text.type === 'flag1' || text.type === 'flag2' || text.type === 'flag3') {
                        let wordStr_flag = "*IN" + wordStr;
                        if (wordStr_flag === result) {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                        }
                    }
                    if (flag_regex.test(wordStr)) {
                        let flag = [];
                        flag.push(row.substring(71, 73));
                        flag.push(row.substring(73, 75));
                        flag.push(row.substring(75, 77));
                        if (flag.includes(wordStr.substring(3, 5))) {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                        }
                    }
                } else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "I") {
                    let field = row.substring(52, 58).trim();
                    if (wordStr === field) {
                        ranges.push({ range: new monaco.Range(i, 5, i, 80), uri: model.uri });
                    }
                } else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "F" && row.substring(52, 53) === "K") {
                    let field_2 = row.substring(59, 67).trim();
                    if (wordStr === field_2) {
                        for (let ri = i; ri > 0; ri--) {
                            row = model.getLineContent(ri);
                            if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "F" && row.substring(52, 53) !== "K") {
                                ranges.push({ range: new monaco.Range(ri, 7, ri, 16), uri: model.uri });
                                break;
                            }
                        }

                    }
                }
            }
            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                ranges.push(refDef.location);
            } else {
                sourceRefDef = await sourceRefDefStart(model, sourceRefDef);
                let sourceDef = await sourceRefDef.get(wordStr);
                if (typeof (sourceDef) !== 'undefined') {
                    ranges.push(sourceDef.location);
                }
            }
            return ranges;
        }
    });
    monaco.languages.registerReferenceProvider('rpg-indent', {
        provideReferences: async function (model, position) {
            let row = model.getLineContent(position.lineNumber);
            let text = getRow_Text(row, position.column);
            const wordStr = text.text.trim();
            if (wordStr === "") {
                return null;
            }
            let ranges = [];
            let lineCount = model.getLineCount();
            for (let i = 1; i <= lineCount; i++) {
                let row = model.getLineContent(i);
                if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "C" && position.lineNumber !== i) {
                    let op_1 = row.substring(17, 27).trim();
                    //let op_m = row.substring(45, 50).trim();
                    let op_2 = row.substring(50, 60).trim();
                    //let fieldLen = row.substring(67, 70).trim();
                    let result = row.substring(60, 66).trim();

                    if (wordStr === op_1 || wordStr === op_2 || wordStr === result) {
                        ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr) + 1, i, row.lastIndexOf(wordStr) + wordStr.length + 1), uri: model.uri });
                    }
                    if (text.type === 'flag' || text.type === 'flag1' || text.type === 'flag2' || text.type === 'flag3') {
                        let wordStr_flag = "*IN" + wordStr;
                        if (wordStr_flag === op_1 || wordStr_flag === op_2) {
                            ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr_flag) + 1, i, row.lastIndexOf(wordStr_flag) + wordStr_flag.length + 1), uri: model.uri });
                        }
                    }
                    if (flag_regex.test(wordStr)) {
                        let flag = [];
                        flag.push(row.substring(9, 11));
                        flag.push(row.substring(12, 14));
                        flag.push(row.substring(15, 17));
                        flag.push(row.substring(71, 73));
                        flag.push(row.substring(73, 75));
                        flag.push(row.substring(75, 77));
                        if (flag.includes(wordStr.substring(3, 5))) {
                            ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr.substring(3, 5)) + 1, i, row.lastIndexOf(wordStr.substring(3, 5)) + 3), uri: model.uri });
                        }
                    }
                } else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "I") {
                    let field = row.substring(52, 58).trim();
                    if (wordStr === field) {
                        ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr), i, row.indexOf(wordStr) + wordStr.length), uri: model.uri });
                    }
                }
                else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "F" && row.substring(52, 53) !== "K") {
                    let field = row.substring(6, 14).trim();
                    if (wordStr === field) {
                        ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr), i, row.indexOf(wordStr) + wordStr.length), uri: model.uri });
                    }
                } else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "F" && row.substring(52, 53) === "K") {
                    let field_1 = row.substring(18, 28).trim();
                    let field_2 = row.substring(59, 67).trim();
                    if (wordStr === field_2) {
                        ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr), i, row.indexOf(wordStr) + wordStr.length), uri: model.uri });
                    }
                }
            }
            //
            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                ranges.push(refDef.location);
            }
            return ranges;
        }
    });
    monaco.languages.registerHoverProvider('rpg-indent', {
        provideHover: async function (model, position) {
            // 変数名の取得
            let word = model.getWordAtPosition(position);
            if (!word) {
                return null;
            };
            let row = model.getLineContent(position.lineNumber);
            let text = getRow_Text(row, position.column);
            const wordStr = text.text.trim();
            if (wordStr.length === 0) {
                return null;
            }
            //rpg-source create
            sourceRefDef = await sourceRefDefStart(model, sourceRefDef);

            let tooltip_text = await hoverTextCreate(text, wordStr);
            // ホバー情報の作成
            return {
                range: new monaco.Range(position.lineNumber, text.startColumn, position.lineNumber, text.endColumn),
                contents: [
                    { value: tooltip_text[0] },
                    { value: tooltip_text[1] },
                    { value: tooltip_text[2] }
                ]
            };
        }
    });
    monaco.languages.registerFoldingRangeProvider('rpg-indent', {
        provideFoldingRanges: function (model, context, token) {
            //console.log(model, context, token, "test");
            // 折りたたむ範囲を格納する配列
            var ranges = [];

            // 行数を取得
            var lineCount = model.getLineCount();

            for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
                // 行のテキストを取得
                let lineText = model.getLineContent(lineNumber);
                // 折りたたみ範囲の開始行を判定
                let plus = lineText.substring(27, 45).indexOf("{");
                if (plus !== -1 && lineText.substring(5, 7) === "C ") {
                    // 折りたたみ範囲が開始された
                    let startLineNumber = -1;
                    let endLineNumber = -1;
                    startLineNumber = lineNumber;
                    for (let endLineRow = startLineNumber + 1; endLineRow <= lineCount; endLineRow++) {
                        let endlineText = model.getLineContent(endLineRow);
                        if (endlineText.substring(5, 7) === "C ") {
                            if (endlineText.substring(27, 45).substr(plus, 1) === "}") {
                                // 折りたたみ範囲が終了した
                                endLineNumber = endLineRow - 1;

                                // 折りたたみ範囲を配列に追加
                                if (startLineNumber !== -1 && endLineNumber !== -1) {
                                    ranges.push({
                                        start: startLineNumber,
                                        end: endLineNumber
                                    });
                                }
                                break;
                            }
                        }
                    }
                }
            }
            // 折りたたみ範囲を返す
            return ranges;
        }
    })
    const hoverTextCreate = async (text, wordStr) => {
        let tooltip_text = ["", "", ""];
        let target = 'tip_' + text.type;
        if (window[target].type === "fixed") {
            tooltip_text[0] = '**' + wordStr + '**';
            tooltip_text[1] = window[target].description;
        } else if (window[target].type === "simpleDetail") {
            let tip = window[target].detail[text.text.trim()];
            if (typeof (tip) === "undefined") {
                tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
                tooltip_text[1] = window[target].description
            } else {
                tooltip_text[0] = '**' + tip.name + " : " + wordStr + '**';
                tooltip_text[1] = tip.description;
                if (typeof (tip.description2) !== 'undefined') {
                    tooltip_text[2] = tip.description2;
                }
            }
        } else if (window[target].type === "Detail_2") {
            let tip = window[target].detail[text.text];
            tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
            tooltip_text[1] = tip.description;
        } else if (window[target].type === "substr") {
            let tip = window[target].detail[text.text.substring(0, window[target].len)];
            tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
            tooltip_text[1] = tip.description;
        } else if (window[target].type === "auto-fixed") {
            tooltip_text[0] = '**' + wordStr + '**';
            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                tooltip_text[1] = refDef.description;
            } else {
                let sourceDef = await sourceRefDef.get(wordStr);
                if (typeof (sourceDef) !== 'undefined') {
                    tooltip_text[1] = sourceDef.description;
                } else {
                    tooltip_text[1] = window[target].description;
                }
            }
        }
        return tooltip_text;
    }
    monaco.languages.registerHoverProvider('dds', {
        provideHover: async function (model, position) {
            // 変数名の取得
            let word = model.getWordAtPosition(position);
            if (!word) {
                return null;
            };
            let row = model.getLineContent(position.lineNumber);
            let text = getRow_DDSText(row, position.column);

            const wordStr = text.text.trim();
            if (wordStr.length === 0) {
                return null;
            }
            let tooltip_text = await hoverTextCreate(text, wordStr);
            // ホバー情報の作成
            return {
                range: new monaco.Range(position.lineNumber, text.startColumn, position.lineNumber, text.endColumn),
                contents: [
                    { value: tooltip_text[0] },
                    { value: tooltip_text[1] },
                    { value: tooltip_text[2] }
                ]
            };
        }
    });
    monaco.languages.registerDefinitionProvider('dds', {
        provideDefinition: async function (model, position) {
            let row = model.getLineContent(position.lineNumber);
            let text = getRow_DDSText(row, position.column);
            const wordStr = text.text.trim();
            if (wordStr === "") {
                return null;
            }
            let ranges = [];
            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                ranges.push(refDef.location);
            }
            return ranges;
        }
    });
}
const dds_DefinitionList = async (model, map, refName, handle, use) => {
    const createDescription = async (start_row, i, model, max, loopCheck = 0) => {
        let sp_op_full = start_row.substring(44, 80).trim();
        let text_p = sp_op_full.indexOf("TEXT('");
        let colhdg_p = sp_op_full.indexOf("COLHDG('");
        if (text_p !== -1 || colhdg_p !== -1) {
            if (sp_op_full.indexOf("')") !== -1) {
                //1行完結
                if (text_p !== -1) {
                    return sp_op_full.substring(text_p + 6, sp_op_full.indexOf("')"));
                } else if (colhdg_p !== -1) {
                    return sp_op_full.substring(colhdg_p + 8, sp_op_full.indexOf("')"));
                }
            } else {
                let start_row_desc = "";
                if (text_p !== -1) {
                    if (sp_op_full.lastIndexOf("+") !== -1) {
                        start_row_desc = sp_op_full.substring(text_p + 6, sp_op_full.lastIndexOf("+"));
                    } else if (sp_op_full.lastIndexOf("-") !== -1) {
                        start_row_desc = sp_op_full.substring(text_p + 6, sp_op_full.lastIndexOf("-"));
                    }
                } else if (colhdg_p !== -1) {
                    if (sp_op_full.lastIndexOf("+") !== -1) {
                        start_row_desc = sp_op_full.substring(colhdg_p + 8, sp_op_full.lastIndexOf("+"));
                    } else if (sp_op_full.lastIndexOf("-") !== -1) {
                        start_row_desc = sp_op_full.substring(colhdg_p + 8, sp_op_full.lastIndexOf("-"));
                    }
                }
                if (max === i) {
                    console.log('MAX');
                    return start_row_desc;
                }
                let next_row = await model.getLineContent(i + 1);
                let value = next_row.substring(18, 24).trim();
                if (next_row.substring(6, 7) === "*") {
                    console.log('COMMENT');
                    return start_row_desc;
                } else if (value.length === 0) {
                    let sp_op_full_next = next_row.substring(44, 80).trim();
                    let nextRow_desc = sp_op_full_next.substring(0, sp_op_full_next.lastIndexOf("'"));

                    return start_row_desc + nextRow_desc;
                }
            }
        } else {
            if (loopCheck >= 3 || max === i) {
                return 'undefined';
            } else {
                for (let p = i + 1; p <= max; p++) {
                    let nextText = await model.getLineContent(p);
                    if (nextText.substring(5, 6) === 'A' && nextText.substring(6, 7) !== '*') {
                        return createDescription(nextText, p, model, max, loopCheck + 1);
                    }
                }


            }
        }
    }
    let lineCount = model.getLineCount();
    let readStart = true;
    let rangeContinue = -1;
    let rangeContinue_value = '';
    let description = "";
    let R_file = [];
    let R_name = [];
    for (let i = 1; i <= lineCount; i++) {
        let row = model.getLineContent(i);
        let value = row.substring(18, 24).trim();
        let valType = row.substring(16, 17).trim();
        let sp_op = row.substring(44, 49).trim();

        if (valType === 'R') {
            readStart = true;
            R_name.push(value);
        }
        if (sp_op === 'PFILE') {
            readStart = false;
            R_file.push(row.substring(50, row.indexOf(')')));
        }
        if (readStart === true && row.substring(5, 6) === 'A' && row.substring(6, 7) !== '*') {
            if (rangeContinue > 0) {
                if (value.length > 0) {//continue End
                    let start = rangeContinue;
                    for (let p = 1; p < rangeContinue; p++) {
                        let back_row = model.getLineContent(rangeContinue - p);
                        if (back_row.substring(6, 7) === '*') {
                            start = rangeContinue - p;
                        } else {
                            break;
                        }
                    }
                    let end = i - 1;
                    for (let p = 1; p < end; p++) {
                        let back_row = model.getLineContent(end);
                        if (back_row.substring(6, 7) === '*') {
                            end = end - 1;
                        } else {
                            break;
                        }
                    }
                    map.set(rangeContinue_value, { location: { range: new monaco.Range(start, 5, end, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : ' + description, s_description: description, sourceType: "definition", handle: handle });
                    rangeContinue = i;
                    rangeContinue_value = value;
                    description = await createDescription(row, i, model, lineCount);
                } else if (sp_op.length === 0) {//Other Line
                    let start = rangeContinue;
                    for (let p = 1; p < rangeContinue; p++) {
                        let back_row = model.getLineContent(rangeContinue - p);
                        if (back_row.substring(6, 7) === '*') {
                            start = rangeContinue - p;
                        } else {
                            break;
                        }
                    }
                    let end = i - 1;
                    for (let p = 1; p < end; p++) {
                        let back_row = model.getLineContent(end);
                        if (back_row.substring(6, 7) === '*') {
                            end = end - 1;
                        } else {
                            break;
                        }
                    }
                    map.set(rangeContinue_value, { location: { range: new monaco.Range(start, 5, end, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : ' + description, s_description: description, sourceType: "definition", handle: handle });
                    rangeContinue = -1;
                }
            } else {
                //多分最初
                if (value.length > 0) {
                    rangeContinue = i;
                    rangeContinue_value = value;
                    description = await createDescription(row, i, model, lineCount);
                }
            }
        }
        if (rangeContinue > 0 && lineCount === i) {
            map.set(rangeContinue_value, { location: { range: new monaco.Range(rangeContinue, 5, i, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : ' + description, s_description: description, sourceType: "definition", handle: handle });
        }
    }
    let fileDescription = "FIleObject";
    if (R_name.length > 0) {
        for (let i = 1; i <= lineCount; i++) {
            let row = model.getLineContent(i);
            let value = row.substring(18, 24).trim();

            if (row.substring(5, 6) === 'A' && row.substring(6, 7) !== '*' && value === R_name[0]) {
                fileDescription = await createDescription(row, i, model, lineCount)
            }
        }
    }
    let clone = structuredClone(use);
    if (map.has(refName)) {
        let before = map.get(refName);
        clone.io = new Set([...clone.io, ...before.use.io]);
    }
    map.set(refName, { location: { range: new monaco.Range(1, 5, lineCount, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : ' + fileDescription, s_description: fileDescription, sourceType: "file", handle: handle, use: clone });
    if (R_file.length > 0) {
        for (let i = 0; i < R_file.length; i++) {
            if (additionalRefDef.has(R_file[i])) {
                let before = additionalRefDef.get(R_file[i]);
                use.io = new Set([...use.io, ...before.use.io]);
            }
            additionalRefDef.set(R_file[i], { name: R_file[i], use: use });
        }
    }
    //console.log(map);
    return map;
}

const createUseFileList = async (refDef) => {
    let html = "";
    const sidebar_contents = document.getElementById('right-sideBar-contents');
    const selectedRadio = document.querySelector('input[name="rs-mode"]:checked');
    mode = selectedRadio.value;
    sidebar_contents.innerHTML = "";
    let filter_style = themeCSS_FilterStyle();
    const get_template = (fileName, desc, library, langIcon, filter, use) => {
        if (use.io.size === 0) {
            let temp = "";
            temp += '<div id="sidebar-contents-' + fileName + ' " class="sidebar-contents hoverButton">';
            temp += '<img  class="refSize control-iconButton" style="filter: ' + filter + ';" src="./icon/' + langIcon + '.svg">';
            temp += '<span class="sidebar-filename">' + fileName + '</span>';
            temp += '<span style="overflow: overlay; text-wrap: nowrap;">' + desc + '</span>';
            temp += '<span style="font-size: 0.8rem; padding-left: 2rem;">' + library + '</span>';
            temp += '</div>';
            return (temp);
        } else {
            let border_class = "";
            let useStr = "";

            if (use.io.has("U") && use.io.has("O")) {
                useStr = "U/O";
                border_class = "output_border";
            } else if (use.io.has("I") && use.io.has("O")) {
                useStr = "I/O";
                border_class = "output_border";
            } else if (use.io.has("O")) {
                useStr = "O";
                border_class = "output_border";
            } else if (use.io.has("U")) {
                useStr = "U";
                border_class = "update_border";
            } else if (use.io.has("I")) {
                useStr = "I";
                border_class = "input_border";
            }

            let temp = "";
            temp += '<div id="sidebar-contents-' + fileName + ' " class="sidebar-contents hoverButton ' + border_class + '">';
            temp += '<img  class="refSize control-iconButton" style="filter: ' + filter + ';" src="./icon/' + langIcon + '.svg">';
            temp += '<span class="sidebar-filename">' + fileName + '</span>';
            temp += '<span style="overflow: overlay; text-wrap: nowrap;">' + desc + '</span>';
            temp += '<span style="font-size: 0.8rem; justly-contents: center;">' + useStr + '</span>';
            temp += '<span style="font-size: 0.8rem;">' + library + '</span>';
            temp += '</div>';
            return (temp);
        }
    }
    if (mode === 'file') {
        let existFile = [];
        //Filter Element Create
        html += '<div id="sidebar-filter-root">';
        if (filter.Ref) {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Ref" type="checkbox" checked/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Ref"><img id="sidebar-filter-svg" class="refSize control-iconButton" style="filter: ' + filter_style + ';" src="./icon/database-search.svg" ></label></span>';
        } else {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Ref" type="checkbox"/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Ref"><img id="sidebar-filter-svg" class="refSize control-iconButton" style="filter: ' + filter_style + ';" src="./icon/database-search.svg" ></label></span>';
        }
        if (filter.Input) {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Input" type="checkbox" checked/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Input">I</label></span>';
        } else {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Input" type="checkbox"/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Input">I</label></span>';
        }
        if (filter.Update) {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Update" type="checkbox" checked/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Update">U</label></span>';
        } else {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Update" type="checkbox"/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Update">U</label></span>';
        }
        if (filter.Output) {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Output" type="checkbox" checked/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Output">O</label></span>';
        } else {
            html += '<span id="sidebar-filter"><input id="sidebar-filter-Output" type="checkbox"/><label id="sidebar-filter" class="control-iconButton" for="sidebar-filter-Output">O</label></span>';
        }

        let filterContents = [];

        let maxFile = 0;
        refDef.forEach((value, key) => {
            // 第一引数にキーが、第二引数に値が渡される
            if (value.sourceType === 'file') {
                if (value.location.uri.path.indexOf("DSP") !== -1) {
                    maxFile++;
                    existFile.push(key);
                    filterContents.push(get_template(key, value.s_description, value.location.uri.path, get_langIcon(value.location.uri.path), filter_style, value.use));
                }
            }
        });
        refDef.forEach((value, key) => {
            // 第一引数にキーが、第二引数に値が渡される
            if (value.sourceType === 'file') {
                if (value.location.uri.path.indexOf("DSP") === -1) {
                    maxFile++;
                    existFile.push(key);
                    if (isDisplayCheck(value.use)) {
                        filterContents.push(get_template(key, value.s_description, value.location.uri.path, get_langIcon(value.location.uri.path, value.use.original, value.use.device), filter_style, value.use));
                    }
                }
            }
        });
        for (let value of notExist_DDS) {
            if (!existFile.includes(value[0])) {
                maxFile++;
                let notFoundFile = value[1];
                if (isDisplayCheck(notFoundFile.use)) {
                    notFoundFile.use.original = true;
                    filterContents.push(get_template(notFoundFile.name, "Not Found", "", get_langIcon("QDDSSRC", notFoundFile.use.original, notFoundFile.use.device), filter_style, notFoundFile.use));
                }
            };
        }
        html += '<span id="sidebar-filter-count">' + filterContents.length + '/' + maxFile + '</span>';
        html += '</div>';
        for (let i = 0; i < filterContents.length; i++) {
            html += filterContents[i];
        }
    }
    if (mode === 'def') {
        refDef.forEach((value, key) => {
            // 第一引数にキーが、第二引数に値が渡される
            if (value.sourceType === 'definition') {
                if (value.location.uri.path.indexOf("DSP") !== -1) {
                    html += get_template(key, value.s_description, value.location.uri.path, get_langIcon(value.location.uri.path), filter_style, new UseIO_Layout(true));
                }
            }
        });
        refDef.forEach((value, key) => {
            // 第一引数にキーが、第二引数に値が渡される
            if (value.sourceType === 'definition') {
                if (value.location.uri.path.indexOf("DSP") === -1) {
                    html += get_template(key, value.s_description, value.location.uri.path, get_langIcon(value.location.uri.path), filter_style, new UseIO_Layout(true));
                }
            }
        });
    }



    if (mode === 'setting') {
        html = "<h4>Library List Setting</h4>";
        html += "<div></div>";
        html += '<textarea id="settingLibraryList"rows="15" cols="41">' + JSON.stringify(Setting.libraryList) + '</textarea>';
        html += "<button onclick='settingSaveProcess()'>Save</button>";
    }
    sidebar_contents.innerHTML = html;
}

let filter = { Input: true, Update: true, Output: true, Ref: true };
const filterSettingUpdate = (target, isFilter) => {
    filter[target] = isFilter;
    createUseFileList(normalRefDef);
}

const isDisplayCheck = (useType) => {
    if (!filter.Ref) {
        if (!useType.original) {
            return false;
        }
    }
    if (useType.io.has("I") && filter.Input) {
        return true;
    }
    if (useType.io.has("U") && filter.Update) {
        return true;
    }
    if (useType.io.has("O") && filter.Output) {
        return true;
    }
    if (useType.io.size === 0) {
        return true;
    }
    return false;
}
const settingSaveProcess = () => {
    const settingLibraryList = document.getElementById('settingLibraryList');
    let inputText = settingLibraryList.value;
    isJSON(inputText);
}

const isJSON = (str) => {
    try {
        let data = JSON.parse(str);
        Setting.setLibList = data;
        console.log(data);
    } catch (e) {
        window.alert(e);
        return;
    }
}

class UseIO_Layout {
    constructor(original) {
        this.io = new Set();
        this.original = typeof (original) === 'boolean' ? original : false;
        this.device = "";
    }
}