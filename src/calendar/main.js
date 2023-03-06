let defaultColor = { backgroundColor: '#3788d8', borderColor: '#3788d8', textColor: '#ffffff' };

let sampleColor = {
  1: { backgroundColor: '#A80000', borderColor: '#A80000' },
  2: { backgroundColor: '#FB6400', borderColor: '#FB6400' },
  3: { backgroundColor: '#FFC400', borderColor: '#FFC400' },
  4: { backgroundColor: '#62BA27', borderColor: '#62BA27' },
  5: { backgroundColor: '#3342C4', borderColor: '#3342C4' },
  6: { backgroundColor: '#9362C4', borderColor: '#9362C4' },
  7: { backgroundColor: '#3788d8', borderColor: '#3788d8' },
}

document.addEventListener('DOMContentLoaded', function () {
  //
  //Kanban_Start();
  //Sidebar Initialize
  $('#task_add_textColor').val(defaultColor.textColor);
  $('#task_add_borderColor').val(defaultColor.borderColor);
  $('#task_add_backgroundColor').val(defaultColor.backgroundColor);
  sampleColor_apply();
  let today = new Date();
  $('#task_add_StartDayInput').val(today.getFullYear() + '-' + extend_0(today.getMonth() + 1) + '-' + extend_0(today.getDate()));

  var calendarEl = document.getElementById('calendar');
  var day_weekName = ['日', '月', '火', '水', '木', '金', '土'];
  var containerEl = document.getElementById('external-events-list');
  var containerE2 = new FullCalendar.Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: (eventEl) =>{
      return (create_event_fromSideBar());
    }
  });
  console.log(containerE2);
  window.calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today myCustomButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,dayGridYear'
    },
    customButtons: {
      myCustomButton: {
        text: '追加',
        click: function () {
          taskeditAreaToggle();
        }
      }
    },
    //schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    multiMonthMaxColumns: 1,
    locale: 'en',
    initialDate: Date.now(),
    navLinks: true, // can click day/week names to navigate views
    editable: false,
    selectable: true,
    eventResizableFromStart: true,
    eventInteractive: true,
    droppable: true,
    nowIndicator: true,
    //firstDay: 1,    // 月曜始まり
    height: "auto", // 高さは自動
    //hiddenDays: [0,6],
    contentHeight: 'auto',
    weekNumbers: true,
    weekNumberFormat: { week: 'numeric' },
    eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
    dayHeaderFormat: { weekday: 'short' },
    slotDuration: '00:30:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'numeric'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    buttonText: {
      today: '今日',
      month: '月',
      week: '週',
      day: '日',
      year: '年',
    },
    businessHours: [ // specify an array instead
      {
        daysOfWeek: [1, 2, 3, 4], // Monday, Tuesday, Wednesday, Thursday
        startTime: '08:20', // 8am
        endTime: '19:00' // 6pm
      },
      {
        daysOfWeek: [5], // Thursday, Friday
        startTime: '08:20:00', // 10am
        endTime: '17:00:00' // 4pm
      }
    ],
    dayHeaderContent: function (arg) {
      return day_weekName[arg.date.getDay()]
    },
    /*dayCellContent: (e) => {
      //console.log(e)
      //e.dayNumberText = e.dayNumberText.replace('日', '');
    },*/
    dateClick: (e) => {
      //console.log(e);
    },
    select: (e) => select_event(e),
    unselect: (e) => {
      //console.log(e);
    },
    eventClick: (e) => {
      event_selectEvent(e.event);
    },
    eventDrop: (e) => {
      event_selectEvent(e.event);
    },
    eventResize: (e) => {
      event_selectEvent(e.event);
    },
    eventReceive: (e) => {
      event_selectEvent(e.event);
    },
    eventsSet: (e) => eventdata_updateEvent(e),

  });
  window.calendar.render();
});

