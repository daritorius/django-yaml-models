Test = window.Test || {};
Test.data = Test.data || {};

Test.data.index = {
    index_type: 'users',
    url_load: '',
    url_create: '',
    url_update: '',
    userTable: '',
    userAddBlock: '',
    roomTable: '',
    roomAddBlock: '',

    init: function () {
        this.userTable = $('.info-users-table');
        this.userAddBlock = $('.add-user-block');
        this.roomTable = $('.info-rooms-table');
        this.roomAddBlock = $('.add-room-block');

        this.initLoadPage();
        this.initAjaxSetup();
        this.initClickLeftMenu();
        this.initClickCreate();
        this.initDatePickers();
    },

    initLoadPage: function() {
        $('.left-menu li:first a').addClass('active');
        this.initLoadInformation(this.index_type);
    },

    initAjaxSetup: function () {
        $.ajaxSetup({
            beforeSend: function() {
                $('.some-error').hide();
            },
            statusCode: {
                500: function () {
                    $('.some-error').show();
                },
                404: function () {
                    $('.some-error').show();
                }
            }
        });
    },

    initProcessUserString: function(data, single) {
        var tr = "";
        if (single) {
                tr = "<tr data-user=" + data['pk'] + ">" +
                        "<td>" + data['pk'] + "</td>" +
                        "<td class='editable users' data-user=" + data['pk'] + " data-name='name'>" + data.fields['name'] + "</td>" +
                        "<td class='editable users' data-user=" + data['pk'] + " data-name='paycheck'>" + data.fields['paycheck'] + "</td>" +
                        "<td class='editable users' data-user=" + data['pk'] + " data-name='date_joined'>" + data.fields['date_joined'] + "</td>" +
                    "</tr>";
        } else {
            $.each(data, function(index, value) {
                tr += "<tr data-user=" + value['pk'] + ">" +
                        "<td>" + value['pk'] + "</td>" +
                        "<td class='editable users' data-user=" + value['pk'] + " data-name='name'>" + value.fields['name'] + "</td>" +
                        "<td class='editable users' data-user=" + value['pk'] + " data-name='paycheck'>" + value.fields['paycheck'] + "</td>" +
                        "<td class='editable users' data-user=" + value['pk'] + " data-name='date_joined'>" + value.fields['date_joined'] + "</td>" +
                    "</tr>";
            });
        }
        return tr;
    },

    initProcessRoomString: function(data, single) {
        var tr = "";
        if (single) {
            tr = "<tr data-room=" + data['pk'] + ">" +
                    "<td>" + data['pk'] + "</td>" +
                    "<td class='editable rooms' data-room=" + data['pk'] + " data-name='department'>" + data.fields['department'] + "</td>" +
                    "<td class='editable rooms' data-room=" + data['pk'] + " data-name='spots'>" + data.fields['spots'] + "</td>" +
                    "<td class='editable rooms' data-room=" + data['pk'] + " data-name='number'>" + data.fields['number'] + "</td>" +
                "</tr>";
        } else {
            $.each(data, function(index, value) {
                tr += "<tr data-room=" + value['pk'] + ">" +
                        "<td>" + value['pk'] + "</td>" +
                        "<td class='editable rooms' data-room=" + value['pk'] + " data-name='department'>" + value.fields.department + "</td>" +
                        "<td class='editable rooms' data-room=" + value['pk'] + " data-name='spots'>" + value.fields.spots + "</td>" +
                        "<td class='editable rooms' data-room=" + value['pk'] + " data-name='number'>" + value.fields.number + "</td>" +
                    "</tr>";
            });
        }
        return tr;
    },

    initClickLeftMenu: function() {
        var self = this;
        $('.menu-item').on('click', function(e) {
            e.preventDefault();
            $('.active').removeClass('active');
            $(this).addClass('active');
            $('.process-update-forms-block').hide();
            $('.some-error').hide();
            $('td[data-value]').each(function() {
                $(this).find('input').remove();
                $(this).html($(this).data("value")).removeAttr("data-value");
            });
            self.initLoadInformation($(this).data("type"));
        });
    },

    initLoadInformation: function(type) {
        var self = this;
        if (type == 'users') {
            self.roomTable.hide();
            self.roomAddBlock.hide();
            self.userTable.show();
            self.userAddBlock.show();
        } else {
            self.userTable.hide();
            self.userAddBlock.hide();
            self.roomTable.show();
            self.roomAddBlock.show();
        }
        $.ajax({
            url: self.url_load,
            data: {"type": type},
            success: function(data) {
                var table, tr, dataObject;
                if (type == 'users') {
                    tr = "";
                    table = $('.info-users-table');
                    dataObject = jQuery.parseJSON(data.objects);
                    if ((dataObject.length > table.find('tr').length)||(dataObject.length == table.find('tr').length == 1)) {
                        tr = self.initProcessUserString(dataObject, false);
                        if (tr.length > -1)
                            table.append(tr);
                    }
                } else {
                    tr = "";
                    table = $('.info-rooms-table');
                    dataObject = jQuery.parseJSON(data.objects);
                    if ((dataObject.length > table.find('tr').length)||(dataObject.length == table.find('tr').length == 1)) {
                        tr = self.initProcessRoomString(dataObject, false);
                        if (tr.length > -1)
                            table.append(tr);
                    }
                }
                self.initUpdateFields();
            }
        });
    },

    initClickCreate: function() {
        var self = this,
            data;
        $('.submit-form').on('click', function(e) {
            e.preventDefault();
            $('.errors-list').remove();
            if (self.initValidateForm($(this).data("type"))) {
                if ($(this).data("type") == "users") {
                    data = $('.add-user-form').serializeArray();
                } else {
                    data = $('.add-room-form').serializeArray();
                }
                data[data.length] = {name: "type", value: $(this).data("type")};
                self.initSendForm(data, $(this).data("type"));
            }
        });
    },

    initValidateForm: function(type) {
        if (type == 'users') {
            var nameInput = $('#id_name'),
                paycheckInput = $('#id_paycheck'),
                dateJoinedInput = $('#id_date_joined');
            nameInput.removeAttr('style');
            paycheckInput.removeAttr('style');
            dateJoinedInput.removeAttr('style');
            if (nameInput.val() == '') {
                nameInput.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            if (paycheckInput.val() == '' || !jQuery.isNumeric(paycheckInput.val())) {
                paycheckInput.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            if (dateJoinedInput.val() == '') {
                dateJoinedInput.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            return true;
        } else {
            var department = $('#id_department'),
                spots = $('#id_spots'),
                number = $('#id_number');
            department.removeAttr('style');
            spots.removeAttr('style');
            number.removeAttr('style');
            if (department.val() == '') {
                department.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            if (spots.val() == '' || !jQuery.isNumeric(spots.val())) {
                spots.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            if (number.val() == '' || !jQuery.isNumeric(number.val())) {
                number.css({'border': '1px solid darkred'}).focus();
                return false;
            }
            return true;
        }
    },

    initSendForm: function(data, type) {
        var self = this;
        $.ajax({
            url: self.url_create,
            type: 'post',
            data: data,
            success: function(data) {
                if (!data.errors) {
                    var table, tr, dataObject;
                    if (type == 'users') {
                        table = $('.info-users-table');
                        dataObject = jQuery.parseJSON(data.objects.split('[')[1].split(']')[0]);
                        tr = self.initProcessUserString(dataObject, true);
                    } else {
                        table = $('.info-rooms-table');
                        dataObject = jQuery.parseJSON(data.objects.split('[')[1].split(']')[0]);
                        tr = self.initProcessRoomString(dataObject, true);
                    }
                    table.append(tr);
                } else {
                    var errorsList, userFormBlock;
                    userFormBlock = $('.add-user-block');
                    errorsList = "<ul class='errors-list'>";
                    $.each(data.errors, function (index, value) {
                         errorsList += "<li>" + value[1][1] + ": " + value[1][0] + "</li>"
                    });
                    errorsList += "</ul>";
                    userFormBlock.append(errorsList);
                }
                self.initUpdateFields();
            }
        });
    },

    initDatePickers: function () {
        var dateInput = $("#id_date_joined, .datepicker-enabled");
        dateInput.attr('readonly', true);
        var d = new Date();
        var year = d.getFullYear();
        d.setFullYear(year);
        dateInput.datepicker({
            modal: true,
            changeMonth: true,
            changeYear: true,
            showOn: "both",
            buttonImageOnly: true,
            dateFormat: 'yy-mm-dd',
            yearRange: '2000:' + d.getFullYear(),
            showMonthAfterYear: true,
            defaultDate: d
        });
    },

    initUpdateFields: function() {
        var self = this, val, input;
        $('.editable').on('click', function(e) {
            e.preventDefault();
            val = $(this).html();
            if ($(this).hasClass('users')) {
                if (!$(this).find('input').length) {
                    $(this).attr('data-value', val);
                    input = $('.add-user-block').find("input[name='" + $(this).data('name') + "']").clone(true);
                    $(this).html(input.val(val));
                    input.removeAttr('id').removeAttr('style');
                    $('.process-update-forms-block').show();
                    if (input.attr('name') == 'date_joined') {
                        input.datepicker("destroy").removeAttr('id').addClass("datepicker-enabled");
                        self.initDatePickers();
                    }
                }
            } else {
                if (!$(this).find('input').length) {
                    $(this).attr('data-value', val);
                    input = $('.add-room-block').find("input[name='" + $(this).data('name') + "']").clone(true);
                    input.removeAttr('id').removeAttr('style');
                    $(this).html(input.val(val));
                    $('.process-update-forms-block').show();
                }
            }
        });
        self.initCancelChanges();
        self.initSaveChanges();
    },

    initCancelChanges: function() {
        $('.cancel-updates').on('click', function(e) {
            e.preventDefault();
            $('td[data-value]').each(function() {
                $(this).find('input').remove();
                $(this).html($(this).data("value")).removeAttr("data-value");
            });
        });
    },

    initSaveChanges: function() {
        var self = this, data, itemData, usersData, roomData, form;
        $('.save-updates').off("click").unbind('click').on('click', function(e) {
            e.preventDefault();
            var type = $('.active').data('type');
            if (self.initValidateUpdateForm(type)) {
                data = {"type": type};
                if (data['type'] == 'users') {
                    form = $('.info-users-table');
                    data['users'] = usersData = {};
                    form.find("tr").each(function() {
                        if ($(this).html().indexOf('input') > 0) {
                            itemData = {};
                            $(this).find('input').each(function() {
                                itemData[$(this).attr('name')] = $(this).val();
                            });
                            usersData[$(this).data('user')] = {"data": itemData};
                        }
                    });
                    data['users'] = JSON.stringify(usersData);
                } else {
                    form = $('.info-rooms-table');
                    data['rooms'] = roomData = {};
                    form.find("tr").each(function() {
                        if ($(this).html().indexOf('input') > 0) {
                            itemData = {};
                            $(this).find('input').each(function() {
                                itemData[$(this).attr('name')] = $(this).val();
                            });
                            roomData[$(this).data('room')] = {"data": itemData};
                        }
                    });
                    data['rooms'] = JSON.stringify(roomData);
                }
                data['csrfmiddlewaretoken'] = $('input[name="csrfmiddlewaretoken"]').val();
                self.initSendUpdateData(data);
            }
        });
    },

    initSendUpdateData: function(itemData) {
        var self = this, type = $('.active').data('type');
        $.ajax({
            url: self.url_update,
            type: 'post',
            data: itemData,
            success: function(data) {
                $('.process-update-forms-block').hide();
                if (!data.errors) {
                    var tr, dataObject;
                    if (type == 'users') {
                        dataObject = jQuery.parseJSON(data.objects);
                        $.each(dataObject, function(index, value) {
                            tr = $('tr[data-user="' + value.pk + '"]').html(self.initUpdateUserBlock(value));
                        });
                    } else {
                        dataObject = jQuery.parseJSON(data.objects);
                        $.each(dataObject, function(index, value) {
                            tr = $('tr[data-room="' + value.pk + '"]').html(self.initUpdateRoomBlock(value));
                        });
                    }
                } else {
                    var errorsList, userFormBlock;
                    userFormBlock = $('.add-user-block');
                    errorsList = "<ul class='errors-list'>";
                    $.each(data.errors, function (index, value) {
                         errorsList += "<li>" + value[1][1] + ": " + value[1][0] + "</li>"
                    });
                    errorsList += "</ul>";
                    userFormBlock.append(errorsList);
                }
                self.initUpdateFields();
            }
        });
    },

    initUpdateUserBlock: function(data) {
        var td;
        td = "<td>" + data['pk'] + "</td>" +
            "<td class='editable users' data-user=" + data['pk'] + " data-name='name'>" + data.fields['name'] + "</td>" +
            "<td class='editable users' data-user=" + data['pk'] + " data-name='paycheck'>" + data.fields['paycheck'] + "</td>" +
            "<td class='editable users' data-user=" + data['pk'] + " data-name='date_joined'>" + data.fields['date_joined'] + "</td>";
        return td;
    },

    initUpdateRoomBlock: function(data) {
        var td;
        td = "<td>" + data['pk'] + "</td>" +
            "<td class='editable rooms' data-room=" + data['pk'] + " data-name='department'>" + data.fields['department'] + "</td>" +
            "<td class='editable rooms' data-room=" + data['pk'] + " data-name='spots'>" + data.fields['spots'] + "</td>" +
            "<td class='editable rooms' data-room=" + data['pk'] + " data-name='number'>" + data.fields['number'] + "</td>";
        return td;
    },

    initValidateUpdateForm: function(type) {
        var table, result = true;
        if (type == 'users') {
            table = $('.info-users-table');
            var nameInput = table.find('input[name="name"]'),
                paycheckInput = table.find('input[name="paycheck"]'),
                dateJoinedInput = table.find('input[name="date_joined"]');
            nameInput.removeAttr('style');
            paycheckInput.removeAttr('style');
            dateJoinedInput.removeAttr('style');
            nameInput.each(function() {
                if ($(this).val() == '') {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            paycheckInput.each(function() {
                if ($(this).val() == '' || !jQuery.isNumeric($(this).val())) {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            dateJoinedInput.each(function() {
                if ($(this).val() == '') {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            return result;
        } else {
            table = $('.info-rooms-table');
            var department = table.find('input[name="department"]'),
                spots = table.find('input[name="spots"]'),
                number = table.find('input[name="number"]');
            department.removeAttr('style');
            spots.removeAttr('style');
            number.removeAttr('style');
            department.each(function() {
                if ($(this).val() == '') {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            spots.each(function() {
                if ($(this).val() == '' || !jQuery.isNumeric($(this).val())) {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            number.each(function() {
                if ($(this).val() == '' || !jQuery.isNumeric($(this).val())) {
                    $(this).css({'border': '1px solid darkred'}).focus();
                    result = false;
                }
            });
            return result;
        }
    }
};

$(function () {
    Test.data.index.init();
});

