async function vtt_main(isRead) {
    let home = "";
    if (isRead) {
        home += '<div id="vtt_videoArea">.VTTと動画を一緒に選択して読み込むと字幕オンで再生できる。</div><hr>';
        home += '<div id="vtt_textArea"></div>';
    }
    else {
        home = "<h1>VTT Caption</h1><hr>";
        home += '<input id="vtt_movie" type="file" multiple></input><hr>';
    }
    return (home);
}
$(document).on('change', '#vtt_movie', (e) => {
    let fileList = e.target.files;
    console.log(e.target.files);
    let videoURL = "";
    let vttURL = "";
    for (let i = 0, l = fileList.length; l > i; i++) {
        if(fileList[i].type === "video/mp4") {
            videoURL = window.URL.createObjectURL(fileList[i]);
        } else if(fileList[i].name.substring(fileList[i].name.length - 3,fileList[i].name.length) ==="vtt" ){
            vttURL = window.URL.createObjectURL(fileList[i]);
            console.log(e.target.files[i]);
            let vttReader = new FileReader();
            vttReader.onload = function () {
                console.log(vttToPlainText(vttReader.result));
                $("#vtt_textArea").html(vttToPlainText(vttReader.result));
            }
            vttReader.readAsText(e.target.files[i]);
        }
    }
    
    let htmlText = "";
    htmlText += ""
    htmlText += '<video src="' + videoURL + '" controls>';
    htmlText += '<track default src="'+ vttURL +'" kind="subtitles" srclang="ja" label="default"/>'
    htmlText += '</video>';
    htmlText += '<div id="vtt_textArea"></div>'
    $("#renderArea").html(htmlText);
});

const vttToPlainText = (vttCaption) => {
    if (vttCaption.length === 0) {
      return;
    }
    vttCaption = vttCaption.replace(/<\/c>/g, '');
    vttCaption = vttCaption.replace(/<.+?>/g, '');
    vttCaption = vttCaption.replace(/^\s*$/g, '');
    vttCaption = vttCaption.replace(/&nbsp;/g, ' ');
    vttCaption = vttCaption.replace(/.+ --> .+/g, '<br>');

    let lines = vttCaption.split('\n');
    lines.splice(0, 4);
    lines = lines.map(line => line.trim());
    lines = lines.filter(line => line.length > 0);
    lines = lines.filter((line, index, lines) => line !== lines[index + 1]);
  
    return lines.join(' ');
}
  