const event_selectEvent = (event) => {
  $('#textEdit_Title').text(event.title);
  $('#textEdit_ID').text(event.id);
  get_eventEditSideBar(event);
  task_add_sampleChange();
}
const eventdata_updateEvent = (events) => {
  let data = { id: EventID, event: events }
  if (CalenderStatus.first_read) {
    file_save_json(CalenderStatus.name, data, linkStatus[defaultFileSystemHandleName].handle);
    CalenderStatus.eventChange = true;
  }
}
let EventID = 0;
let taskEdit_close = true;

const taskeditAreaToggle = async () => {
  if (!CalenderStatus.first_read) {
    let message = await Directory_Handle_Register();
    if (message !== 'OK') {
      return null;
    }
  }
  if (taskEdit_close) {
    //hide -> visible
    $('#task_edit_sidebar').addClass('taskEdit_Visible');
    $('#calendar').addClass('mainArea_to_task_edit_sidebar_Visible');
    document.getElementById('mainArea').addEventListener('transitionend', () => {
      window.calendar.updateSize();
    });
    $(".taskEdit_close_inside").addClass("taskEdit_close_inside_openState");
    taskEdit_close = false;
  } else {
    $('#task_edit_sidebar').removeClass('taskEdit_Visible');
    $('#calendar').removeClass('mainArea_to_task_edit_sidebar_Visible');
    $(".taskEdit_close_inside").removeClass("taskEdit_close_inside_openState");
    taskEdit_close = true;
    document.getElementById('mainArea').addEventListener('transitionend', () => {
      window.calendar.updateSize();
    });
  }
}

const select_event = (e) => {
  let allDay = e.allDay;
  if (allDay) {
    let startday = e.startStr;
    let endday = e.endStr;
    $('#task_add_StartDayInput').val(startday);
    $('#task_add_EndDayInput').val(endday);
    $('#task_add_StartTimeInput').attr('readonly', true);
    $('#task_add_EndTimeInput').attr('readonly', true);
    $('#task_add_Endtime').prop('checked', true);
  } else {
    $('#task_add_Endtime').prop('checked', false);
    $('#task_add_StartTimeInput').attr('readonly', false);
    $('#task_add_EndTimeInput').attr('readonly', false);
    let startday = e.start.getFullYear() + '-' + extend_0(e.start.getMonth() + 1) + '-' + extend_0(e.start.getDate());
    let endday = e.end.getFullYear() + '-' + extend_0(e.end.getMonth() + 1) + '-' + extend_0(e.end.getDate());
    let startTime = extend_0(e.start.getHours()) + ':' + extend_0(e.start.getMinutes()) + ':' + '00';
    let endTime = extend_0(e.end.getHours()) + ':' + extend_0(e.end.getMinutes()) + ':' + '00';
    $('#task_add_StartDayInput').val(startday);
    $('#task_add_EndDayInput').val(endday);
    $('#task_add_StartTimeInput').val(startTime);
    $('#task_add_EndTimeInput').val(endTime);
    //console.log(startday, startTime, endday, endTime);
  }
}
const extend_0 = (text) => {
  if (String(text).length === 1) {
    text = '0' + text;
  }
  return (text);
}
$(document).on('change', '#task_add_Endtime', (e) => {
  if ($('#task_add_Endtime').prop("checked")) {
    $('#task_add_StartTimeInput').attr('readonly', true);
    $('#task_add_EndTimeInput').attr('readonly', true);
  } else {
    $('#task_add_StartTimeInput').attr('readonly', false);
    $('#task_add_EndTimeInput').attr('readonly', false);
  }
});
$(document).on('click', '#taskEdit_close', (e) => {
  taskeditAreaToggle();
});

$(document).on('change', 'input[id^="task_add_dispFotmat"]', () => {
  task_dispFormatChange();
});

const task_dispFormatChange = () => {
  let e = $('input:radio[name="task_add_dispFotmat"]:checked')[0].labels[0];
  $(".task_addOptionArea_Style").removeClass("task_addOptionArea_Style_select");
  e.classList.add("task_addOptionArea_Style_select");
}

$(document).on('click', '#task_add_addButton', async (e) => {
  let createEvent = create_event_fromSideBar();
  window.calendar.addEvent(createEvent);
  $('#textEdit_ID').text(createEvent.id);
  $('#textEdit_Title').text(createEvent.title);
});

