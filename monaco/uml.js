const createUML = async (model) => {
    var lineCount = model.getLineCount();
    let rtn = 'start\n';
    let C_Start = false;
    for (let i = 1; i <= lineCount; i++) {
        let row = model.getLineContent(i);

        if (!C_Start && row.substring(5, 7) === "C ") {
            C_Start = true;
        }
        else if (C_Start && row.substring(5, 6) !== "C" && row.substring(6, 7) !== "*") {
            C_Start = false;
            break;
        }
        if (C_Start) {
            let bracket = [];
            let rowComment = row.substring(6, 7).trim() === "*" ? row : "";
            let flagControl = row.substring(6, 8).trim();
            let flag_1_N = row.substring(8, 9).trim();
            let flag_1 = row.substring(9, 11).trim();
            let flag_2_N = row.substring(11, 12).trim();
            let flag_2 = row.substring(12, 14).trim();
            let flag_3_N = row.substring(14, 15).trim();
            let flag_3 = row.substring(15, 16).trim();
            let op_1 = row.substring(17, 27).trim();
            let bracket_A = row.substring(17, 45).trim();
            let op_m = row.substring(45, 50).trim();
            let op_2 = row.substring(50, 60).trim();
            let result = row.substring(60, 66).trim();
            let result_flag1 = row.substring(71, 73).trim();
            let result_flag2 = row.substring(73, 75).trim();
            let result_flag3 = row.substring(75, 77).trim();
            let comment = row.substring(77, 92).trim();
            let flag_data = null;
            if (rowComment.length > 0) {
                //rtn += 'note :' + rowComment + '\n';
            } else {

                switch (op_m) {
                    case 'BEGSR':
                        rtn += 'partition ' + op_1 + '{\n';
                        rtn += 'start\n';
                        break;
                    case 'ENDSR':
                        rtn += 'stop\n';
                        rtn += '}\n';
                        break;
                    case 'DOUEQ':
                    case 'DOUNE':
                    case 'DOULT':
                    case 'DOUGT':
                    case 'DOULE':
                    case 'DOUGE':
                    case 'DO':
                    case 'DOWEQ':
                    case 'DOWNE':
                    case 'DOWLT':
                    case 'DOWGT':
                    case 'DOWLE':
                    case 'DOWGE':
                        let u_w = "";
                        if (op_m.length === 5) {
                            u_w = ' ' + op_m.substring(2, 5) + ' ';
                        }
                        rtn += 'while (' + op_1 + u_w + op_2 + ')\n';
                        break;
                    case 'ENDDO':
                        rtn += 'endwhile\n';
                        break;
                    case 'IFEQ':
                    case 'IFNE':
                    case 'IFLT':
                    case 'IFGT':
                    case 'IFLE':
                    case 'IFGE':
                        let eq_ne = ' ' + op_m.substring(2, 4) + ' ';
                        rtn += 'if (' + op_1 + eq_ne + op_2 + ') then (yes) \n';
                        break;
                    case 'ELSE':
                        rtn += 'else (no)\n';
                        break;
                    case 'ENDIF':
                        rtn += 'endif\n';
                        break;
                    case 'LEAVE':
                        flag_data = await flagCheck(flagControl, flag_1_N, flag_1, flag_2_N, flag_2, flag_3_N, flag_3,'yes');
                        rtn += flag_data.start;
                        rtn += '-[#blue]-> leave; \n';
                        rtn += 'break \n';
                        rtn += '-[#black]->; \n';
                        rtn += flag_data.end;
                        break;
                    case 'TAG':
                        rtn += 'label ' + op_1 + ' \n';
                        break;
                    case 'GOTO':
                        flag_data = await flagCheck(flagControl, flag_1_N, flag_1, flag_2_N, flag_2, flag_3_N, flag_3, 'yes');
                        rtn += flag_data.start;
                        rtn += '#palegreen:' + op_m + ' -> ' + op_2 + '; \n';
                        rtn += 'goto ' + op_2 + ' \n';
                        //rtn += 'detach \n';
                        rtn += flag_data.end;
                        break;
                    case 'PLIST':
                    case 'PARM':
                    case 'KLIST':
                    case 'KFLD':
                    case 'DEFN':
                        break;
                    default:
                        let result_str = ""
                        if (result.length > 0) {
                            result_str = ' = ' + result;
                        }
                        flag_data = await flagCheck(flagControl, flag_1_N, flag_1, flag_2_N, flag_2, flag_3_N, flag_3);
                        rtn += flag_data.start;
                        if (result_flag1.length > 0 || result_flag2.length > 0 || result_flag3.length > 0) {
                            rtn += ':' + op_1 + + ' ' + op_m + ' ' + op_2 + result_str + '\n';
                            rtn += 'L-' + result_flag1 + ' M-' + result_flag2 + ' R-' +  result_flag3 + ';\n';
                        } else {
                            rtn += ':' + op_1 + ' ' + op_m + ' ' + op_2 + result_str + ';\n';
                        }
                        rtn += flag_data.end;
                        break;
                }

                if (comment.length > 0) {
                    rtn += 'note :' + rowComment + '\n';
                }
            }


        }
    }
    //rtn += 'stop\n';
    return rtn;
}
const flagCheck = async (flagControl,flag_1_N,flag_1,flag_2_N,flag_2,flag_3_N,flag_3,option = 'yes') => {
    let fragIF = "";
    let flagENDIF = "";
    if (flag_1.length > 0 || flag_2.length > 0 || flag_3.length > 0) {
        let control = 'AND';
        fragIF = "if (";
        if (flagControl === 'OR') {
            control = 'OR';
        }
        if (flag_1.length > 0) {
            if (flag_1_N === 'N') {
                fragIF += '__' + flag_1 + ' = OFF__ ';
            } else {
                fragIF += '__Not' + flag_1 + ' = ON__ ';
            }
        }
        if (flag_2.length > 0) {
            if (flag_1.length > 0) {
                fragIF += ' ' + control + ' ';
            }
            if (flag_2_N === 'N') {
                fragIF += '__' + flag_2 + ' = OFF__ ';
            } else {
                fragIF += '__' + flag_2 + ' = ON__ ';
            }
        }
        if (flag_3.length > 0) {
            if (flag_1.length > 0||flag_2.length > 0) {
                fragIF += ' ' + control + ' ';
            }
            if (flag_3_N === 'N') {
                fragIF += '__' + flag_3 + ' = OFF__ ';
            } else {
                fragIF += '__' + flag_3 + ' = ON__ ';
            }
        }
        fragIF += ') then (' + option + ') \n';
        flagENDIF = 'endif \n';   
    }
    return { start: fragIF, end: flagENDIF };
}