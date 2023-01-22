const Kanban_Start = async () => {
    await Directory_Handle_Registr();
    let load_boards = await file_read_json('kanban.json', linkStatus.handle);
    if (load_boards.length > 0) {
        dispboards = load_boards;
        console.log('load kanban');
    }

    window.Kanban = new jKanban({
        element: "#myKanban",
        responsivePercentage: true, // trueを選択時はカラム幅は％で指定され、gutterとwidthBoardの設定は不要
        dragItems: true,            // trueを選択時はカードをドラッグ可能
        dragBoards: true,            // カラムをドラッグ可能にするかどうか
        itemHandleOptions: {
            enabled: true,
        },
        click: function (el) {
            console.log("Trigger on all items click!");
        },
        dropEl: function (el, target, source, sibling) {
            console.log(target.parentElement.getAttribute('data-id'));
            console.log(el, target, source, sibling)
        },
        buttonClick: function (el, boardId) {
            console.log(el);
            console.log(boardId);
            // create a form to enter element
            var formItem = document.createElement("form");
            formItem.setAttribute("class", "itemform");
            formItem.innerHTML =
                '<div class="form-group kanban_add"><textarea class="form-control kanban_add_textarea" rows="2" autofocus></textarea><div class="flex_aligincenter"><button type="submit" class="btn btn-primary btn-xs pull-right flex_aligincenter padding-medium"><span class="material-symbols-outlined padding-medium">add_task</span>追加</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right flex_aligincenter padding-medium"><span class="material-symbols-outlined padding-medium">cancel</span>キャンセル</button><div></div>';

                Kanban.addForm(boardId, formItem);
            formItem.addEventListener("submit", function (e) {
                e.preventDefault();
                var text = e.target[0].value;
                Kanban.addElement(boardId, {
                    title: text
                });
                formItem.parentNode.removeChild(formItem);
            });
            document.getElementById("CancelBtn").onclick = function () {
                formItem.parentNode.removeChild(formItem);
            };
        },
        itemAddOptions: {
            enabled: true,
            content: 'note_add',
            class: 'custom-button material-symbols-outlined',
            footer: false
        },
        boards: dispboards,

    });
    /*
    var toDoButton = document.getElementById("addToDo");
    toDoButton.addEventListener("click", function () {
        KanbanTest.addElement("_todo", {
            title: "Test Add"
        });
    });
    
    var addBoardDefault = document.getElementById("addDefault");
    addBoardDefault.addEventListener("click", function () {
        KanbanTest.addBoards([
            {
                id: "_default",
                title: "Kanban Default",
                item: [
                    {
                        title: "Default Item"
                    },
                    {
                        title: "Default Item 2"
                    },
                    {
                        title: "Default Item 3"
                    }
                ]
            }
        ]);
    });
    var removeBoard = document.getElementById("removeBoard");
    removeBoard.addEventListener("click", function () {
        KanbanTest.removeBoard("_done");
    });
    
    var removeElement = document.getElementById("removeElement");
    removeElement.addEventListener("click", function () {
        KanbanTest.removeElement("_test_delete");
    });
    
    var allEle = KanbanTest.getBoardElements("_todo");
    allEle.forEach(function (item, index) {
        //console.log(item);
    });
    */
    $(document).on('click', '#kanban_savebutton', async () => {
        console.log('kanban saved');
        file_save_json('kanban.json',await get_kanbandata(),linkStatus.handle);
      });
}
const get_kanbandata  = async ()=> {{
    const obj = Kanban.element;
    let boards = []
    obj.querySelectorAll('.kanban-board').forEach(el => {
        let items = []
        el.querySelectorAll('.kanban-item').forEach(i => {
            console.log(i);
            items.push({
                title: i.childNodes[1].innerHTML,
            })
        })
        boards.push({
            id: el.getAttribute('data-id'),
            title: el.querySelector('.kanban-title-board').innerHTML,
            items,
        })
    })
    return boards;
}
}
let dispboards =
    [
        {
            id: "_todo",
            title: "To Do",
            class: "info,good",
            dragTo: ["_working"],
            item: [{
                title:'test'
            }]
        },
        {
            id: "_working",
            title: "Working",
            class: "warning",
            item: []
        },
        {
            id: "_done",
            title: "Done",
            class: "success",
            dragTo: ["_working"],
            item: []
        }
    ];


const kanban_html = async () => {
    let html = '';
    html += '<div class="flex_aligincenter" id="kanban_header">';
    html += '<span class="padding-medium fontsize_Large">Kanban</span>';
    html += '<span class="material-symbols-outlined fontsize_Large" id="kanban_savebutton">save</span>';
    html += '</div>';
    html += '<div id="myKanban"></div>';
    return html;
}