$(document).on('click', '#task_add_editButton', async (e) => {
  //save button
  replace_eventEditSideBar($('#textEdit_ID').text());
});

$(document).on('click', '#task_add_deleteButton', async (e) => {
  let id = ($('#textEdit_ID').text());
  if (id === '') {
    return null;
  }
  await calendar.getEventById(id).remove();
  let now_Calendar_Events = window.calendar.getEvents();
  if (now_Calendar_Events.length === 0) {
    $('#textEdit_ID').text('');
    $('#textEdit_Title').text('');
    return;
  }
  now_Calendar_Events[now_Calendar_Events.length - 1].Id
  $('#textEdit_ID').text(now_Calendar_Events[now_Calendar_Events.length - 1].id);
  $('#textEdit_Title').text(now_Calendar_Events[now_Calendar_Events.length - 1].title);
});

const create_event_fromSideBar = () => {
  let event = {
    id: EventID++,
    title: $('#task_add_Title').val(),
    start: null,
    end: null,
    allDay: $('#task_add_Endtime').prop("checked"),
    display: $('input:radio[name="task_add_dispFotmat"]:checked').val(),
    backgroundColor: $('#task_add_backgroundColor').val(),
    borderColor: $('#task_add_borderColor').val(),
    textColor: $('#task_add_textColor').val(),
    description: $('#task_add_Description').val(),
  }
  if (event.allDay) {
    event.start = $('#task_add_StartDayInput').val();
    event.end = $('#task_add_EndDayInput').val();
  } else {
    event.start
    let startDate = $('#task_add_StartDayInput').val();

    let endDate = $('#task_add_EndDayInput').val();
    if (endDate.indexOf('-') !== -1) {
      event.end = endDate + 'T' + $('#task_add_EndTimeInput').val();
      event.start = $('#task_add_StartDayInput').val() + 'T' + $('#task_add_StartTimeInput').val();
    } else {
      event.start = $('#task_add_StartDayInput').val();
      event.allDay = true;
    }
  }
  console.log(event);
  return (event);
}

const get_eventEditSideBar = (event) => {
  $('#task_add_Title').val(event.title);
  $('#task_add_StartDayInput').val();
  let allDay = $('#task_add_Endtime').prop("checked", event.allDay);

  let startday = event.start.getFullYear() + '-' + extend_0(event.start.getMonth() + 1) + '-' + extend_0(event.start.getDate());
  $('#task_add_StartDayInput').val(startday);
  let startTime = extend_0(event.start.getHours()) + ':' + extend_0(event.start.getMinutes()) + ':' + '00';
  $('#task_add_StartTimeInput').val(startTime);
  let endday = '';
  let endTime = '';
  if (event.end !== null) {
    endday = event.end.getFullYear() + '-' + extend_0(event.end.getMonth() + 1) + '-' + extend_0(event.end.getDate());
    endTime = extend_0(event.end.getHours()) + ':' + extend_0(event.end.getMinutes()) + ':' + '00';
  } else if (allDay) {
    let end = new Date(event.start.getFullYear(), event.start.getMonth() + 1, event.start.getDate() + 1)
    endday = end.getFullYear() + '-' + extend_0(end.getMonth()) + '-' + extend_0(end.getDate());
    endTime = startTime;
  }
  $('#task_add_EndDayInput').val(endday);
  $('#task_add_EndTimeInput').val(endTime);

  $('input:radio[name="task_add_dispFotmat"]').val([event.display]);
  $('#task_add_textColor').val(event.textColor);
  $('#task_add_borderColor').val(event.borderColor);
  $('#task_add_backgroundColor').val(event.backgroundColor);
  $('#task_add_Description').val(event.extendedProps.description);
  task_dispFormatChange();
}

const replace_eventEditSideBar = (id) => {
  if (id === '') {
    console.error('Error EditTarget Unknown', id);
    return (null);
  }
  calendar.getEventById(id).remove();
  let createEvent = create_event_fromSideBar();
  window.calendar.addEvent(createEvent);
  $('#textEdit_ID').text(createEvent.id);
  $('#textEdit_Title').text(createEvent.title);
}

