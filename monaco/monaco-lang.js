const monacoLang = async () => {
    monaco.languages.register({ id: 'rpg' });
    monaco.languages.register({ id: 'rpg-indent' });
    monaco.languages.register({ id: 'dds' });
    monaco.languages.register({ id: 'dsp' });

    monaco.languages.setLanguageConfiguration('dds', {
        brackets: [
            ['(', ')'],
        ],

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
                    if (op_m === 'PARM') {
                        if (wordStr === result) {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
                            break;
                        }
                    } else if (op_m === 'PLIST' || op_m === 'KLIST' || op_m === 'BEGSR') {
                        if (wordStr === op_1) {
                            ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
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
                }
            }
            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                ranges.push(refDef.location);
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
            console.log(position);
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
                else if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "F") {
                    let field = row.substring(6, 14).trim();
                    if (wordStr === field) {
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
            let tip = window[target].detail[text.text];
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
                tooltip_text[1] = window[target].description;
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

            let lineCount = model.getLineCount();

            let refDef = await normalRefDef.get(wordStr);
            if (typeof (refDef) !== 'undefined') {
                ranges.push(refDef.location);
            }
            
            return ranges;
        }
    });
}
const dds_DefinitionList = async (model, map, refName) => {
    const createDescription = async (start_row, i, model, max) => {
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
                    start_row_desc = sp_op_full.substring(text_p + 6, sp_op_full.lastIndexOf("'"));
                } else if (colhdg_p !== -1) {
                    start_row_desc = sp_op_full.substring(colhdg_p + 8, sp_op_full.lastIndexOf("'"));
                }
                if (max === i) {
                    console.log('MAX');
                    return start_row_desc;
                }
                let next_row = model.getLineContent(i + 1);
                let value = next_row.substring(18, 24).trim();
                if (next_row.substring(6, 7) === "*") {
                    console.log('COMMENT');
                    return start_row_desc;
                } else if (value.length === 0) {
                    let sp_op_full_next = next_row.substring(44, 80).trim();
                    let nextRow_desc = sp_op_full_next.substring(sp_op_full_next.indexOf("'") +1, sp_op_full_next.lastIndexOf("'"));

                    return start_row_desc + nextRow_desc;
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
    for (let i = 1; i <= lineCount; i++) {
        let row = model.getLineContent(i);
        let value = row.substring(18, 24).trim();
        let valType = row.substring(16, 17).trim();
        let sp_op = row.substring(44, 49).trim();

        if (valType === 'R') {
            readStart = true;
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
                    map.set(rangeContinue_value, { location: { range: new monaco.Range(start, 0, end, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : '+ description });
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
                    map.set(rangeContinue_value, { location: { range: new monaco.Range(start, 0, end, Number.MAX_VALUE), uri: model.uri }, description:refName + ' : '+  description });
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
            console.log('Last');
            map.set(rangeContinue_value, { location: { range: new monaco.Range(rangeContinue, Number.MIN_VALUE, i, Number.MAX_VALUE), uri: model.uri }, description:refName + ' : '+  description });
        }

    }

    map.set(refName, { location: { range: new monaco.Range(1, Number.MIN_VALUE, lineCount, Number.MAX_VALUE), uri: model.uri }, description: refName + ' : '+ 'FileObject' });
    if (R_file.length > 0) {
        for (let i = 0; i < R_file.length; i++) {
            additionalRefDef.add(R_file[i]);
        }
    }
    //
    console.log(map);
    return map;
}