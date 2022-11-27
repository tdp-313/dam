const calendar_history_start = async () => {
  let data = await calendar_event_changeTo_Gridjs(window.calendar.getEvents());
  new gridjs.Grid({
    resizable: true,
    sort: true,
    //columns: ["Name", "Email", "Phone Number"],
    data: data,
    /*[
      ["John", "john@example.com", "(353) 01 222 3333"],
      ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
      ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
      ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
      ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
    ]*/
  }).render(document.getElementById("calendar_history"));
  console.log('history')
}
const calendar_event_changeTo_Gridjs = async (events) => {
  let data = [];
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    data.push({
      title: event.title,
      allDay: event.allDay,
      start: event.start,
      end: event.end,
      id: event.id,
      groupId: event.groupId,
      display: event.display,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      url: event.url,
      overlap: event.overlap,
    });
  }
return data;
}