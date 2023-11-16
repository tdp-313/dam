const cl_token = () => {
  return ({
    brackets: [
      ['{', '}', 'delimiter.curly'],
      ['[', ']', 'delimiter.square'],
      ['(', ')', 'delimiter.parenthesis']
    ],


    operators: [
      ':', '|', '||',
      '=', '!=', '<', '<=',
      '>', '>=', '+', '-', '/', '*'
    ],

    constants: [
      'QYEAR', 'QVFYOBJRST', 'QUTCOFFSET', 'QUSRLIBL', 'QUSEADPAUT', 'QUPSMSGQ', 'QUPSDLYTIM', 'QTSEPOOL', 'QTOTJOB', 'QTIMZON', 'QTIMSEP', 'QTIME', 'QTIMADJ', 'QTHDRSCAFN', 'QTHDRSCADJ', 'QSYSLIBL', 'QSVRAUTITV', 'QSTSMSG', 'QSTRUPPGM', 'QSTRPRTWTR', 'QSTGLOWLMT', 'QSTGLOWACN', 'QSSLPCL', 'QSSLCSLCTL', 'QSSLCSL', 'QSRVDMP', 'QSRTSEQ', 'QSRLNBR', 'QSPLFACN', 'QSPCENV', 'QSHRMEMCTL', 'QSFWERRLOG', 'QSETJOBATR', 'QSECURITY', 'QSECOND', 'QSCPFCONS', 'QSCANFSCTL', 'QSCANFS', 'QSAVACCPTH', 'QRMTSRVATR', 'QRMTSIGN', 'QRMTIPL', 'QRETSVRSEC', 'QRCLSPLSTG', 'QQRYTIMLMT', 'QQRYDEGREE', 'QPWRRSTIPL', 'QPWRDWNLMT', 'QPWDVLDPGM', 'QPWDRULES', 'QPWDRQDDIF', 'QPWDRQDDGT', 'QPWDPOSDIF', 'QPWDMINLEN', 'QPWDMAXLEN', 'QPWDLVL', 'QPWDLMTREP', 'QPWDLMTCHR', 'QPWDLMTAJC', 'QPWDEXPWRN', 'QPWDEXPITV', 'QPWDCHGBLK', 'QPRTTXT', 'QPRTKEYFMT', 'QPRTDEV', 'QPRCMLTTSK', 'QPRCFEAT', 'QPRBHLDITV', 'QPRBFTR', 'QPFRADJ', 'QPASTHRSVR', 'QMONTH', 'QMODEL', 'QMLTTHDACN', 'QMINUTE', 'QMCHPOOL', 'QMAXSPLF', 'QMAXSIGN', 'QMAXSGNACN', 'QMAXJOB', 'QMAXACTLVL', 'QLOGOUTPUT', 'QLOCALE', 'QLMTSECOFR', 'QLMTDEVSSN', 'QLIBLCKLVL', 'QLEAPADJ', 'QLANGID', 'QKBDTYPE', 'QKBDBUF', 'QJOBSPLA', 'QJOBMSGQTL', 'QJOBMSGQSZ', 'QJOBMSGQMX', 'QJOBMSGQFL', 'QIPLTYPE', 'QIPLSTS', 'QIPLDATTIM', 'QINACTMSGQ', 'QINACTITV', 'QIGCFNTSIZ', 'QIGCCDEFNT', 'QIGC', 'QHSTLOGSIZ', 'QHOUR', 'QFRCCVNRST', 'QENDJOBLMT', 'QDYNPTYSCD', 'QDYNPTYADJ', 'QDSPSGNINF', 'QDSCJOBITV', 'QDEVRCYACN', 'QDEVNAMING', 'QDECFMT', 'QDBRCVYWT', 'QDBFSTCCOL', 'QDAYOFWEEK', 'QDAY', 'QDATSEP', 'QDATFMT', 'QDATETIME', 'QDATE', 'QCURSYM', 'QCTLSBSD', 'QCRTOBJAUD', 'QCRTAUT', 'QCONSOLE', 'QCNTRYID', 'QCMNRCYLMT', 'QCMNARB', 'QCHRIDCTL', 'QCHRID', 'QCFGMSGQ', 'QCENTURY', 'QCCSID', 'QBOOKPATH', 'QBASPOOL', 'QBASACTLVL', 'QAUTOVRT', 'QAUTOSPRPT', 'QAUTORMT', 'QAUTOCFG', 'QAUDLVL2', 'QAUDLVL', 'QAUDFRCLVL', 'QAUDENDACN', 'QAUDCTL', 'QATNPGM', 'QASTLVL', 'QALWUSRDMN', 'QALWOBJRST', 'QALWJOBITP', 'QADLTOTJ', 'QADLSPLA', 'QADLACTJ', 'QACTJOB', 'QACGLVL', 'QABNORMSW'
    ],
    operation: ['DO', 'ENDDO', 'IF', 'ELSE', 'ENDIF'],
    com1: ['ADDACC', 'ADDAJE', 'ADDALRACNE', 'ADDALRD', 'ADDALRSLTE', 'ADDASPCPYD', 'ADDAUTLE', 'ADDBKP', 'ADDBNDDIRE', 'ADDCADMRE', 'ADDCADNODE', 'ADDCCSCLT', 'ADDCFGLE', 'ADDCICSCVT', 'ADDCICSDCT', 'ADDCICSFCT', 'ADDCICSGLT', 'ADDCICSJCT', 'ADDCICSPCT', 'ADDCICSPPT', 'ADDCICSSIT', 'ADDCICSTCS', 'ADDCICSTCT', 'ADDCICSTST', 'ADDCKMKSFE', 'ADDCLUMON', 'ADDCLUNODE', 'ADDCMDCRQA', 'ADDCMNE', 'ADDCOMSNMP', 'ADDCRGDEVE', 'ADDCRGNODE', 'ADDCRQA', 'ADDDEVDMNE', 'ADDDIRE', 'ADDDIRINST', 'ADDDIRSHD', 'ADDDLOAUT', 'ADDDNSSIG', 'ADDDPRREG', 'ADDDPRSUB', 'ADDDPRSUBM', 'ADDDSTCLGE', 'ADDDSTLE', 'ADDDSTQ', 'ADDDSTRTE', 'ADDDSTSYSN', 'ADDDTADFN', 'ADDDWDFN', 'ADDEMLCFGE', 'ADDENVVAR', 'ADDEWCBCDE', 'ADDEWCM', 'ADDEWCPTCE', 'ADDEWLM', 'ADDEXITPGM', 'ADDFCTE', 'ADDFNTTBLE', 'ADDHACFGD', 'ADDHDBDLFM', 'ADDHYSSTGD', 'ADDICFDEVE', 'ADDIMGCLGE', 'ADDIPSIFC', 'ADDIPSLOC', 'ADDIPSRTE', 'ADDJOBJS', 'ADDJOBQE', 'ADDJOBSCDE', 'ADDJWDFN', 'ADDKRBKTE', 'ADDKRBTKT', 'ADDLANADPI', 'ADDLFM', 'ADDLIBLE', 'ADDLICCRQA', 'ADDLICKEY', 'ADDLNK', 'ADDMEDBRM', 'ADDMEDIBRM', 'ADDMFS', 'ADDMLMBRM', 'ADDMSGD', 'ADDMSTPART', 'ADDNCK', 'ADDNETJOBE', 'ADDNETTBLE', 'ADDNODLE', 'ADDNWSSTGL', 'ADDOBJCRQA', 'ADDOPTCTG', 'ADDOPTSVR', 'ADDOSPFARA', 'ADDOSPFIFC', 'ADDOSPFLNK', 'ADDOSPFRNG', 'ADDPCLTBLE', 'ADDPEXDFN', 'ADDPEXFTR', 'ADDPFCST', 'ADDPFM', 'ADDPFTRG', 'ADDPFVLM', 'ADDPFXDLFM', 'ADDPGM', 'ADDPJE', 'ADDPRBACNE', 'ADDPRBSLTE', 'ADDPRDCRQA', 'ADDPRDLICI', 'ADDPTFCRQA', 'ADDRDBDIRE', 'ADDREXBUF', 'ADDRIPACP', 'ADDRIPFLT', 'ADDRIPIFC', 'ADDRIPIGN', 'ADDRJECMNE', 'ADDRJERDRE', 'ADDRJEWTRE', 'ADDRMTDFN', 'ADDRMTJRN', 'ADDRPTOND', 'ADDRPYLE', 'ADDRSCCRQA', 'ADDRTGE', 'ADDSCHIDXE', 'ADDSMTPLE', 'ADDSOCE', 'ADDSRVTBLE', '', 'ADDSVRAUTE', 'ADDTAPCTG', 'ADDTCPHTE', 'ADDTCPIFC', 'ADDTCPPORT', 'ADDTCPPTP', 'ADDTCPRSI', 'ADDTCPRTE', 'ADDTCPSVR', 'ADDTRC', 'ADDTRCFTR', 'ADDUSRSMTP', 'ADDUSRSNMP', 'ADDWLCGRP', 'ADDWLCPRDE', 'ADDWSE', 'ALCOBJ', 'ANSLIN', 'ANSQST', 'ANZCMDPFR', 'ANZDBF', 'ANZDBFKEY', 'ANZDFTPWD', 'ANZDPRJRN', 'ANZLIBBRM', 'ANZOBJCVN', 'ANZPFRDTA', 'ANZPGM', 'ANZPRB', 'ANZPRFACT', 'ANZQRY', 'ANZUSROBJ', 'APING', 'APYJRNCHG', 'APYJRNCHGX', 'APYPTF', 'APYRMTPTF', 'AREXEC', 'ARPING', 'ASKQST', 'BCHJOB', 'CALL', 'CALLPRC', 'CALLSUBR', 'CD', 'CFGACCWEB', 'CFGACCWEB2', 'CFGDEVASP', 'CFGDEVMLB', 'CFGDSTSRV', 'CFGGEOMIR', 'CFGIPS', 'CFGPFRCOL', 'CFGPM400', 'CFGPMAGT', 'CFGRPDS', 'CFGSYSSEC', 'CFGTCP', 'CFGTCPAPP', 'CFGTCPBP', 'CFGTCPFTP', 'CFGTCPHTTP', 'CFGTCPLPD', 'CFGTCPPTP', 'CFGTCPRTD', 'CFGTCPRXC', 'CFGTCPSMTP', 'CFGTCPSNMP', 'CFGTCPTELN', 'CHDIR', 'CHGACGCDE', 'CHGACTPRFL', 'CHGACTSCDE', 'CHGAJE', 'CHGALRACNE', 'CHGALRD', 'CHGALRSLTE', 'CHGALRTBL', 'CHGAMTDFT', 'CHGASPA', 'CHGASPACT', 'CHGASPCPYD', 'CHGASPSSN', 'CHGATR', 'CHGAUD', 'CHGAUT', 'CHGAUTJS', 'CHGAUTLE', 'CHGBCKUP', 'CHGBPA', 'CHGCAD', 'CHGCCSA', 'CHGCDEFNT', 'CHGCFGL', 'CHGCFGLE', 'CHGCICSCVT', 'CHGCICSDCT', 'CHGCICSFCT', 'CHGCICSGRP', 'CHGCICSJCT', 'CHGCICSPCT', 'CHGCICSPPT', 'CHGCICSSIT', 'CHGCICSSTS', 'CHGCICSTCS', 'CHGCICSTCT', 'CHGCICSTST', 'CHGCLNUP', 'CHGCLS', 'CHGCLU', 'CHGCLUMON', 'CHGCLUNODE', 'CHGCLURCY', 'CHGCLUVER', 'CHGCMD', 'CHGCMDCRQA', 'CHGCMDDFT', 'CHGCMNE', 'CHGCNTINF', 'CHGCOMSNMP', 'CHGCOSD', 'CHGCRG', 'CHGCRGDEVE', 'CHGCRGPRI', 'CHGCRQA', 'CHGCRQD', 'CHGCSI', 'CHGCTLAPPC', 'CHGCTLASC', 'CHGCTLBSC', 'CHGCTLFNC', 'CHGCTLHOST', 'CHGCTLLWS', 'CHGCTLNET', 'CHGCTLRTL', 'CHGCTLRWS', 'CHGCTLTAP', 'CHGCTLVWS', 'CHGCURDIR', 'CHGCURLIB', 'CHGDBG', 'CHGDDMF', 'CHGDDMTCPA', 'CHGDEVAPPC', 'CHGDEVASC', 'CHGDEVASP', 'CHGDEVBSC', 'CHGDEVCRP', 'CHGDEVDSP', 'CHGDEVFNC', 'CHGDEVHOST', 'CHGDEVINTR', 'CHGDEVMLB', 'CHGDEVNET', 'CHGDEVNWSH', 'CHGDEVOPT', 'CHGDEVPRT', 'CHGDEVRTL', 'CHGDEVSNPT', 'CHGDEVSNUF', 'CHGDEVTAP', 'CHGDHCPA', 'CHGDHCPSVR', 'CHGDIRE', 'CHGDIRSHD', 'CHGDIRSVRA', 'CHGDLJS', 'CHGDLOAUD', 'CHGDLOAUT', 'CHGDLOOWN', 'CHGDLOPGP', 'CHGDNSA', 'CHGDOCD', 'CHGDSPF', 'CHGDSTA', 'CHGDSTD', 'CHGDSTL', 'CHGDSTPWD', 'CHGDSTQ', 'CHGDSTRTE', 'CHGDTA', 'CHGDTAARA', 'CHGDTAJS', 'CHGEMLCFGE', 'CHGENVVAR', 'CHGEWCBCDE', 'CHGEWCM', 'CHGEWCPTCE', 'CHGEWLM', 'CHGEXPSCDE', 'CHGFCNARA', 'CHGFCNUSG', 'CHGFCT', 'CHGFCTE', 'CHGFNTRSC', 'CHGFNTTBLE', 'CHGFTPA', 'CHGFTR', 'CHGGPHFMT', 'CHGGPHPKG', 'CHGGRPA', 'CHGHACFGD', 'CHGHLLPTR', 'CHGHTTPA', 'CHGHYSSTGD', 'CHGHYSSTS', 'CHGICFDEVE', 'CHGICFF', 'CHGIMGCLG', 'CHGIMGCLGE', 'CHGIPLA', 'CHGIPSIFC', 'CHGIPSLOC', 'CHGIPSTOS', 'CHGJOB', 'CHGJOBD', 'CHGJOBJS', 'CHGJOBMLBA', 'CHGJOBQ', 'CHGJOBQE', 'CHGJOBSCDE', 'CHGJOBTYP', 'CHGJRN', 'CHGJRNA', 'CHGJRNOBJ', 'CHGKBDMAP', 'CHGKRBPWD', 'CHGLANADPI', 'CHGLF', 'CHGLFM', 'CHGLIB', 'CHGLIBL', 'CHGLICCRQA', 'CHGLICINF', 'CHGLINASC', 'CHGLINBSC', 'CHGLINDDI', 'CHGLINETH', 'CHGLINFAX', 'CHGLINFR', 'CHGLINPPP', 'CHGLINSDLC', 'CHGLINTDLC', 'CHGLINTRN', 'CHGLINWLS', 'CHGLINX25', 'CHGLNKLBRM', 'CHGLPDA', 'CHGMEDBRM', 'CHGMGDSYSA', 'CHGMGRSRVA', 'CHGMGTCOL', 'CHGMNU', 'CHGMOD', 'CHGMODD', 'CHGMSGD', 'CHGMSGF', 'CHGMSGQ', 'CHGNCK', 'CHGNETA', 'CHGNETJOBE', 'CHGNFSEXP', 'CHGNFYJS', 'CHGNODGRPA', 'CHGNTBD', 'CHGNTPA', 'CHGNWIFR', 'CHGNWSA', 'CHGNWSCFG', 'CHGNWSD', 'CHGNWSSTG', 'CHGNWSUSRA', 'CHGOBJAUD', 'CHGOBJCRQA', 'CHGOBJD', 'CHGOBJOWN', 'CHGOBJPGP', 'CHGOPTA', 'CHGOPTVOL', 'CHGOSPFA', 'CHGOSPFARA', 'CHGOSPFIFC', 'CHGOSPFLNK', 'CHGOSPFRNG', 'CHGOUTQ', 'CHGOWN', 'CHGPCOPRF', 'CHGPDGPRF', 'CHGPDMDFT', 'CHGPEXDFN', 'CHGPF', 'CHGPFCST', 'CHGPFM', 'CHGPFTRG', 'CHGPGM', 'CHGPGMVAR', 'CHGPGP', 'CHGPGRJS', 'CHGPJ', 'CHGPJE', 'CHGPLDOND', 'CHGPOPA', 'CHGPRB', 'CHGPRBACNE', 'CHGPRBSLTE', 'CHGPRDCRQA', 'CHGPRDOBJD', 'CHGPRF', 'CHGPRTF', 'CHGPRXCMD', 'CHGPSFCFG', 'CHGPTFCRQA', 'CHGPTR', 'CHGPWD', 'CHGPWRSCD', 'CHGPWRSCDE', 'CHGQRYA', 'CHGQSTDB', 'CHGRCYAP', 'CHGRDBDIRE', 'CHGRIPA', 'CHGRIPFLT', 'CHGRIPIFC', 'CHGRJECMNE', 'CHGRJERDRE', 'CHGRJEWTRE', 'CHGRMTDFN', 'CHGRMTJRN', 'CHGRPYLE', 'CHGRSCCRQA', 'CHGRTDA', 'CHGRTGE', 'CHGRWSPWD', 'CHGRXCA', 'CHGS36', 'CHGS36A', 'CHGS36MSGL', 'CHGS36PGMA', 'CHGS36PRCA', 'CHGS36SRCA', 'CHGSAVF', 'CHGSBSD', 'CHGSCDBRM', 'CHGSCHIDX', 'CHGSECA', 'CHGSECAUD', 'CHGSHRPOOL', 'CHGSMTPA', 'CHGSNMPA', 'CHGSPLFA', 'CHGSRCPF', 'CHGSRVA', 'CHGSRVAGT', 'CHGSRVAGTA', 'CHGSRVCFG', 'CHGSRVPGM', 'CHGSRVPVDA', 'CHGSSND', 'CHGSSNMAX', 'CHGSVCCPYD', 'CHGSVCSSN', 'CHGSVRAUTE', 'CHGSYSDIRA', 'CHGSYSJOB', 'CHGSYSLIBL', 'CHGSYSVAL', 'CHGTAPCTG', 'CHGTAPF', 'CHGTCPA', 'CHGTCPDMN', 'CHGTCPHTE', 'CHGTCPIFC', 'CHGTCPRTE', 'CHGTCPSVR', 'CHGTELNA', 'CHGTFTPA', 'CHGTIMZON', 'CHGUSRAUD', 'CHGUSRPRF', 'CHGUSRPRTI', 'CHGUSRSMTP', 'CHGUSRSNMP', 'CHGUSRTRC', 'CHGVAR', 'CHGVTMAP', 'CHGWLCGRP', 'CHGWSE', 'CHGWTR', 'CHKASPBAL', 'CHKCMNTRC', 'CHKDLO', 'CHKDNSCFG', 'CHKDNSZNE', 'CHKEXPBRM', 'CHKIGCTBL', 'CHKIN', 'CHKMSTKVV', 'CHKOBJ', 'CHKOBJITG', 'CHKOPTVOL', 'CHKOUT', 'CHKPFRCOL', 'CHKPRDOPT', 'CHKPWD', 'CHKRCDLCK', 'CHKTAP', 'CLOF', 'CLOSE', 'CLRJOBQ', 'CLRLIB', 'CLRMSGQ', 'CLRMSTKEY', 'CLROUTQ', 'CLRPFM', 'CLRPOOL', 'CLRSAVF', 'CLRSVRSEC', 'CLRTRCDTA', 'CMD', 'CMPJRNIMG', 'CMPPFM', 'CNLRJERDR', 'CNLRJEWTR', 'COMMIT', 'COPY', 'COPYRIGHT', 'CPROBJ', 'CPY', 'CPYAUDJRNE', 'CPYCFGL', 'CPYDOC', 'CPYDSTRPSO', 'CPYF', 'CPYFCNARA', 'CPYFRMARCF', 'CPYFRMDIR', 'CPYFRMIMPF', 'CPYFRMLDIF', 'CPYFRMMSD', 'CPYFRMPCD', 'CPYFRMPCFF', 'CPYFRMQRYF', 'CPYFRMSTMF', 'CPYFRMTAP', 'CPYGPHFMT', 'CPYGPHPKG', 'CPYIGCSRT', 'CPYIGCTBL', 'CPYJOBJS', 'CPYLIB', 'CPYMEDIBRM', 'CPYOPT', 'CPYPFRCOL', 'CPYPTF', 'CPYPTFCVR', 'CPYPTFGRP', 'CPYPTFSAVF', 'CPYSPLF', 'CPYSRCF', 'CPYTCPHT', 'CPYTOARCF', 'CPYTODIR', 'CPYTOIMPF', 'CPYTOLDIF', 'CPYTOMSD', 'CPYTOPCD', 'CPYTOPCFF', 'CPYTOSTMF', 'CPYTOTAP', 'CPYVPNCFGF', 'CRTAFPDTA', 'CRTALRTBL', 'CRTAUTHLR', 'CRTAUTL', 'CRTBNDC', 'CRTBNDCBL', 'CRTBNDCL', 'CRTBNDCPP', 'CRTBNDDIR', 'CRTBNDRPG', 'CRTCAD', 'CRTCBLMOD', 'CRTCBLPGM', 'CRTCFGL', 'CRTCICSC', 'CRTCICSCBL', 'CRTCICSGRP', 'CRTCICSMAP', 'CRTCKMKSF', 'CRTCLD', 'CRTCLMOD', 'CRTCLPGM', 'CRTCLS', 'CRTCLU', 'CRTCMD', 'CRTCMOD', 'CRTCOSD', 'CRTCPPMOD', 'CRTCRG', 'CRTCRQD', 'CRTCSI', 'CRTCTLAPPC', 'CRTCTLASC', 'CRTCTLBSC', 'CRTCTLFNC', 'CRTCTLHOST', 'CRTCTLLWS', 'CRTCTLNET', 'CRTCTLRTL', 'CRTCTLRWS', 'CRTCTLTAP', 'CRTCTLVWS', 'CRTDDMF', 'CRTDDNSCFG', 'CRTDEVAPPC', 'CRTDEVASC', 'CRTDEVASP', 'CRTDEVBSC', 'CRTDEVCRP', 'CRTDEVDSP', 'CRTDEVFNC', 'CRTDEVHOST', 'CRTDEVINTR', 'CRTDEVMLB', 'CRTDEVNET', 'CRTDEVNWSH', 'CRTDEVOPT', 'CRTDEVPRT', 'CRTDEVRTL', 'CRTDEVSNPT', 'CRTDEVSNUF', 'CRTDEVTAP', 'CRTDFUDSPF', 'CRTDIR', 'CRTDOC', 'CRTDPRTBL', 'CRTDSPF', 'CRTDSTL', 'CRTDTAARA', 'CRTDTADCT', 'CRTDTAQ', 'CRTDUPOBJ', 'CRTEDTD', 'CRTFCNARA', 'CRTFCT', 'CRTFLR', 'CRTFMWPRD', 'CRTFNTRSC', 'CRTFNTTBL', 'CRTFORMDF', 'CRTFTR', 'CRTGDF', 'CRTGPHFMT', 'CRTGPHPKG', 'CRTGSS', 'CRTHSTDTA', 'CRTICFF', 'CRTIGCDCT', 'CRTIMGCLG', 'CRTINSTOND', 'CRTJOBD', 'CRTJOBQ', 'CRTJRN', 'CRTJRNRCV', 'CRTLF', 'CRTLIB', 'CRTLINASC', 'CRTLINBSC', 'CRTLINDDI', 'CRTLINETH', 'CRTLINFAX', 'CRTLINFR', 'CRTLINPPP', 'CRTLINSDLC', 'CRTLINTDLC', 'CRTLINTRN', 'CRTLINWLS', 'CRTLINX25', 'CRTLOCALE', 'CRTMNU', 'CRTMODD', 'CRTMSGF', 'CRTMSGFMNU', 'CRTMSGQ', 'CRTNODGRP', 'CRTNODL', 'CRTNTBD', 'CRTNWIFR', 'CRTNWSCFG', 'CRTNWSD', 'CRTNWSSTG', 'CRTOUTQ', 'CRTOVL', 'CRTPAGDFN', 'CRTPAGSEG', 'CRTPDFMAP', 'CRTPDG', 'CRTPEXDTA', 'CRTPF', 'CRTPFRDTA', 'CRTPFRSUM', 'CRTPGM', 'CRTPNLGRP', 'CRTPRDDFN', 'CRTPRDLOD', 'CRTPRTF', 'CRTPRXCMD', 'CRTPSFCFG', 'CRTPTF', 'CRTPTFPKG', 'CRTQMFORM', 'CRTQMQRY', 'CRTQSTDB', 'CRTQSTLOD', 'CRTRJEBSCF', 'CRTRJECFG', 'CRTRJECMNF', 'CRTRNDCCFG', 'CRTRPGMOD', 'CRTRPGPGM', 'CRTRPTPGM', 'CRTS36CBL', 'CRTS36DSPF', 'CRTS36MNU', 'CRTS36MSGF', 'CRTS36RPG', 'CRTS36RPGR', 'CRTS36RPT', 'CRTSAVF', 'CRTSBSD', 'CRTSCHIDX', 'CRTSPADCT', 'CRTSQLCBL', 'CRTSQLCBLI', 'CRTSQLCI', 'CRTSQLCPPI', 'CRTSQLPKG', 'CRTSQLPLI', 'CRTSQLRPG', 'CRTSQLRPGI', 'CRTSRCPF', 'CRTSRVCFG', 'CRTSRVPGM', 'CRTSSND', 'CRTTAPCGY', 'CRTTAPF', 'CRTTBL', 'CRTTIMZON', 'CRTUDFS', 'CRTUSRPRF', 'CRTVLDL', 'CRTWSCST', 'CVTCLSRC', 'CVTDAT', 'CVTDIR', 'CVTDLSNAM', 'CVTEDU', 'CVTIPSIFC', 'CVTIPSLOC', 'CVTNAMSMTP', 'CVTOPTBKU', 'CVTOVLPFM', 'CVTPAGSPFM', 'CVTPCDPAGS', 'CVTPFMPAGS', 'CVTPFRCOL', 'CVTPFRTHD', 'CVTRJEDTA', 'CVTRPCSRC', 'CVTRPGSRC', 'CVTTCPCL', 'CVTTOFLR', 'CVTUSRCERT', 'DATA', 'DB2LDIF', 'DCL', 'DCLF', 'DCLPRCOPT', 'DCPOBJ', 'DEL', 'DEP', 'DIG', 'DLCOBJ', 'DLTALR', 'DLTALRTBL', 'DLTAPARDTA', 'DLTAUTHLR', 'DLTAUTL', 'DLTBNDDIR', 'DLTCAD', 'DLTCFGL', 'DLTCHTFMT', 'DLTCICSGRP', 'DLTCLD', 'DLTCLS', 'DLTCLU', 'DLTCMD', 'DLTCMNTRC', 'DLTCNNL', 'DLTCOSD', 'DLTCRG', 'DLTCRGCLU', 'DLTCRQD', 'DLTCSI', 'DLTCTLD', 'DLTDEVD', 'DLTDEVMLB', 'DLTDFUPGM', 'DLTDLO', 'DLTDOCL', 'DLTDST', 'DLTDSTL', 'DLTDTAARA', 'DLTDTADCT', 'DLTDTAQ', 'DLTEDTD', 'DLTEXPSPLF', 'DLTF', 'DLTFCNARA', 'DLTFCT', 'DLTFNTRSC', 'DLTFNTTBL', 'DLTFORMDF', 'DLTFTR', 'DLTGPHFMT', 'DLTGPHPKG', 'DLTGSS', 'DLTHSTDTA', 'DLTIGCDCT', 'DLTIGCSRT', 'DLTIGCTBL', 'DLTIMGCLG', 'DLTINTSVR', 'DLTIPXD', 'DLTJOBD', 'DLTJOBQ', 'DLTJRN', 'DLTJRNRCV', 'DLTKRBCCF', 'DLTLIB', 'DLTLICPGM', 'DLTLIND', 'DLTLNXSVR', 'DLTLOCALE', 'DLTMEDDFN', 'DLTMGTCOL', 'DLTMNU', 'DLTMOD', 'DLTMODD', 'DLTMSGF', 'DLTMSGQ', 'DLTNETF', 'DLTNODGRP', 'DLTNODL', 'DLTNTBD', 'DLTNWID', 'DLTNWSCFG', 'DLTNWSD', 'DLTNWSSTG', 'DLTOBJ', 'DLTOUTQ', 'DLTOVL', 'DLTOVR', 'DLTOVRDEVE', 'DLTPAGDFN', 'DLTPAGSEG', 'DLTPDFMAP', 'DLTPDG', 'DLTPEXDTA', 'DLTPFRCOL', 'DLTPGM', 'DLTPNLGRP', 'DLTPRB', 'DLTPRDDFN', 'DLTPRDLOD', 'DLTPSFCFG', 'DLTPTF', 'DLTQMFORM', 'DLTQMQRY', 'DLTQRY', 'DLTQST', 'DLTQSTDB', 'DLTRJECFG', 'DLTRMTPTF', 'DLTSBMCRQ', 'DLTSBSD', 'DLTSCHIDX', 'DLTSMGOBJ', 'DLTSPADCT', 'DLTSPLF', 'DLTSQLPKG', 'DLTSRVCFG', 'DLTSRVPGM', 'DLTSSND', 'DLTTAPCGY', 'DLTTBL', 'DLTTIMZON', 'DLTTRC', 'DLTUDFS', 'DLTUSRIDX', 'DLTUSRPRF', 'DLTUSRQ', 'DLTUSRSPC', 'DLTUSRTRC', 'DLTVLDL', 'DLTWNTSVR', 'DLTWSCST', 'DLYJOB', 'DLYSRVAGTP', 'DMP', 'DMPBRM', 'DMPCICS', 'DMPCLPGM', 'DMPCLUTRC', 'DMPCMNTRC', 'DMPDLO', 'DMPDNSJRNF', 'DMPJOB', 'DMPJOBINT', 'DMPMEMINF', 'DMPOBJ', 'DMPSYSOBJ', 'DMPTAP', 'DMPTRC', 'DMPUSRPRF', 'DMPUSRTRC', 'DO', 'DOFOR', 'DOUNTIL', 'DOWHILE', 'DSCJOB', 'DSPACC', 'DSPACCAUT', 'DSPACTPJ', 'DSPACTPRFL', 'DSPACTSCD', 'DSPAPPNINF', 'DSPASPBRM', 'DSPASPCPYD', 'DSPASPSSN', 'DSPASPSTS', 'DSPAUDJRNE', 'DSPAUT', 'DSPAUTHLR', 'DSPAUTL', 'DSPAUTLDLO', 'DSPAUTLOBJ', 'DSPAUTUSR', 'DSPBCKSTS', 'DSPBCKUP', 'DSPBCKUPL', 'DSPBKP', 'DSPBKUBRM', 'DSPBNDDIR', 'DSPCCSA', 'DSPCDEFNT', 'DSPCFGL', 'DSPCHT', 'DSPCICSCVT', 'DSPCICSDCT', 'DSPCICSFCT', 'DSPCICSGLT', 'DSPCICSJCT', 'DSPCICSPCT', 'DSPCICSPPT', 'DSPCICSSIT', 'DSPCICSSTS', 'DSPCICSTCS', 'DSPCICSTCT', 'DSPCICSTST', 'DSPCKMKSFE', 'DSPCLS', 'DSPCLUINF', 'DSPCMD', 'DSPCNNL', 'DSPCNNSTS', 'DSPCOSD', 'DSPCPCST', 'DSPCRGINF', 'DSPCSI', 'DSPCTLD', 'DSPCURDIR', 'DSPDBG', 'DSPDBGWCH', 'DSPDBR', 'DSPDDMF', 'DSPDEVD', 'DSPDIRE', 'DSPDLFA', 'DSPDLOAUD', 'DSPDLOAUT', 'DSPDLONAM', 'DSPDOC', 'DSPDSTCLGE', 'DSPDSTL', 'DSPDSTLOG', 'DSPDSTSRV', 'DSPDTA', 'DSPDTAARA', 'DSPDTADCT', 'DSPDUPBRM', 'DSPEDTD', 'DSPEWCBCDE', 'DSPEWCM', 'DSPEWCPTCE', 'DSPEWLM', 'DSPEXPSCD', 'DSPF', 'DSPFCNUSG', 'DSPFD', 'DSPFFD', 'DSPFLR', 'DSPFMWSTS', 'DSPFNTRSCA', 'DSPFNTTBL', 'DSPGDF', 'DSPHACFGD', 'DSPHDWRSC', 'DSPHFS', 'DSPHLPDOC', 'DSPHSTGPH', 'DSPHSTJS', 'DSPHYSSTGD', 'DSPHYSSTS', 'DSPIGCDCT', 'DSPIPLA', 'DSPIPXD', 'DSPJOB', 'DSPJOBD', 'DSPJOBJS', 'DSPJOBLOG', 'DSPJOBTBL', 'DSPJRN', 'DSPJRNRCVA', 'DSPJVMJOB', 'DSPKBDMAP', 'DSPKRBCCF', 'DSPKRBKTE', 'DSPLANADPP', 'DSPLANMLB', 'DSPLANSTS', 'DSPLIB', 'DSPLIBD', 'DSPLIBL', 'DSPLICKEY', 'DSPLIND', 'DSPLNK', 'DSPLOG', 'DSPLOGBRM', 'DSPLOGJS', 'DSPMFSINF', 'DSPMGDSYSA', 'DSPMNUA', 'DSPMOD', 'DSPMODD', 'DSPMODSRC', 'DSPMODSTS', 'DSPMSG', 'DSPMSGD', 'DSPNCK', 'DSPNETA', 'DSPNODGRP', 'DSPNTBD', 'DSPNWID', 'DSPNWSA', 'DSPNWSCFG', 'DSPNWSD', 'DSPNWSSTG', 'DSPNWSUSRA', 'DSPOBJAUT', 'DSPOBJD', 'DSPOPCLNK', 'DSPOPT', 'DSPOPTLCK', 'DSPOPTSVR', 'DSPOSPF', 'DSPOVR', 'DSPPDFMAPE', 'DSPPDGPRF', 'DSPPFM', 'DSPPFRDTA', 'DSPPFRGPH', 'DSPPGM', 'DSPPGMADP', 'DSPPGMREF', 'DSPPGMVAR', 'DSPPRB', 'DSPPSFCFG', 'DSPPTF', 'DSPPTFAPYI', 'DSPPTFCVR', 'DSPPWRSCD', 'DSPRCDLCK', 'DSPRCVCMD', 'DSPRCYAP', 'DSPRDBDIRE', 'DSPRIP', 'DSPRJECFG', 'DSPRMTDFN', 'DSPS36', 'DSPSAVF', 'DSPSBMCRQ', 'DSPSBMCRQA', 'DSPSBMCRQM', 'DSPSBSD', 'DSPSECA', 'DSPSECAUD', 'DSPSFWRSC', 'DSPSOCSTS', 'DSPSPLF', 'DSPSRVA', 'DSPSRVAGT', 'DSPSRVPGM', 'DSPSRVPVDA', 'DSPSRVSTS', 'DSPSSTUSR', 'DSPSVCCPYD', 'DSPSVCSSN', 'DSPSVRAUTE', 'DSPSYSSTS', 'DSPSYSVAL', 'DSPTAP', 'DSPTAPCGY', 'DSPTAPCTG', 'DSPTAPSTS', 'DSPTM', 'DSPTRC', 'DSPTRCDTA', 'DSPUDFS', 'DSPUSRPMN', 'DSPUSRPRF', 'DSPUSRPRTI', 'DSPVTMAP', 'DSPWLCGRP', 'DSPWSUSR', 'DUPMEDBRM', 'DUPOPT', 'DUPTAP', 'EDTAUTL', 'EDTBCKUPL', 'EDTCLU', 'EDTCPCST', 'EDTDLFA', 'EDTDLOAUT', 'EDTDOC', 'EDTF', 'EDTIGCDCT', 'EDTLIBL', 'EDTOBJAUT', 'EDTQST', 'EDTRBDAP', 'EDTRCYAP', 'EDTS36PGMA', 'EDTS36PRCA', 'EDTS36SRCA', 'EDTWSOAUT', 'EJTEMLOUT', 'ELEM', 'ELSE', 'EMLPRTKEY', 'ENDACCWEB', 'ENDACCWEB2', 'ENDAGTSRV', 'ENDASPBAL', 'ENDASPSSN', 'ENDBCHJOB', 'ENDCAD', 'ENDCBLDBG', 'ENDCHTSVR', 'ENDCICS', 'ENDCICSUSR', 'ENDCLNUP', 'ENDCLUNOD', 'ENDCMNSVR', 'ENDCMNTRC', 'ENDCMTCTL', 'ENDCPYSCN', 'ENDCRG', 'ENDCTLRCY', 'ENDDBG', 'ENDDBGSVR', 'ENDDBMON', 'ENDDEVRCY', 'ENDDIRSHD', 'ENDDO', 'ENDDPRAPY', 'ENDDPRCAP', 'ENDDSKRGZ', 'ENDDW', 'ENDEPMENV', 'ENDFNTDWN', 'ENDGRPJOB', 'ENDHOSTSVR', 'ENDINP', 'ENDIPSIFC', 'ENDISDB', 'ENDJOB', 'ENDJOBABN', 'ENDJOBTRC', 'ENDJRN', 'ENDJRNAP', 'ENDJRNLIB', 'ENDJRNOBJ', 'ENDJRNPF', 'ENDJS', 'ENDJW', 'ENDLINRCY', 'ENDLOGSVR', 'ENDMGDSYS', 'ENDMGRSRV', 'ENDMOD', 'ENDMONOND', 'ENDMSF', 'ENDNFSSVR', 'ENDNWIRCY', 'ENDPASTHR', 'ENDPEX', 'ENDPFRCOL', 'ENDPFRTRC', 'ENDPGM', 'ENDPGMEXP', 'ENDPGMPRF', 'ENDPJ', 'ENDPRTEML', 'ENDRCV', 'ENDRDR', 'ENDRJESSN', 'ENDRMTSPT', 'ENDRPCBIND', 'ENDRQS', 'ENDS36', 'ENDSBMCRQA', 'ENDSBS', 'ENDSELECT', 'ENDSRVAGT', 'ENDSRVJOB', 'ENDSUBR', '', 'ENDSYS', 'ENDSYSMGR', 'ENDTCP', 'ENDTCPABN', 'ENDTCPCNN', 'ENDTCPIFC', 'ENDTCPPTP', 'ENDTCPSVR', 'ENDTFMMGR', 'ENDTIESSN', 'ENDTRC', 'ENDTRPMGR', 'ENDVPNCNN', 'ENDWCH', 'ENDWTR', 'EOF', 'ERASE', 'EXPORT', 'EXPORTFS', 'EXTMEDIBRM', 'EXTPGMINF', 'FILDOC', 'FMTDTA', 'FNDKEYOND', 'FNDSTRAMT', 'FNDSTRAMT2', 'FNDSTRPDM', 'FNDSTRPDM2', 'FTP', 'GENCAT', 'GENCKMKSFE', 'GENCMDDOC', 'GENCSRC', 'GENDNSDSRR', 'GENDNSKEY', 'GENJVMDMP', 'GENLICKEY', 'GO', 'GOTO', 'GRTACCAUT', 'GRTDPRAUT', 'GRTOBJAUT', 'GRTUSRAUT', 'GRTUSRPMN', 'GRTWSOAUT', 'HLDCMNDEV', 'HLDDSTQ', 'HLDJOB', 'HLDJOBJS', 'HLDJOBQ', 'HLDJOBSCDE', 'HLDOUTQ', 'HLDPTF', 'HLDRDR', 'HLDSBMCRQA', 'HLDSPLF', 'HLDWTR', 'HOST', 'IF', 'INCLUDE', 'INSCICSGRP', 'INSINTSVR', 'INSPTF', 'INSRMTPRD', 'INSWNTSVR', 'INZBRM', 'INZCICS', 'INZDLFM', 'INZDPRCAP', 'INZDSTQ', 'INZMEDBRM', 'INZNWSCFG', 'INZOPT', 'INZPCS', 'INZPFM', 'INZSYS', 'INZTAP', 'ITERATE', 'JAVA', 'LDIF2DB', 'LEAVE', 'LNKDTADFN', 'LODIMGCLG', 'LODIMGCLGE', 'LODIPFTR', 'LODOPTFMW', 'LODPTF', 'LODQSTDB', 'LODRUN', 'LPR', 'MD', 'MGRBRM', 'MGRMEDRDAR', 'MKDIR', 'MONMSG', 'MONSWABRM', 'MOUNT', 'MOV', 'MOVDOC', 'MOVE', 'MOVMEDBRM', 'MOVOBJ', 'MOVSPLFBRM', 'MRGFORMD', 'MRGMSGCLG', 'MRGMSGF', 'MRGSPLFOND', 'MRGSRC', 'MRGTCPHT', 'NETSTAT', 'NSLOOKUP', 'NSUPDATE', 'OPNDBF', 'OPNQRYF', 'ORDSPTPTF', 'OTHERWISE', 'OVRDBF', 'OVRDSPF', 'OVRICFDEVE', 'OVRICFF', 'OVRMSGF', 'OVRPRTF', 'OVRSAVF', 'OVRTAPF', 'PARM', 'PGM', 'PING', 'PKGINSOBJ', 'PKGPRDDST', 'PKGPRDOPT', 'PMTCTL', 'POSDBF', 'PRTACTRPT', 'PRTADPOBJ', 'PRTAFPDTA', 'PRTCADMRE', 'PRTCICSTRC', 'PRTCMDUSG', 'PRTCMNSEC', 'PRTCMNTRC', 'PRTCPTRPT', 'PRTDEVADR', 'PRTDIRINF', 'PRTDOC', 'PRTDSKINF', 'PRTERRLOG', 'PRTINTDTA', 'PRTIPSCFG', 'PRTJOBDAUT', 'PRTJOBRPT', 'PRTJOBTRC', 'PRTJVMJOB', 'PRTLBLBRM', 'PRTLCKRPT', 'PRTMEDBRM', 'PRTMOVBRM', 'PRTOPCACT', 'PRTOPCJOB', 'PRTPEXRPT', 'PRTPFDDTA', 'PRTPOLRPT', 'PRTPRFINT', 'PRTPUBAUT', 'PRTPVTAUT', 'PRTQAUT', 'PRTRPTBRM', 'PRTRPTOND', 'PRTRSCRPT', 'PRTSBSDAUT', 'PRTSCDJS', 'PRTSQLINF', 'PRTSWL', 'PRTSYSINF', 'PRTSYSRPT', 'PRTSYSSECA', 'PRTTCPPTP', 'PRTTNSRPT', 'PRTTRC', 'PRTTRCRPT', 'PRTTRGPGM', 'PRTTXTOND', 'PRTUSROBJ', 'PRTUSRPRF', 'PWRDWNSYS', 'QRYDOCLIB', 'QRYDST', 'QRYPRBSTS', 'QRYTIEF', 'QSH', 'QUAL', 'RCLACTGRP', 'RCLAPPN', 'RCLDBXREF', 'RCLDDMCNV', 'RCLDLO', 'RCLLIB', 'RCLLNK', 'RCLOBJOWN', 'RCLOPT', 'RCLRSC', 'RCLSPLSTG', 'RCLSTG', 'RCLTMPSTG', 'RCVDST', 'RCVF', 'RCVJRNE', 'RCVMSG', 'RCVNETF', 'RCVTIEF', 'RD', 'READFILE', 'REN', 'RETURN', 'RGZDLO', 'RGZPFM', 'RLSCMNDEV', 'RLSDSTQ', 'RLSIFSLCK', 'RLSJOB', 'RLSJOBJS', 'RLSJOBQ', 'RLSJOBSCDE', 'RLSOUTQ', 'RLSPTF', 'RLSRDR', 'RLSRMTPHS', 'RLSSBMCRQA', 'RLSSPLF', 'RLSWTR', 'RMDIR', 'RMVACC', 'RMVACCWEB', 'RMVACCWEB2', 'RMVAJE', 'RMVALRD', 'RMVASPCPYD', 'RMVAUTLE', 'RMVBKP', 'RMVBNDDIRE', 'RMVCADMRE', 'RMVCADNODE', 'RMVCCSCLT', 'RMVCFGLE', 'RMVCICSCVT', 'RMVCICSDCT', 'RMVCICSFCT', 'RMVCICSGLT', 'RMVCICSJCT', 'RMVCICSPCT', 'RMVCICSPPT', 'RMVCICSSIT', 'RMVCICSTCS', 'RMVCICSTCT', 'RMVCICSTST', 'RMVCKMKSFE', 'RMVCLUMON', 'RMVCLUNODE', 'RMVCMNE', 'RMVCOMSNMP', 'RMVCRGDEVE', 'RMVCRGNODE', 'RMVCRQDA', 'RMVDEVDMNE', 'RMVDFRID', 'RMVDIR', 'RMVDIRE', 'RMVDIRINST', 'RMVDIRSHD', 'RMVDLOAUT', 'RMVDPRREG', 'RMVDPRSUB', 'RMVDPRSUBM', 'RMVDSTCLGE', 'RMVDSTLE', 'RMVDSTQ', 'RMVDSTRTE', 'RMVDSTSYSN', 'RMVDWDFN', 'RMVEMLCFGE', 'RMVENVVAR', 'RMVEWCBCDE', 'RMVEWCPTCE', 'RMVEXITPGM', 'RMVFCTE', 'RMVFNTTBLE', 'RMVFTRACNE', 'RMVFTRSLTE', 'RMVHACFGD', 'RMVHSTJS', 'RMVHYSSTGD', 'RMVICFDEVE', 'RMVIMGCLGE', 'RMVIPSIFC', 'RMVIPSLOC', 'RMVIPSRTE', 'RMVJOBJS', 'RMVJOBQE', 'RMVJOBSCDE', 'RMVJRNCHG', 'RMVJWDFN', 'RMVKRBKTE', 'RMVLANADPI', 'RMVLANADPT', 'RMVLIBLE', 'RMVLICKEY', 'RMVLNK', 'RMVLOGEBRM', 'RMVLOGEJS', 'RMVM', 'RMVMEDBRM', 'RMVMEDIBRM', 'RMVMFS', 'RMVMSG', 'RMVMSGD', 'RMVNCK', 'RMVNETJOBE', 'RMVNETTBLE', 'RMVNODLE', 'RMVNWSSTGL', 'RMVOPTCTG', 'RMVOPTSVR', 'RMVOSPFARA', 'RMVOSPFIFC', 'RMVOSPFLNK', 'RMVOSPFRNG', 'RMVPCLTBLE', 'RMVPEXDFN', 'RMVPEXFTR', 'RMVPFCST', 'RMVPFTRG', 'RMVPGM', 'RMVPJE', 'RMVPTF', 'RMVRDBDIRE', 'RMVREXBUF', 'RMVRIPACP', 'RMVRIPFLT', 'RMVRIPIFC', 'RMVRIPIGN', 'RMVRJECMNE', 'RMVRJERDRE', 'RMVRJEWTRE', 'RMVRMTDFN', 'RMVRMTJRN', 'RMVRMTPTF', 'RMVRPTOND', 'RMVRPYLE', 'RMVRTGE', 'RMVSCHIDXE', 'RMVSMTPLE', 'RMVSOCE', 'RMVSRVTBLE', 'RMVSVCCPYD', 'RMVSVRAUTE', 'RMVTAPCTG', 'RMVTCPHTE', 'RMVTCPIFC', 'RMVTCPPORT', 'RMVTCPPTP', 'RMVTCPRSI', 'RMVTCPRTE', 'RMVTCPSVR', 'RMVTCPTBL', 'RMVTRC', 'RMVTRCFTR', 'RMVUSRSMTP', 'RMVUSRSNMP', 'RMVWLCGRP', 'RMVWLCPRDE', 'RMVWSE', 'RNDC', 'RNM', 'RNMDIRE', 'RNMDLO', 'RNMDSTL', 'RNMJOBJS', 'RNMLANADPI', 'RNMM', 'RNMNCK', 'RNMOBJ', 'RNMTCPHTE', 'ROLLBACK', 'RPCBIND', 'RPCGEN', 'RPLDOC', 'RRTJOB', 'RSMBKP', 'RSMCTLRCY', 'RSMDEVRCY', 'RSMLINRCY', 'RSMNWIRCY', 'RSMRTVBRM', 'RST', 'RSTAPARDTA', 'RSTAUT', 'RSTAUTBRM', 'RSTBRM', 'RSTCFG', 'RSTDFROBJ', 'RSTDLO', 'RSTDLOBRM', 'RSTLIB', 'RSTLIBBRM', 'RSTLICPGM', 'RSTOBJ', 'RSTOBJBRM', 'RSTPFRCOL', 'RSTS36F', 'RSTS36LIBM', 'RSTSYSINF', 'RSTUSRPRF', 'RTNSUBR', 'RTVASPCPYD', 'RTVASPSSN', 'RTVAUTLE', 'RTVBCKUP', 'RTVBNDSRC', 'RTVCFGSRC', 'RTVCFGSTS', 'RTVCLDSRC', 'RTVCLNUP', 'RTVCLSRC', 'RTVCLU', 'RTVCRG', 'RTVCURDIR', 'RTVDIRINF', 'RTVDLOAUT', 'RTVDLONAM', 'RTVDOC', 'RTVDSKINF', 'RTVDTAARA', 'RTVGRPA', 'RTVIMGCLG', 'RTVJOBA', 'RTVJRNE', 'RTVLIBD', 'RTVMBRD', 'RTVMSG', 'RTVNETA', 'RTVOBJD', 'RTVPDGPRF', 'RTVPRD', 'RTVPTF', 'RTVPWRSCDE', 'RTVQMFORM', 'RTVQMQRY', 'RTVS36A', 'RTVSMGOBJ', 'RTVSRVAGT', 'RTVSVCCPYD', 'RTVSVCSSN', 'RTVSWLSRC', 'RTVSYSINF', 'RTVSYSVAL', 'RTVTBLSRC', 'RTVTCPINF', 'RTVUSRPRF', 'RTVUSRPRTI', 'RTVWSCST', 'RUNBCKUP', 'RUNDNSUPD', 'RUNJVA', 'RUNLPDA', 'RUNQRY', 'RUNRMTCMD', 'RUNRNDCCMD', 'RUNSMGCMD', 'RUNSMGOBJ', 'RUNSQL', 'RUNSQLSTM', 'RVKACCAUT', 'RVKDPRAUT', 'RVKOBJAUT', 'RVKPUBAUT', 'RVKUSRPMN', 'RVKWSOAUT', 'SAV', 'SAVAPARDTA', 'SAVBRM', 'SAVCFG', 'SAVCHGOBJ', 'SAVCICSGRP', 'SAVDLO', 'SAVDLOBRM', 'SAVFLRLBRM', 'SAVLIB', 'SAVLIBBRM', 'SAVLICPGM', 'SAVMEDIBRM', 'SAVOBJ', 'SAVOBJBRM', 'SAVOBJLBRM', 'SAVPFRCOL', 'SAVRST', 'SAVRSTCFG', 'SAVRSTCHG', 'SAVRSTDLO', 'SAVRSTLIB', 'SAVRSTOBJ', 'SAVS36F', 'SAVS36LIBM', 'SAVSAVFBRM', 'SAVSAVFDTA', 'SAVSECDTA', 'SAVSYS', 'SAVSYSBRM', 'SAVSYSINF', 'SBMCMDJS', 'SBMCODEJOB', 'SBMCRQ', 'SBMDBJOB', 'SBMFNCJOB', 'SBMJOB', 'SBMJOBJS', 'SBMNETJOB', 'SBMNWSCMD', 'SBMRJEJOB', 'SBMRMTCMD', 'SELECT', 'SETASPGRP', 'SETATNPGM', 'SETCSTDTA', 'SETDEPJS', 'SETDLJS', 'SETDNSRVK', 'SETKBDMAP', 'SETMEDBRM', 'SETMSTKEY', 'SETOBJACC', 'SETPGMINF', 'SETRTVBRM', 'SETSTPJS', 'SETTAPCGY', 'SETUPGENV', 'SETUSRBRM', 'SETVTMAP', 'SETVTTBL', 'SIGNOFF', 'SLTCMD', 'SNDARPRQS', 'SNDBRKMSG', 'SNDDST', 'SNDDSTJS', 'SNDDSTQ', 'SNDF', 'SNDJRNE', 'SNDLIC', 'SNDMSG', 'SNDNETF', 'SNDNETMSG', 'SNDNETSPLF', 'SNDPGMMSG', 'SNDPRD', 'SNDPTF', 'SNDPTFORD', 'SNDRCVF', 'SNDRJECMD', 'SNDRPTJS', 'SNDRPY', 'SNDSMGOBJ', 'SNDSMTPEMM', 'SNDSRVRQS', 'SNDTCPSPLF', 'SNDTIEF', 'SNDUSRMSG', 'STATFS', 'STRACCWEB', 'STRACCWEB2', 'STRAFPU', 'STRAGTSRV', 'STRAMT', 'STRAPF', 'STRARCBRM', 'STRASMOND', 'STRASPBAL', 'STRASPSSN', 'STRBALBRM', 'STRBGU', 'STRBKUBRM', 'STRCAD', 'STRCBLDBG', 'STRCGU', 'STRCHTSVR', 'STRCICS', 'STRCICSUSR', 'STRCLNUP', 'STRCLUNOD', 'STRCMNSVR', 'STRCMNTRC', 'STRCMTCTL', 'STRCODE', 'STRCODECMD', 'STRCPYSCN', 'STRCRG', 'STRDBG', 'STRDBGSVR', 'STRDBMON', 'STRDBRDR', 'STRDFU', 'STRDIGQRY', 'STRDIRSHD', 'STRDNSQRY', 'STRDPRAPY', 'STRDPRCAP', 'STRDSKRGZ', 'STRDSMOND', 'STRDW', 'STREDU', 'STREML3270', 'STREPMENV', 'STREXPBRM', 'STRFMA', 'STRFNTDWN', 'STRGRPJS', 'STRHOSTQRY', 'STRHOSTSVR', 'STRIDD', 'STRIMPOND', 'STRIMPSMTP', 'STRIPSIFC', 'STRISDB', 'STRITF', 'STRJOBTRC', 'STRJRN', 'STRJRNAP', 'STRJRNLIB', 'STRJRNOBJ', 'STRJRNPF', 'STRJS', 'STRJW', 'STRLOGSVR', 'STRMGDSYS', 'STRMGRBRM', 'STRMGRSRV', 'STRMNTBRM', 'STRMOD', 'STRMONOND', 'STRMSF', 'STRNETINS', 'STRNFSSVR', 'STROBJCVN', 'STROVLU', 'STRPASTHR', 'STRPCCMD', 'STRPCO', 'STRPDM', 'STRPEX', 'STRPFRCOL', 'STRPFRG', 'STRPFRT', 'STRPFRTRC', 'STRPFU', 'STRPGMEXP', 'STRPGMMNU', 'STRPGMPRF', 'STRPJ', 'STRPRTEML', 'STRPRTWTR', 'STRQM', 'STRQMPRC', 'STRQMQRY', 'STRQRY', 'STRQSH', 'STRQST', 'STRRCYBRM', 'STRREXPRC', 'STRRJECSL', 'STRRJERDR', 'STRRJESSN', 'STRRJEWTR', 'STRRLU', 'STRRMCRDAR', 'STRRMTSPT', 'STRRMTWTR', 'STRRSESVR', 'STRS36', 'STRS36PRC', 'STRSAVSYNC', 'STRSBS', 'STRSBSBRM', 'STRSCHIDX', 'STRSDA', 'STRSEU', 'STRSPLRCL', 'STRSPTN', 'STRSQL', 'STRSRVAGT', 'STRSRVJOB', 'STRSST', 'STRSVCSSN', 'STRSYSMGR', 'STRTCP', 'STRTCPFTP', 'STRTCPIFC', 'STRTCPPTP', 'STRTCPSVR', 'STRTCPTELN', 'STRTFMMGR', 'STRTIESSN', 'STRTRC', 'STRTRPMGR', 'STRVPNCNN', 'STRWCH', 'SUBR', 'TELNET', 'TFRBCHJOB', 'TFRCTL', 'TFRGRPJOB', 'TFRJOB', 'TFRPASTHR', 'TFRSECJOB', 'TRACEROUTE', 'TRCASPBAL', 'TRCCNN', 'TRCCPIC', 'TRCICF', 'TRCINT', 'TRCJOB', 'TRCREX', 'TRCTCPAPP', 'TRCTCPRTE', 'TRNCKMKSF', 'UNMOUNT', 'UPDDTA', 'UPDPGM', 'UPDPTFINF', 'UPDSRVPGM', 'UPDSYSINF', 'UPDTCPINF', 'VFYAPPCCNN', 'VFYCMN', 'VFYIMGCLG', 'VFYLNKLPDA', 'VFYMOVBRM', 'VFYOPCCNN', 'VFYOPT', 'VFYPRT', 'VFYSRVAGT', 'VFYSRVCFG', 'VFYTAP', 'VFYTCPCNN', 'VRYCFG', 'WAIT', 'WHEN', 'WRKACTJOB', 'WRKALR', 'WRKALRD', 'WRKALRTBL', 'WRKAPPNSTS', 'WRKARMJOB', 'WRKASPBRM', 'WRKASPCPYD', 'WRKASPJOB', 'WRKAUT', 'WRKAUTL', 'WRKBNDDIR', 'WRKBNDDIRE', 'WRKBPTBL', 'WRKCADMRE', 'WRKCALBRM', 'WRKCFGL', 'WRKCFGSTS', 'WRKCHTFMT', 'WRKCICSCVT', 'WRKCICSDCT', 'WRKCICSFCT', 'WRKCICSGLT', 'WRKCICSGRP', 'WRKCICSJCT', 'WRKCICSPCT', 'WRKCICSPPT', 'WRKCICSSIT', 'WRKCICSSTS', 'WRKCICSTCS', 'WRKCICSTCT', 'WRKCICSTST', 'WRKCLS', 'WRKCLSBRM', 'WRKCLU', 'WRKCMD', 'WRKCMTDFN', 'WRKCNNL', 'WRKCNRBRM', 'WRKCNTINF', 'WRKCOSD', 'WRKCRQD', 'WRKCSI', 'WRKCTLD', 'WRKCTLGBRM', 'WRKDBFIDD', 'WRKDDMF', 'WRKDEVBRM', 'WRKDEVD', 'WRKDEVTBL', 'WRKDIRE', 'WRKDIRLOC', 'WRKDIRSHD', 'WRKDOC', 'WRKDOCLIB', 'WRKDOCPRTQ', 'WRKDPCQ', 'WRKDSKSTS', 'WRKDSTCLGE', 'WRKDSTL', 'WRKDSTQ', 'WRKDTAARA', 'WRKDTADCT', 'WRKDTADFN', 'WRKDTAQ', 'WRKEDTD', 'WRKENVVAR', 'WRKF', 'WRKFCNARA', 'WRKFCNUSG', 'WRKFCT', 'WRKFLR', 'WRKFLRBRM', 'WRKFNTRSC', 'WRKFORMDF', 'WRKFTR', 'WRKFTRACNE', 'WRKFTRSLTE', 'WRKGSS', 'WRKHACFGD', 'WRKHDWPRD', 'WRKHDWRSC', 'WRKHLDOPTF', 'WRKHSTJS', 'WRKHYSSTS', 'WRKIMGCLG', 'WRKIMGCLGE', 'WRKIPXD', 'WRKJOB', 'WRKJOBD', 'WRKJOBJS', 'WRKJOBLOG', 'WRKJOBQ', 'WRKJOBQD', 'WRKJOBSCDE', 'WRKJRN', 'WRKJRNA', 'WRKJRNRCV', 'WRKJVMJOB', 'WRKLANADPT', 'WRKLBRM', 'WRKLIB', 'WRKLIBAMT', 'WRKLIBPDM', 'WRKLICINF', 'WRKLIND', 'WRKLNK', 'WRKLNKBRM', 'WRKLOCBRM', 'WRKMBRAMT', 'WRKMBRPDM', 'WRKMEDBRM', 'WRKMEDIBRM', 'WRKMGRIBRM', 'WRKMLBBRM', 'WRKMLBRSCQ', 'WRKMLBSTS', 'WRKMLMBRM', 'WRKMNU', 'WRKMOD', 'WRKMODD', 'WRKMSG', 'WRKMSGD', 'WRKMSGF', 'WRKMSGQ', 'WRKNAMSMTP', 'WRKNCK', 'WRKNETF', 'WRKNETJOBE', 'WRKNETTBLE', 'WRKNODL', 'WRKNODLE', 'WRKNTBD', 'WRKNWID', 'WRKNWSCFG', 'WRKNWSD', 'WRKNWSENR', 'WRKNWSSTG', 'WRKNWSSTS', 'WRKOBJ', 'WRKOBJAMT', 'WRKOBJBRM', 'WRKOBJLCK', 'WRKOBJOWN', 'WRKOBJPDM', 'WRKOBJPGP', 'WRKOBJPVT', 'WRKOPCACT', 'WRKOPTDIR', 'WRKOPTF', 'WRKOPTVOL', 'WRKOUTQ', 'WRKOUTQD', 'WRKOVL', 'WRKPAGDFN', 'WRKPAGSEG', 'WRKPCLTBLE', 'WRKPCYBRM', 'WRKPDFMAPE', 'WRKPEXDFN', 'WRKPEXFTR', 'WRKPFCST', 'WRKPFDL', 'WRKPGM', 'WRKPGMTBL', 'WRKPMRMTS', 'WRKPMRPTO', 'WRKPMSCH', 'WRKPNLGRP', 'WRKPRB', 'WRKPRDINF', 'WRKPRTSTS', 'WRKPSFCFG', 'WRKPTF', 'WRKPTFGRP', 'WRKPTFORD', 'WRKQMFORM', 'WRKQMQRY', 'WRKQRY', 'WRKQST', 'WRKRCVCRQA', 'WRKRCYBRM', 'WRKRDBDIRE', 'WRKRDR', 'WRKREGINF', 'WRKRJESSN', 'WRKRMTDFN', 'WRKRPYLE', 'WRKRTDCFG', 'WRKS36', 'WRKS36PGMA', 'WRKS36PRCA', 'WRKS36SRCA', 'WRKSAVFBRM', 'WRKSBMCRQ', 'WRKSBMCRQA', 'WRKSBMJOB', 'WRKSBS', 'WRKSBSD', 'WRKSBSJOB', 'WRKSCHIDX', 'WRKSCHIDXE', 'WRKSFWAGR', 'WRKSHRPOOL', 'WRKSMTPEMM', 'WRKSMTPUSR', 'WRKSOC', 'WRKSPADCT', 'WRKSPLF', 'WRKSPLFA', 'WRKSPLFBRM', 'WRKSPTPRD', 'WRKSRVAGT', 'WRKSRVPGM', 'WRKSRVPVD', 'WRKSRVRQS', 'WRKSRVTBLE', 'WRKSSND', 'WRKSYSACT', 'WRKSYSSTS', 'WRKSYSVAL', 'WRKTAPCTG', 'WRKTBL', 'WRKTCPPTP', 'WRKTCPSTS', 'WRKTIE', 'WRKTIMZON', 'WRKTRC', 'WRKUSRJOB', 'WRKUSRPRF', 'WRKUSRTBL', 'WRKWCH', 'WRKWTR'],

    // operators
    symbols: /.*:/,

    // escape sequences
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        { include: '@whitespace' },
        [/@symbols/, {
          cases: {
            '@operators': 'keyword',
            '@default': 'type'//symbol
          }
        }],
        [/[*][a-zA-Z][a-zA-Z0-9]*/,'type'],
        [/[*](CAT|TCAT|BCAT|AND|OR|NOT|EQ|GT|LT|GE|LE|NE|NG|NL)/, 'number'],
        [/[a-zA-Z_][a-zA-Z0-9_]*(?=\()/,'support'],
        [/[a-zA-Z_][\w_]*('*)/, {
          cases: {
            '@operation': 'constant',
            '@com1': 'keyword',
            '@constants': 'constant',
            '@default': 'identifier'
          }
        }],

        // delimiters
        [/[\{\}\(\)\[\]]/, '@brackets'],
        [/`/, { token: 'delimiter.quote', next: '@quotation', bracket: "@open" }],
        [/\./, 'delimiter'],

        // numbers
        [/[\-\+]?\d+\/[\-\+]?\d*[1-9]/, 'number'],
        [/[\-\+]?\d+(\.\d+)?/, 'number'],

        //variable
        [/[&][a-zA-Z_@#$][a-zA-Z0-9_@#$]*/, 'variable'],
        // strings
        [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
        [/'/, 'string', '@string'],
      ],

      unquote: [
        { 'include': '@root' },
        [/\$/, 'predefined.identifier', '@pop']
      ],

      quotation:
        [
          [/[^`\$]/, 'metatag'],
          [/`/, { token: 'delimiter.quote', bracket: '@close', next: '@pop' }],
          [/\$/, 'predefined.identifier', '@unquote']
        ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],    // nested comments
        [/\/\*/, 'comment.invalid'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      string: [
        [/[^']+/, 'string'],
        // [/@escapes/, 'string.escape'],
        // [/\\./,      'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],
    }
  });
}