let taslEdit_option_close_style = true;
$(document).on('click', '#task_add_OptionControl_Style', async () => {
  if (taslEdit_option_close_style) {
    //hidden -> visible
    $('#task_add_Option_Style').addClass('task_add_Option_Visible');
    taslEdit_option_close_style = false;
  } else {
    $('#task_add_Option_Style').removeClass('task_add_Option_Visible');
    taslEdit_option_close_style = true;
  }
});

let taslEdit_option_close_color = true;
$(document).on('click', '#task_add_OptionControl_Color', async () => {
  if (taslEdit_option_close_color) {
    //hidden -> visible
    $('#task_add_Option_Color').addClass('task_add_Option_Visible');
    $('#task_add_colorsync').removeClass('displayhide');
    taslEdit_option_close_color = false;
  } else {
    $('#task_add_Option_Color').removeClass('task_add_Option_Visible');
    $('#task_add_colorsync').addClass('displayhide');
    taslEdit_option_close_color = true;
  }
});

var taskEdit_option_colorsync = true;
$(document).on('click', '#task_add_colorsync', async () => {
  if (taskEdit_option_colorsync) {
    $('#task_add_colorsync_icon').text('lock_open');
    $('#task_add_colorsync').addClass('red_color');
    $('#task_add_colorsync_chain').addClass('transparent_border');
    taskEdit_option_colorsync = false;
  } else {

    $('#task_add_colorsync_icon').text('lock');
    $('#task_add_colorsync').removeClass('red_color');
    $('#task_add_colorsync_chain').removeClass('transparent_border');
    taskEdit_option_colorsync = true;
  }
});

$(document).on('keydown', '#task_add_Description', () => {
  let textarea = $("#task_add_Description");
  setTimeout(function () {
    textarea.css('height', 'auto');
    textarea.css('height', textarea.get(0).scrollHeight + 'px');
    + 'px;';
  }, 0);
});

$(document).on('change', 'input[id^="task_add"]', async (e) => {
  if (taskEdit_option_colorsync) {
    if (e.target.id === 'task_add_backgroundColor') {
      $('#task_add_borderColor').val($('#task_add_backgroundColor').val());
    }
    else if (e.target.id === 'task_add_borderColor') {
      $('#task_add_backgroundColor').val($('#task_add_borderColor').val());
    }
  }

  //更新
  let id = $('#textEdit_ID').text();
  if (id !== '') {
    replace_eventEditSideBar(id);
  }
  //サンプル変更
  task_add_sampleChange();
});

const task_add_sampleChange = () => {
  //サンプル変更
  let sample_Object = $('#drag_add_object');
  let sample_Object_C = $('#drag_add_object_color');
  let title = $('#task_add_Title').val();
  if (title !== '') {
    sample_Object.text($('#task_add_Title').val());
  }
  sample_Object_C.css('backgroundColor', $('#task_add_backgroundColor').val());
  sample_Object.css('color', $('#task_add_textColor').val());
  sample_Object_C.css('border-color', $('#task_add_borderColor').val());
}

const sampleColor_apply = () => {
  let sampleArray = Object.keys(sampleColor);
  for (i = 0; i < sampleArray.length; i++) {
    let target = $('#task_add_Option_sample' + (i + 1));
    target.css('background-color', sampleColor[sampleArray[i]].backgroundColor);
    target.css('border-color', sampleColor[sampleArray[i]].borderColor);
  }
}

$(document).on('click', 'span[id^="task_add_Option_sample"]', async (e) => {
  let sampleNumber = e.currentTarget.id.substring(22, e.currentTarget.id.length);
  //$('#task_add_textColor').val(sampleColor[sampleNumber]/*text color*/);
  $('#task_add_borderColor').val(sampleColor[sampleNumber].borderColor);
  $('#task_add_backgroundColor').val(sampleColor[sampleNumber].backgroundColor);
  //更新
  let id = $('#textEdit_ID').text();
  if (id !== '') {
    replace_eventEditSideBar(id);
  }
  task_add_sampleChange();
});