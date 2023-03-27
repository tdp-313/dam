const rpg_token = () => {
    return (
        {
            operators: [
                'IFEQ ', 'IFNE ', 'IFLT ', 'IFGT ', 'IFLE ', 'IFGE ', 'ENDIF',
                'CABEQ', 'CABNE', 'CABLT', 'CABGT', 'CABLE', 'CABGE', 'END',
                'DOUEQ ', 'DOUNE ', 'DOULT ', 'DOUGT ', 'DOULE ', 'DOUGE ', 'DO   ', 'ENDDO',
                'DOWEQ ', 'DOWNE ', 'DOWLT ', 'DOWGT ', 'DOWLE ', 'DOWGE ',
                'BEGSR', 'ENDSR',
            ],
            keywords: [
                'break', 'case', 'catch', 'class', 'continue', 'const',
                'constructor', 'debugger', 'default', 'delete', 'do', 'else',
                'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
                'get', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
                'return', 'set', 'super', 'switch', 'symbol', 'this', 'throw', 'true',
                'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
                'async', 'await', 'of'
            ],
            IOs: [
                'WRITE', 'UPDAT', 'DELET'
            ],
            PreIOs: [
                'SETLL', 'SETGT', 'READE', 'READ ', 'CHAIN', 'REDPE', 'READP'
            ],
            tokenizer: {
                root: [
                    [/.{8}\*.*/, { token: 'comment' }],
                    //     |       |       |  |   |            
                    [/^(..)(.{1,3})(.{1,2})(C)(..)(.{1,2})(.)(.{1,2})(.)(.{1,2})(.{1,10})(.{1,5})(.{1,10})(.{1,6})(.)(.{1,2})(.)(.{1,2})(.{1,2})(.{1,2})(.*)$/,
                        ['', 'comment', '', 'tag',
                            'token-3', 'flag1', 'type', 'flag2', 'type', 'flag3',
                            {
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*]IN[0-9][0-9].*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            }, {
                                cases: {//control
                                    '@keywords': 'token-3',
                                    '@operators': 'token-3',
                                    '@IOs': 'IO',
                                    '@PreIOs': 'PreIOs',
                                    '@default': 'order'
                                }, next: '@tag',
                            }, {// 2
                                cases: {
                                    '[0-9].*.*': 'number',
                                    '[\*](LOVAL|HIVAL).*': 'number',
                                    '[\*](OFF|ON).*': 'type',
                                    '[\*].*': 'string',
                                    "'.*'.*": 'string',
                                    '@default': 'identifier'
                                }
                            }, 'variable', '', 'number', 'type', 'flag1', 'flag2', 'flag3', ''
                        ]
                    ],
                ],
                tag: [
                    [/EQ/, { token: 'keyword', next: '@pop' }],
                    [/ENDIF/, { token: 'keyword' }],
                    [/[a-z]+/, { token: 'identifier' }],
                ]
            }

        }
    );
}