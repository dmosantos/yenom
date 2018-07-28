$(document).ready(function(){
    $('.sidenav').sidenav();
    
    $('.modal').modal();
    
    
    var datepicker_pt_br = {
        today: 'Hoje', clear: 'Limpar', done: 'Ok', cancel: 'Cancelar', nextMonth: 'Próximo mês', previousMonth: 'Mês anterior', weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], weekdays: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'], monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    }
    var options = {
        autoClose: true,
        format: 'dd/mm/yyyy',
        defaultDate: new Date(),
        setDefaultDate: true,
        i18n: datepicker_pt_br
    }
    $('.datepicker').datepicker(options);
    
    //$('select').formSelect();
    
    $('.money').mask("#.##0,00", {reverse: true});

});