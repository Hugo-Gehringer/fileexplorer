$(function () {

    var $renameModal = $('#js-confirm-rename');
    var $moveModal = $('#js-confirm-move');
    var $deleteModal = $('#js-confirm-delete');
    var $displayModal = $('#js-display-image');
    var callback = function (key, opt) {
        switch (key) {
            case 'edit':
                var $renameModalButton = opt.$trigger.find(".js-rename-modal")
                renameFile($renameModalButton)
                $renameModal.modal("show");
                break;
            case 'delete':
                var $deleteModalButton = opt.$trigger.find(".js-delete-modal")
                deleteFile($deleteModalButton)
                $deleteModal.modal("show");
                break;
            case 'move':
                var $moveModalButton = opt.$trigger.find(".js-move-modal")
                moveFile($moveModalButton)
                $moveModal.modal("show");
                break;
            case 'download':
                var $downloadButton = opt.$trigger.find(".js-download")
                downloadFile($downloadButton)
                break;
            case 'preview':
                var $previewModalButton = opt.$trigger.find(".js-open-modal")
                previewFile($previewModalButton)
                $displayModal.modal("show");
                break;
        }
    };

    $.contextMenu({
        selector: '.file',
        callback: callback,
        items: {
            "delete": {name: deleteMessage, icon: "far fa-trash-alt"},
            "edit": {name: renameMessage, icon: "far fa-edit"},
            "move": {name: moveMessage, icon: "fas fa-level-up-alt"},
            "download": {name: downloadMessage, icon: "fas fa-download"},
        }
    });
    $.contextMenu({
        selector: '.img',
        callback: callback,
        items: {
            "delete": {name: deleteMessage, icon: "far fa-trash-alt"},
            "edit": {name: renameMessage, icon: "far fa-edit"},
            "move": {name: moveMessage, icon: "fas fa-level-up-alt"},
            "download": {name: downloadMessage, icon: "fas fa-download"},
            "preview": {name: previewMessage, icon: "fas fa-eye"},
        }
    });
    $.contextMenu({
        selector: '.dir',
        callback: callback,
        items: {
            "delete": {name: deleteMessage, icon: "far fa-trash-alt"},
            "edit": {name: renameMessage, icon: "far fa-edit"},
            "move": {name: moveMessage, icon: "fas fa-level-up-alt"},
        }
    });

    function renameFile($renameModalButton) {
        $('#rename_f_name').val($renameModalButton.data('name'));
        $('#rename_f_extension').val($renameModalButton.data('extension'));
        $renameModal.find('form').attr('action', $renameModalButton.data('href'))
    }
    function moveFile($moveModalButton) {
        $('#move_f_folder').val($moveModalButton.data('folder'));
        $('#move_f_name').val($moveModalButton.data('name'));
        $('#move_f_extension').val($moveModalButton.data('extension'));
        $moveModal.find('form').attr('action', $moveModalButton.data('href'))
    }

    function deleteFile($deleteModalButton) {
        $('#js-confirm-delete').find('form').attr('action', $deleteModalButton.data('href'));
    }

    function previewFile($previewModalButton) {
        var href = addParameterToURL($previewModalButton.data('href'), 'time=' + new Date().getTime());
        $('#js-display-image').find('img').attr('src', href);
    }

    function addParameterToURL(_url, param) {
        _url += (_url.split('?')[1] ? '&' : '?') + param;
        return _url;
    }

    function downloadFile($downloadButton) {
        $downloadButton[0].click();
    }

    function initTree(treedata) {
        $('#tree').jstree({
            'core': {
                'data': treedata,
                "check_callback": true,
            }
        }).bind("changed.jstree", function (e, data) {
            if (data.node) {
                document.location = data.node.a_attr.href;
            }
        })
    }

    if (tree === true) {

        // sticky kit
        $("#tree-block").stick_in_parent();

        initTree(treedata);
    }
    $(document)

        // delete modal buttons
        .on('click', '.js-delete-modal', function () {
                deleteFile($(this));
            }
        )
        // preview modal buttons
        .on('click', '.js-open-modal', function () {
                previewFile($(this));
            }
        )
        // rename modal buttons
        .on('click', '.js-rename-modal', function () {
                renameFile($(this));
            }
        )
        // move modal buttons
        .on('click', '.js-move-modal', function () {
                moveFile($(this));
            }
        )
        // multiple delete modal button
        .on('click', '#js-delete-multiple-modal', function () {
            var $multipleDelete = $('#form-multiple-delete').serialize();
            if ($multipleDelete) {
                var href = urldelete + '&' + $multipleDelete;
                $('#js-confirm-delete').find('form').attr('action', href);
            }
        })

    // preselected
    $renameModal.on('shown.bs.modal', function () {
        $('#form_name').select().mouseup(function () {
            $('#form_name').unbind("mouseup");
            return false;
        });
    });
    $('#addFolder').on('shown.bs.modal', function () {
        $('#rename_name').select().mouseup(function () {
            $('#rename_name').unbind("mouseup");
            return false;
        });
    });


    // Module Tiny
    if (moduleName === 'tiny') {

        $('#form-multiple-delete').on('click', '.select', function () {


            var windowManager = top != undefined && top.tinymceWindowManager != undefined ? top.tinymceWindowManager : '';

            // tinymce 5
            if (windowManager != '') {
                if (top.tinymceCallBackURL != undefined)
                    top.tinymceCallBackURL = $(this).attr("data-path");
                windowManager.close();
            } else {
                // tinymce 4
                var args = top.tinymce.activeEditor.windowManager.getParams();
                var input = args.input;
                var document = args.window.document;
                var divInputSplit = document.getElementById(input).parentNode.id.split("_");

                // set url
                document.getElementById(input).value = $(this).attr("data-path");

                // set width and height
                var baseId = divInputSplit[0] + '_';
                var baseInt = parseInt(divInputSplit[1], 10);

                divWidth = baseId + (baseInt + 3);
                divHeight = baseId + (baseInt + 5);

                document.getElementById(divWidth).value = $(this).attr("data-width");
                document.getElementById(divHeight).value = $(this).attr("data-height");

                top.tinymce.activeEditor.windowManager.close();
            }

        });
    }

    // Module CKEditor
    if (moduleName === 'ckeditor') {
        $('#form-multiple-delete').on('click', '.select', function () {
            var regex = new RegExp("[\\?&]CKEditorFuncNum=([^&#]*)");
            var funcNum = regex.exec(location.search)[1];
            var fileUrl = $(this).attr("data-path");
            window.opener.CKEDITOR.tools.callFunction(funcNum, fileUrl);
            window.close();
        });
    }

    // Global functions
    // display error alert
    function displayError(msg) {
        displayAlert('danger', msg)
    }

    // display success alert
    function displaySuccess(msg) {
        displayAlert('success', msg)
    }

    // file upload
    $('#fileupload').fileupload({
        dataType: 'json',
        processQueue: false,
        dropZone: $('#dropzone')
    }).on('fileuploaddone', function (e, data) {
        $.each(data.result.files, function (index, file) {
            if (file.url) {
                displaySuccess('<strong>' + file.name + '</strong> ' + successMessage)
                // Ajax update view
                $.ajax({
                    dataType: "json",
                    url: url,
                    type: 'GET'
                }).done(function (data) {
                    // update file list
                    $('#form-multiple-delete').html(data.data);

                    lazy();

                    if (tree === true) {
                        $('#tree').data('jstree', false).empty();
                        initTree(data.treeData);
                    }

                    $('#select-all').prop('checked', false);
                    $('#js-delete-multiple-modal').addClass('disabled');

                }).fail(function (jqXHR, textStatus, errorThrown) {
                    displayError('<strong>Ajax call error :</strong> ' + jqXHR.status + ' ' + errorThrown)
                });

            } else if (file.error) {
                displayError('<strong>' + file.name + '</strong> ' + file.error)
            }
        });
    }).on('fileuploadfail', function (e, data) {
        $.each(data.files, function (index, file) {
            displayError('File upload failed.')
        });
    }).on('fileuploadprogressall', function (e, data) {

        if (e.isDefaultPrevented()) {
            return false;
        }
        var progress = Math.floor((data.loaded / data.total) * 100);

        $('.progress-bar')
            .removeClass("notransition")
            .attr('aria-valuenow', progress)
            .css('width', progress + '%');

    }).on('fileuploadstop', function (e) {
        if (e.isDefaultPrevented()) {
            return false;
        }
        $('.progress-bar')
            .addClass("notransition")
            .attr('aria-valuenow', 0)
            .css('width', 0 + '%');
    });

    function lazy() {
        $('.lazy').Lazy({});
    }

    lazy();

    $('#search').on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $('#form-multiple-delete .file-wrapper').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

    });
})
;