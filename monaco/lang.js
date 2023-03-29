const Operetor_OpenArray = [
    'IFEQ ', 'IFNE ', 'IFLT ', 'IFGT ', 'IFLE ', 'IFGE ',
    'DOUEQ', 'DOUNE', 'DOULT', 'DOUGT', 'DOULE', 'DOUGE', 'DO   ',
    'DOWEQ', 'DOWNE', 'DOWLT', 'DOWGT', 'DOWLE', 'DOWGE',
    'SELEC',
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
                'ANDEQ', 'ANDNE', 'ANDLT', 'ANDGT', 'ANDLE', 'ANDGE', 'ELSE ',
                'OREQ ', 'ORNE ', 'ORLT ', 'ORGT ', 'ORLE ', 'ORGE ', 'GOTO ',
                'WHEQ ', 'WHNE ', 'WHLT ', 'WHGT ', 'WHLE ', 'WHGE ', 'OTHER'
            ],
            SubroutineOpen: Subroutine_OpenArray,
            SubroutineClose: Subroutine_CloseArray,
            SubroutineOther: [
                'EXSR ', 'CASGT', 'CASLT', 'CASEQ', 'CASNE', 'CASGE', 'CASLE', 'CAS  ', 'ENDCS'
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
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    'UDATE.*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*]IN[0-9][0-9].*': 'type',
                                    '[\*].*': 'predefined',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            }, {//28-32
                                cases: {//control
                                    '@OperatorOpen': { token: 'Operation', bracket: '@open' },
                                    '@OperatorClose': { token: 'Operation', bracket: '@close' },
                                    '@OperatorOther': 'Operation',
                                    '@SubroutineOpen': { token: 'Operation', bracket: '@open' },
                                    '@SubroutineClose': { token: 'Operation', bracket: '@close' },
                                    '@SubroutineOther': 'Operation',
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
                                    '@FileIOs': 'IO',
                                    '@FilePreIOs': 'PreIOs',

                                    '@default': 'invalid'
                                },
                            }, {// 33-42
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    'UDATE.*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            }, {//43-48
                                cases: {
                                    '[\*].*': 'string',
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
                'ANDEQ', 'ANDNE', 'ANDLT', 'ANDGT', 'ANDLE', 'ANDGE', 'ELSE ',
                'OREQ ', 'ORNE ', 'ORLT ', 'ORGT ', 'ORLE ', 'ORGE ', 'GOTO ',
                'WHEQ ', 'WHNE ', 'WHLT ', 'WHGT ', 'WHLE ', 'WHGE ', 'OTHER'
            ],
            SubroutineOpen: Subroutine_OpenArray,
            SubroutineClose: Subroutine_CloseArray,
            SubroutineOther: [
                'EXSR ', 'CASGT', 'CASLT', 'CASEQ', 'CASNE', 'CASGE', 'CASLE', 'CAS  ', 'ENDCS'
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
                    [/.{16}\*.*/, { token: 'comment' }],
                    //     |       |       |  |   |            
                    [/^(.{1,10})(.{1,2})(.{1,3})(C)(..)(.)(.{1,2})(.)(.{1,2})(.)(.{1,2})(.{1,10})(.{1,18})(.{1,5})(.{1,10})(.{1,6})(.{1,3})(.)(.)(.{1,2})(.{1,2})(.{1,2})(.{1,15})(.*)$/,
                        ['','comment', '', 'tag',
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
                                    'UDATE.*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*]IN[0-9][0-9].*': 'type',
                                    '[\*].*': 'predefined',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            },'', {//28-32
                                cases: {//control
                                    '@OperatorOpen': { token: 'Operation', bracket: '@open' },
                                    '@OperatorClose': { token: 'Operation', bracket: '@close' },
                                    '@OperatorOther': 'Operation',
                                    '@SubroutineOpen': { token: 'Operation', bracket: '@open' },
                                    '@SubroutineClose': { token: 'Operation', bracket: '@close' },
                                    '@SubroutineOther': 'Operation',
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
                                    '@FileIOs': 'IO',
                                    '@FilePreIOs': 'PreIOs',

                                    '@default': 'invalid'
                                },
                            }, {// 33-42
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    'UDATE.*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            }, {//43-48
                                cases: {
                                    '[\*].*': 'string',
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