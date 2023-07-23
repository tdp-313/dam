const Operetor_OpenArray = [
    'IFEQ ', 'IFNE ', 'IFLT ', 'IFGT ', 'IFLE ', 'IFGE ',
    'DOUEQ', 'DOUNE', 'DOULT', 'DOUGT', 'DOULE', 'DOUGE', 'DO   ',
    'DOWEQ', 'DOWNE', 'DOWLT', 'DOWGT', 'DOWLE', 'DOWGE',
    'SELEC',
];
const Operetor_ElseArray = [
    'ELSE ', 'WHEQ ', 'WHNE ', 'WHLT ', 'WHGT ', 'WHLE ', 'WHGE ', 'OTHER'
];
const Operetor_CloseArray = [
    'END  ', 'ENDDO', 'ENDIF', 'ENDSL'
];
const Subroutine_OpenArray = [
    'BEGSR'
];
const Subroutine_CloseArray = [
    'ENDSR'
];
const rpg_token = () => {
    return (
        {
            OperatorOpen: Operetor_OpenArray,
            OperatorClose: Operetor_CloseArray,
            OperatorOther: [
                'CABEQ', 'CABNE', 'CABLT', 'CABGT', 'CABLE', 'CABGE', 'CAB  ', 'ITER ', 'LEAVE',
                'ANDEQ', 'ANDNE', 'ANDLT', 'ANDGT', 'ANDLE', 'ANDGE', 
                'OREQ ', 'ORNE ', 'ORLT ', 'ORGT ', 'ORLE ', 'ORGE ', 'GOTO ',
            ].concat(Operetor_ElseArray),
            SubroutineOpen: Subroutine_OpenArray,
            SubroutineClose: Subroutine_CloseArray,
            SubroutineOther: [
                'EXSR ', 'CASGT', 'CASLT', 'CASEQ', 'CASNE', 'CASGE', 'CASLE', 'CAS  ', 'ENDCS', 'COMP '
            ],
            Arrays: [
                'LOKUP', 'MOVEA', 'SORTA', 'XPOOT'
            ],
            BitOrders: [
                'BITOF', 'BITON', 'TESTB'
            ],
            CallOrder: [
                'CALL ', 'FREE ', 'PARM ', 'PLIST', 'RETRN'
            ],
            DataFields: [
                'IN   ', 'OUT  ', 'UNKCK'
            ],
            Declarations: [
                'DEFN ', 'KFLD ', 'KLIST', 'PARM ', 'PLIST', 'TAG  '
            ],
            FileIOs: [
                'COMIT', 'DELET', 'DELET', 'EXCPT', 'EXFMT', 'FORCE', 'POST ', 'ROLBK', 'UPDAT', 'WRITE'
            ],
            FilePreIOs: [
                'ACQ  ', 'CHAIN', 'CLOSE', 'EXCPT', 'FEOD ', 'NEXT ', 'OPEN ', 'READ ', 'READC', 'READE', 'READP',
                'REDPE', 'REL  ', 'SETGT', 'SETLL', 'UNLCK'
            ],
            FlagOrders: [
                'SETON', 'SETOF'
            ],
            Information: [
                'DEBUG', 'DUMP ', 'SHTDN', 'TIME ', 'DSPLY', 'TESTB', 'TESTN', 'TESTZ'
            ],
            Arithmetics: [
                'ADD  ', 'DIV  ', 'MULT ', 'MVR  ', 'SQRT ', 'SUB  ', 'XFOOT', 'Z-ADD', 'Z-SUB'
            ],
            StringOrders: [
                'CAT  ', 'CHECK', 'CHEKR', 'SCAN ', 'SUBST', 'XLATE', 'MOVE ', 'MOVEL'
            ],
            ZoneTransfers: [
                'MHHZO', 'MHLZO', 'MLHZO', 'MLLZO'
            ],
            Initializes: [
                'CLEAR', 'RESET'
            ],
            tokenizer: {
                root: [
                    [/.{6}\*.*/, { token: 'comment' }],
                    //     |       |       |  |   |            
                    [/^(.{1,2})(.{1,3})(C)(..)(.)(.{1,2})(.)(.{1,2})(.)(.{1,2})(.{1,10})(.{1,5})(.{1,10})(.{1,6})(.{1,3})(.)(.)(.{1,2})(.{1,2})(.{1,2})(.{1,15})(.*)$/,
                        ['comment', '', 'tag',
                            {
                                cases: {//7-8
                                    ' {2}': 'overwhite',
                                    '(L0|L1|L2|L3|L4|L5|L6|L7|L8|L9|LR|SR)': 'constructor',
                                    '(AN|OR)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//9
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//10-11
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//12
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//13-14
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//15
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//16-17
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//18-27
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '(UDATE|TIME|[\*]YEAR).*': 'number',
                                    'UDATE.*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*]IN[0-9][0-9].*': 'type',
                                    '[\*].*': 'predefined',
                                    "'.*'.*": 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, {//28-32
                                cases: {//control
                                    '@OperatorOpen': { token: 'constant', bracket: '@open' },
                                    '@OperatorClose': { token: 'constant', bracket: '@close' },
                                    '@OperatorOther': 'constant',
                                    '@SubroutineOpen': { token: 'constant', bracket: '@open' },
                                    '@SubroutineClose': { token: 'constant', bracket: '@close' },
                                    '@SubroutineOther': 'constant',
                                    '@Arrays': 'keyword',
                                    '@BitOrders': 'keyword',
                                    '@CallOrder': 'keyword',
                                    '@DataFields': 'keyword',
                                    '@Declarations': 'keyword',
                                    '@FlagOrders': 'keyword',
                                    '@Information': 'keyword',
                                    '@Initializes': 'keyword',
                                    '@Arithmetics': 'regexp',
                                    '@StringOrders': 'regexp',
                                    '@ZoneTransfers': 'regexp',
                                    '@FileIOs': 'entity',
                                    '@FilePreIOs': 'PreIOs',

                                    '@default': 'invalid'
                                },
                            }, {// 33-42
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    '(UDATE|TIME|[\*]YEAR).*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, {//43-48
                                cases: {
                                    '[\*].*': 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, {//49-51
                                cases: {
                                    ' {3}': 'overwhite',
                                    '[1-2][0-9][0-9]': 'number',
                                    ' [0-9][0-9]': 'number',
                                    '  [0-9]': 'number',
                                    '@default': 'invalid'
                                }
                            }, {//52
                                cases: {
                                    ' ': 'overwhite',
                                    '[0-9]': 'number',
                                    '@default': 'invalid'
                                }
                            }, {//53
                                cases: {
                                    ' ': 'overwhite',
                                    '(H|N|P)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//54-55
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//56-57
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//58-59
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, 'comment', ''
                        ]
                    ],
                ],
            },

        }
    );
}
const rpg_token2 = () => {
    return (
        {
            OperatorOpen: Operetor_OpenArray,
            OperatorClose: Operetor_CloseArray,
            OperatorOther: [
                'CABEQ', 'CABNE', 'CABLT', 'CABGT', 'CABLE', 'CABGE', 'CAB  ', 'ITER ', 'LEAVE',
                'ANDEQ', 'ANDNE', 'ANDLT', 'ANDGT', 'ANDLE', 'ANDGE',
                'OREQ ', 'ORNE ', 'ORLT ', 'ORGT ', 'ORLE ', 'ORGE ', 'GOTO ',
            ].concat(Operetor_ElseArray),
            SubroutineOpen: Subroutine_OpenArray,
            SubroutineClose: Subroutine_CloseArray,
            SubroutineOther: [
                'EXSR ', 'CASGT', 'CASLT', 'CASEQ', 'CASNE', 'CASGE', 'CASLE', 'CAS  ', 'ENDCS', 'COMP '
            ],
            Arrays: [
                'LOKUP', 'MOVEA', 'SORTA', 'XPOOT'
            ],
            BitOrders: [
                'BITOF', 'BITON', 'TESTB'
            ],
            CallOrder: [
                'CALL ', 'FREE ', 'PARM ', 'PLIST', 'RETRN'
            ],
            DataFields: [
                'IN   ', 'OUT  ', 'UNKCK'
            ],
            Declarations: [
                'DEFN ', 'KFLD ', 'KLIST', 'PARM ', 'PLIST', 'TAG  '
            ],
            FileIOs: [
                'COMIT', 'DELET', 'DELET', 'EXCPT', 'EXFMT', 'FORCE', 'POST ', 'ROLBK', 'UPDAT', 'WRITE'
            ],
            FilePreIOs: [
                'ACQ  ', 'CHAIN', 'CLOSE', 'EXCPT', 'FEOD ', 'NEXT ', 'OPEN ', 'READ ', 'READC', 'READE', 'READP',
                'REDPE', 'REL  ', 'SETGT', 'SETLL', 'UNLCK'
            ],
            FlagOrders: [
                'SETON', 'SETOF'
            ],
            Information: [
                'DEBUG', 'DUMP ', 'SHTDN', 'TIME ', 'DSPLY', 'TESTB', 'TESTN', 'TESTZ'
            ],
            Arithmetics: [
                'ADD  ', 'DIV  ', 'MULT ', 'MVR  ', 'SQRT ', 'SUB  ', 'XFOOT', 'Z-ADD', 'Z-SUB'
            ],
            StringOrders: [
                'CAT  ', 'CHECK', 'CHEKR', 'SCAN ', 'SUBST', 'XLATE', 'MOVE ', 'MOVEL'
            ],
            ZoneTransfers: [
                'MHHZO', 'MHLZO', 'MLHZO', 'MLLZO'
            ],
            Initializes: [
                'CLEAR', 'RESET'
            ],
            tokenizer: {
                root: [
                    [/.{6}\*.*/, { token: 'comment' }],
                    [/^(.{1,5})(F)(.{1,8}.)(.)(.{1,23})(.{1,8})(.*)$/,
                        ['', 'tag', {
                            cases: {
                                '.{1,8}.{0,8}I': 'type',
                                '.{1,8}.{0,8}U': 'keyword',
                                '.{1,8}.{0,8}O': 'string',
                                '@default': 'ivalid'
                            },
                        }, {
                                cases: {
                                    ' ': 'overwhite',
                                    '(F|R)': 'constant',
                                    'P': 'entity',
                                    'S': 'regexp',
                                    '@default': 'invalid'
                                }
                            }, '', 'constant', '']
                    ],
                    [/^(.{1,5})(I)(.{1,37})(.{1,4})(.{1,4})(.)(.{1,6})(.*)$/,
                        ['', 'tag', '', 'number', 'number', 'constant', 'identifier', '']
                    ],
                    //     |       |       |  |   |            
                    [/^(.{1,2})(.{1,3})(C)(..)(.)(.{1,2})(.)(.{1,2})(.)(.{1,2})(.{1,10})(.{1,18})(.{1,5})(.{1,10})(.{1,6})(.{1,3})(.)(.)(.{1,2})(.{1,2})(.{1,2})(.{1,15})(.*)$/,
                        ['comment', '', 'tag',
                            {
                                cases: {//7-8
                                    ' {2}': 'overwhite',
                                    '(L0|L1|L2|L3|L4|L5|L6|L7|L8|L9|LR|SR)': 'constructor',
                                    '(AN|OR)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//9
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//10-11
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//12
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//13-14
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//15
                                    ' ': 'overwhite',
                                    'N': 'keyword',
                                    '@default': 'invalid'
                                }
                            }, {
                                cases: {//16-17
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//18-27
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    '(UDATE|TIME|[\*]YEAR).*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*]IN[0-9][0-9].*': 'type',
                                    '[\*].*': 'predefined',
                                    "'.*'.*": 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, 'support', {//28-32
                                cases: {//control
                                    '@OperatorOpen': { token: 'constant', bracket: '@open' },
                                    '@OperatorClose': { token: 'constant', bracket: '@close' },
                                    '@OperatorOther': 'constant',
                                    '@SubroutineOpen': { token: 'constant', bracket: '@open' },
                                    '@SubroutineClose': { token: 'constant', bracket: '@close' },
                                    '@SubroutineOther': 'constant',
                                    '@Arrays': 'keyword',
                                    '@BitOrders': 'keyword',
                                    '@CallOrder': 'keyword',
                                    '@DataFields': 'keyword',
                                    '@Declarations': 'keyword',
                                    '@FlagOrders': 'keyword',
                                    '@Information': 'keyword',
                                    '@Initializes': 'keyword',
                                    '@Arithmetics': 'regexp',
                                    '@StringOrders': 'regexp',
                                    '@ZoneTransfers': 'regexp',
                                    '@FileIOs': 'storage',
                                    '@FilePreIOs': 'storage',

                                    '@default': 'invalid'
                                },
                            }, {// 33-42
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    '(UDATE|TIME|[\*]YEAR).*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, {//43-48
                                cases: {
                                    '[\*].*': 'string',
                                    '.*[,].*':'variable',
                                    '@default': 'identifier'
                                }
                            }, {//49-51
                                cases: {
                                    ' {3}': 'overwhite',
                                    '[1-2][0-9][0-9]': 'constant.numeric',
                                    ' [0-9][0-9]': 'constant.numeric',
                                    '  [0-9]': 'constant.numeric',
                                    '@default': 'invalid'
                                }
                            }, {//52
                                cases: {
                                    ' ': 'overwhite',
                                    '[0-9]': 'constant',
                                    '@default': 'invalid'
                                }
                            }, {//53
                                cases: {
                                    ' ': 'overwhite',
                                    '(H|N|P)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//54-55
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//56-57
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, {//58-59
                                cases: {
                                    ' {2}': 'overwhite',
                                    '[0-9][0-9]': 'type',
                                    'K[A-N]': 'type',
                                    'K[P-Y]': 'type',
                                    'L[0-9]': 'type',
                                    '(LR|MR|RT)': 'type',
                                    'H[1-9]': 'type',
                                    'U[1-8]': 'type',
                                    '(O[A-G]|OV)': 'type',
                                    '@default': 'invalid'
                                }
                            }, 'comment', ''
                        ]
                    ],
                ],                
            },

        }
    );
}
const getRow_Text = (row, columns) => {
    if (columns <= 0) {
        return { text: "", startColumn: 0, endColumn: 0 };
    }
    if (row.substring(6, 7) === "*") {
        return { text: "", startColumn: 0, endColumn: 0 };
    }
    if (columns == 6) {
        return { text: row.substring(5, 6), startColumn: 6, endColumn: 7, type: 'format' };
    }

    if (row.substring(5, 6) === "C") {
        if (columns <= 2) {
            return { text: row.substring(0, 2), startColumn: 1, endColumn: 3, type: 'page' };
        }
        else if (columns <= 5) {
            return { text: row.substring(2, 5), startColumn: 3, endColumn: 6, type: 'rowID' };
        }
        else if (columns <= 8) {
            return { text: row.substring(6, 8), startColumn: 7, endColumn: 9, type: 'controlLevel' };
        }
        else if (columns == 9) {
            return { text: row.substring(8, 9), startColumn: 9, endColumn: 10, type: 'flag_not' };
        }
        else if (columns <= 11) {
            return { text: row.substring(9, 11), startColumn: 10, endColumn: 12, type: 'flag' };
        }
        else if (columns == 12) {
            return { text: row.substring(11, 12), startColumn: 12, endColumn: 13, type: 'flag_not' };
        }
        else if (columns <= 14) {
            return { text: row.substring(12, 14), startColumn: 13, endColumn: 15, type: 'flag' };
        }
        else if (columns == 15) {
            return { text: row.substring(14, 15), startColumn: 15, endColumn: 16, type: 'flag_not' };
        }
        else if (columns <= 17) {
            return { text: row.substring(15, 17), startColumn: 16, endColumn: 18, type: 'flag' };
        }
        else if (columns <= 27) {
            return { text: row.substring(17, 27), startColumn: 18, endColumn: 28, type: 'operation1' };
        }
        else if (columns <= 45) {
            return { text: row.substring(27, 45), startColumn: 28, endColumn: 46, type: 'bracket2' };
        }
        else if (columns <= 50) {
            return { text: row.substring(45, 50), startColumn: 46, endColumn: 51, type: 'operation' };
        }
        else if (columns <= 60) {
            return { text: row.substring(50, 60), startColumn: 51, endColumn: 61, type: 'operation2' };
        }
        else if (columns <= 66) {
            return { text: row.substring(60, 66), startColumn: 61, endColumn: 67, type: 'result' };
        }
        else if (columns <= 69) {
            return { text: row.substring(66, 69), startColumn: 67, endColumn: 70, type: 'fieldLen' };
        }
        else if (columns == 70) {
            return { text: row.substring(69, 70), startColumn: 70, endColumn: 71, type: 'fieldDec' };
        }
        else if (columns == 71) {
            return { text: row.substring(70, 71), startColumn: 71, endColumn: 72, type: 'additionaOperation' };
        }
        else if (columns <= 73) {
            return { text: row.substring(71, 73), startColumn: 72, endColumn: 74, type: 'flag1' };
        }
        else if (columns <= 75) {
            return { text: row.substring(73, 75), startColumn: 74, endColumn: 76, type: 'flag2' };
        }
        else if (columns <= 77) {
            return { text: row.substring(75, 77), startColumn: 76, endColumn: 78, type: 'flag3' };
        }
        else if (columns <= 92) {
            return { text: row.substring(77, 92), startColumn: 78, endColumn: 92, type: 'comment' };
        }
        return { text: "", startColumn: 0, endColumn: 0 };
    }

    if (row.substring(5, 6) === "I") {
        if (columns <= 44) {
            return { text: "", startColumn: columns, endColumn: columns, type: 'none' };
        }
        else if (columns <= 47) {
            return { text: row.substring(43, 47), startColumn: 44, endColumn: 48, type: 'ds_start' };
        }
        else if (columns <= 51) {
            return { text: row.substring(47, 51), startColumn: 48, endColumn: 52, type: 'ds_end' };
        }
        else if (columns === 52) {
            return { text: row.substring(51, 52), startColumn: 52, endColumn: 53, type: 'fieldDec' };
        }
        else if (columns <= 58) {
            return { text: row.substring(52, 58), startColumn: 53, endColumn: 59, type: 'fieldName' };
        }
    }

    if (row.substring(5, 6) === "F") {
        if (columns <= 5) {
            return { text: "", startColumn: columns, endColumn: columns, type: 'none' };
        }
        else if (columns <= 14) {
            return { text: row.substring(6, 14), startColumn: 7, endColumn: 15, type: 'memberName' };
        }
        else if (columns === 15) {
            return { text: row.substring(14, 15), startColumn: 44, endColumn: 48, type: 'fileIO' };
        }
    }
    console.log("nomatch");
    return { text: "", startColumn: columns, endColumn: columns };
}
var tip_page = {
    type: 'fixed',
    description: "各仕様書に割り当てるページ番号を記入します。",
    detail: {}
}
var tip_rowID = {
    type: 'fixed',
    description: "仕様書につける番号を記入します。",
    detail: {}
}
var tip_format = {
    type: 'simpleDetail',
    description: "H/F/E/L/I/C/O",
    name: "仕様書タイプ",
    detail: {
        H: {
            name: "制御仕様書",
            description: "日付・2バイト文字仕様の記述を指定します。"
        },
        F: {
            name: "ファイル仕様書",
            description: "ファイルに関しての記述を行います。"
        },
        E: {
            name: "補足仕様書",
            description: "配列に関する記述を行います。"
        },
        L: {
            name: "制御仕様書",
            description: "印刷出力ファイルに関する記述を行います。"
        },
        I: {
            name: "入力仕様書",
            description: "データ構造に関する記述を行います。"
        },
        C: {
            name: "演算仕様書",
            description: "演算に関する記述を行います。"
        },
        O: {
            name: "出力仕様書",
            description: "出力の様式に関する記述を行います。"
        }
    }
}
var tip_controlLevel = {
    type: 'Detail_2',
    description: "",
    name: "制御レベル",
    detail: {
        L0: {
            description: "各プログラム・サイクルの合計演算時に演算命令が実行されます。"
        },
        L1: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L2: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L3: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L4: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L5: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L6: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L7: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L8: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        L9: {
            description: "標識がオンになっている場合に各プログラム・サイクルの合計演算時に行われます。"
        },
        LR: {
            description: "最後のレコードが処理された後、もしくは標識がオンになった後で演算命令が実行されます。"
        },
        SR: {
            description: "サブルーチンの一部であることを明示します。任意指定。"
        },
        AN: {
            description: "複数行にわたって標識を条件付けをします。"
        },
        OR: {
            description: "複数行にわたって標識を条件付けをします。"
        }
    }
}
var tip_flag_not = {
    type: 'fixed',
    description: "右の標識をnot指定します。",
    detail: {}
}
var tip_flag = {
    type: 'substr',
    len: 1,
    name: "条件付け標識",
    detail: {
        0: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        1: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        2: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        3: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        4: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        5: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        6: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        7: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        8: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        9: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        K: {
            description: "機能キー標識です。"
        },
        L: {
            description: "制御レベル標識です。L0-L9/LR(最終レコード標識)"
        },
        M: {
            description: "突き合わせレコード標識です。"
        },
        H: {
            description: "停止標識です。"
        },
        R: {
            description: "戻り標識です。"
        },
        U: {
            description: "外部標識です。"
        },
        O: {
            description: "オーバーフロー標識です。"
        },
    }
}
var tip_operation1 = {
    type: 'auto-fixed',
    description: "命令コードに対する演算命令1です。",
    detail: {}
}
var tip_operation2 = {
    type: 'auto-fixed',
    description: "命令コードに対する演算命令2です。",
    detail: {}
}
var tip_operation = {
    type: 'simpleDetail',
    description: "未設定",
    name: "命令コード",
    detail: {
        ACQ: {
            name: "ファイル命令",
            description: "獲得"
        },
        CHAIN: {
            name: "ファイル命令",
            description: "ファイルのランダム検索。見つからないとオン。",
            description2: "|*検索引数|*ファイル名|データ構造|【 *NR ER _ 】"
        },
        DELET: {
            name: "ファイル命令",
            description: "レコードの削除",
            description2: "|検索引数|*ファイル名|X|【 N RER _ 】"
        },
        EXFMT: {
            name: "ファイル命令",
            description: "様式の書き出し/および読み取り",
            description2: "|X|*レコード様式名|X|【 _ ER _ 】"
        },
        READ: {
            name: "ファイル命令",
            description: "レコードの読み取り。最終レコードでEOFがON",
            description2: "|X|*ファイル名・レコード名|データ構造|【 _ ER *EOF 】"
        },
        READC: {
            name: "ファイル命令",
            description: "次の変更レコードの読み取り。最終レコードでEOFがON",
            description2: "|X|*レコード名|X|【 _ ER *EOF 】"
        },
        READE: {
            name: "ファイル命令",
            description: "等しいレコードの読み取り。最終レコードでEOFがON",
            description2: "|検索引数|*ファイル名・レコード名|データ構造|【 _ ER *EOF 】"
        },
        READP: {
            name: "ファイル命令",
            description: "前のレコードの読み取り。最終レコードでEOFがON",
            description2: "|X|*ファイル名・レコード名|データ構造|【 _ ER *EOF 】"
        },
        REDPE: {
            name: "ファイル命令",
            description: "前の等しいレコードの読み取り。最終レコードでEOFがON",
            description2: "|検索引数|*ファイル名・レコード名|データ構造|【 _ ER *EOF 】"
        },
        SETLL: {
            name: "ファイル命令",
            description: "下限のセット・見つからないとEQがOFF",
            description2: "|*検索引数|*ファイル名|X|【 NR ER EQ 】"
        },
        SETGT: {
            name: "ファイル命令",
            description: "上限のセット・見つからないとOFF",
            description2: "|*検索引数|*ファイル名|X|【 NR ER EQ 】"
        },
        WRITE: {
            name: "ファイル命令",
            description: "新しいレコードの作成",
            description2: "|X|*ファイル名|*データ構造|【 _ER EOF 】"
        },
        UPDAT: {
            name: "ファイル命令",
            description: "既存レコードの変更",
            description2: "|X|*ファイル名|*データ構造|【 _ER EOF 】"
        },
    }
}
var tip_result = {
    type: 'auto-fixed',
    description: "命令コードに対する演算結果です。",
    detail: {}
}
var tip_fieldLen = {
    type: 'fixed',
    description: "フィールドの長さ (数字1-30 文字1-256)",
    detail: {}
}
var tip_fieldDec = {
    type: 'fixed',
    description: "小数部分の桁数 (0-9)",
    detail: {}
}
var tip_additionaOperation = {
    type: 'Detail_2',
    description: "ブランク/H/N/P",
    name: "命令の拡張",
    detail: {
        H: {
            description: "四捨五入を行います。"
        },
        N: {
            description: "レコードを読み取りますが、ロックしません。"
        },
        P: {
            description: "結果フィールドにブランクを埋め込みます。"
        }
    }
}
var tip_fileIO = {
    type: 'Detail_2',
    description: "I/O/U",
    name: "ファイルの読み込み",
    detail: {
        I: {
            description: "読み取り専用"
        },
        O: {
            description: "書き出し専用"
        },
        U: {
            description: "読み取りと書き出し"
        }
    }
}
var tip_flag1 = {
    type: 'substr',
    len: 1,
    name: "【 左 】結果の標識",
    detail: {
        0: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        1: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        2: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        3: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        4: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        5: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        6: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        7: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        8: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        9: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        K: {
            description: "機能キー標識です。"
        },
        L: {
            description: "制御レベル標識です。L0-L9/LR(最終レコード標識)"
        },
        M: {
            description: "突き合わせレコード標識です。"
        },
        H: {
            description: "停止標識です。"
        },
        R: {
            description: "戻り標識です。"
        },
        U: {
            description: "外部標識です。"
        },
        O: {
            description: "オーバーフロー標識です。"
        },
    }
}
var tip_flag2 = {
    type: 'substr',
    len: 1,
    name: "【 中 】結果の標識",
    detail: {
        0: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        1: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        2: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        3: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        4: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        5: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        6: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        7: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        8: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        9: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        K: {
            description: "機能キー標識です。"
        },
        L: {
            description: "制御レベル標識です。L0-L9/LR(最終レコード標識)"
        },
        M: {
            description: "突き合わせレコード標識です。"
        },
        H: {
            description: "停止標識です。"
        },
        R: {
            description: "戻り標識です。"
        },
        U: {
            description: "外部標識です。"
        },
        O: {
            description: "オーバーフロー標識です。"
        },
    }
}
var tip_flag3 = {
    type: 'substr',
    len: 1,
    name: "【 右 】結果の標識",
    detail: {
        0: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        1: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        2: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        3: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        4: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        5: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        6: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        7: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        8: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        9: {
            description: "一般的な標識です。だいたい36番以降を使います。"
        },
        K: {
            description: "機能キー標識です。"
        },
        L: {
            description: "制御レベル標識です。L0-L9/LR(最終レコード標識)"
        },
        M: {
            description: "突き合わせレコード標識です。"
        },
        H: {
            description: "停止標識です。"
        },
        R: {
            description: "戻り標識です。"
        },
        U: {
            description: "外部標識です。"
        },
        O: {
            description: "オーバーフロー標識です。"
        },
    }
}
var tip_comment = {
    type: 'fixed',
    description: "コメント",
    detail: {}
}
var tip_ds_start = {
    type: 'fixed',
    description: "フィールドの開始位置",
    detail: {}
}
var tip_ds_end = {
    type: 'fixed',
    description: "フィールドの終了位置",
    detail: {}
}
var tip_fieldName = {
    type: 'fixed',
    description: "定義するサブフィールド名",
    detail: {}
}
var tip_memberName = {
    type: 'auto-fixed',
    description: "ファイルオブジェクト名",
    detail: {}
}