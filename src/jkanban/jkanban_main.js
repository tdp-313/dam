const Kanban_Start = async () => {
    var KanbanTest = new jKanban({
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
    
            KanbanTest.addForm(boardId, formItem);
            formItem.addEventListener("submit", function (e) {
                e.preventDefault();
                var text = e.target[0].value;
                KanbanTest.addElement(boardId, {
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
        boards: [
            {
                id: "_todo",
                title: "To Do (Can drop item only in working)",
                class: "info,good",
                dragTo: ["_working"],
                item: [
                    {
                        id: "_test_delete",
                        title: "Try drag this (Look the console)",
                        drag: function (el, source) {
                            console.log("START DRAG: " + el.dataset.eid);
                        },
                        dragend: function (el) {
                            console.log("END DRAG: " + el.dataset.eid);
                        },
                        drop: function (el) {
                            console.log("DROPPED: " + el.dataset.eid);
                        }
                    },
                    {
                        title: "Try Click This!",
                        click: function (el) {
                            alert("click");
                        },
                        class: ["peppe", "bello"]
                    }
                ]
            },
            {
                id: "_working",
                title: "Working (Try drag me too)",
                class: "warning",
                item: [
                    {
                        title: "Do Something!"
                    },
                    {
                        title: "Run?"
                    }
                ]
            },
            {
                id: "_done",
                title: "Done (Can drop item only in working)",
                class: "success",
                dragTo: ["_working"],
                item: [
                    {
                        title: "All right"
                    },
                    {
                        title: "Ok!"
                    }
                ]
            }
        ]
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
}
const kanban_html = async () => {
    let html = '';
    html += ' <div class="flex_aligincenter">';
    html += '<h1 class="padding-medium">Kanban</h1>';
    html += '<span class="material-symbols-outlined fontsize_Large" id="kanban_savebutton">save</span>';
    html += '</div>';
    html += '<div id="myKanban"></div>';
    return html;
}