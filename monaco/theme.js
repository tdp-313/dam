//https://github.com/brijeshb42/monaco-themes/

let $metaColor = document.querySelector('meta[name="theme-color"]');

const theme_blackSetting = () => {
  $metaColor.setAttribute('content', '#2D2D2D');
  document.documentElement.style.setProperty('--backgroundColor', '#2D2D2D');
  document.documentElement.style.setProperty('--font-color', '#EFF5F5');
  document.documentElement.style.setProperty('color-scheme', 'dark');
  var elements = document.getElementsByTagName('img');
  for(i=0;i<elements.length;i++){
    elements[i].style.filter = "invert(100%) grayscale(30%)";
  }
}

const theme_whiteSetting = () => {
  $metaColor.setAttribute('content', '#EFF5F5');
  document.documentElement.style.setProperty('--backgroundColor', '#EFF5F5');
  document.documentElement.style.setProperty('--font-color', 'black');
  document.documentElement.style.setProperty('color-scheme', 'normal');
  var elements = document.getElementsByTagName('img');
  for(i=0;i<elements.length;i++){
    elements[i].style.filter = "";
  }
}
const themeCSS_FilterStyle = () => {
  if (Setting.getThemeType === 'black') {
    return 'invert(100%) grayscale(30%)';
  }
  return '';
}