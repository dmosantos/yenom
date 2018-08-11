/* Helpers */
function l(x) { console.log(x); }

/* jQuery */
$(document).ready(function(){
    

});

/* Moment */
moment.locale('pt-br');

/* Angular */
var app = angular.module('yenom', ['ngSanitize', 'ngRoute']);

app.config(function($routeProvider) {
    $('.sidenav').sidenav();

    $routeProvider
        .when("/", {
            templateUrl : "view/extrato.html"
        })
        .when("/novo-lancamento", {
            templateUrl : "view/novo-lancamento.html"
        })
        .when("/cep", {
            templateUrl : "view/cep.html"
        })
        .when("/moeda", {
            templateUrl : "view/moeda.html"
        })
        .when("/previsao-tempo", {
            templateUrl : "view/previsao-tempo.html"
        })
        .otherwise({
            templateUrl : "view/extrato.html"
        });
});

app.run(function($rootScope) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
        $('.sidenav').sidenav('close');
    });
    $rootScope.$on("$locationChangeSuccess", function(event, next, current) { 
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
});

/* Controller: Extrato */
app.controller('extrato', function($scope) {
    $scope.todosPendentes = true;
    $scope.apenasPendentes = false;
    $scope.today = moment().startOf('day');
    $scope.activeMonth = $scope.today;
    $scope.previsto = null;
    $scope.pendente = null;
    $scope.realizado = null;
    
    $scope.data = localStorage.data || [];
    /*[
        {
            incluido_em: moment(),
            nome: 'Aluguel',
            descricao: null,
            tipo: 'Despesa',
            valor: -1000.0,
            frequencia: 'Recorrente',
            vencimento_em: moment([2018, 7, 1]).startOf('day'),
            parcelamento: null,
            recorrencia: 'Mensal',
            dia_mes: 10,
            dia_semana: null,
            realizado: false
        },{
            incluido_em: moment(),
            nome: 'Salário',
            descricao: null,
            tipo: 'Receita',
            valor: 3000.0,
            frequencia: 'Recorrente',
            vencimento_em: moment([2018, 7, 4]).startOf('day'),
            parcelamento: null,
            recorrencia: 'Mensal',
            dia_mes: 7,
            dia_semana: null,
            realizado: false
        },{
            incluido_em: moment(),
            nome: 'Celuar',
            descricao: null,
            tipo: 'Despesa',
            valor: -150.0,
            frequencia: 'Parcelamento',
            vencimento_em: moment([2018, 7, 15]).startOf('day'),
            parcelamento: {
                parcela: 1,
                de: 10
            },
            recorrencia: null,
            dia_mes: 15,
            dia_semana: null,
            realizado: true,
            teste: true
        },{
            incluido_em: moment(),
            nome: 'Luz',
            descricao: null,
            tipo: 'Despesa',
            valor: null,
            frequencia: 'Recorrente',
            vencimento_em: moment([2018, 7, 15]).startOf('day'),
            parcelamento: null,
            recorrencia: 'Mensal',
            dia_mes: 20,
            dia_semana: null,
            realizado: false
        },{
            incluido_em: moment(),
            nome: 'Pizza',
            descricao: null,
            tipo: 'Despesa',
            valor: -37.45,
            frequencia: 'Único',
            vencimento_em: moment([2018, 7, 5]).startOf('day'),
            parcelamento: null,
            recorrencia: null,
            dia_mes: null,
            dia_semana: null,
            realizado: false
        },{
            incluido_em: moment(),
            nome: 'MacDonalds',
            descricao: null,
            tipo: 'Despesa',
            valor: -19.90,
            frequencia: 'Único',
            vencimento_em: moment([2018, 8, 3]).startOf('day'),
            parcelamento: null,
            recorrencia: null,
            dia_mes: null,
            dia_semana: null,
            realizado: false
        }
    ];*/
    
    $scope.getActiveMonth = function() {
        return $scope.activeMonth.format('MMMM / YYYY');
    }
    
    $scope.nextMonth = function() {
        $scope.activeMonth.add(1, 'M');
    }

    $scope.prevMonth = function() {
        $scope.activeMonth.add(-1, 'M');
    }
    
    $scope.getExtrato = function() {
        $scope.previsto = {
            despesas: 0,
            receitas: 0,
            saldo: 0
        }
        $scope.pendente = {
            despesas: 0,
            receitas: 0,
            saldo: 0
        }
        $scope.realizado = {
            despesas: 0,
            receitas: 0,
            saldo: 0
        }

        var filteredData = $scope.data.filter(function(lancamento) {
            var exibir = false;
            var vencimento_em = angular.copy(lancamento.vencimento_em);
            var activeMonth = angular.copy($scope.activeMonth);
            
            if(vencimento_em.startOf('month').isSame(activeMonth.startOf('month')))
                exibir = true;
            else if($scope.todosPendentes && vencimento_em.startOf('month').isBefore(activeMonth.startOf('month')) && !lancamento.realizado)
                exibir = true;
            
            if(exibir) {
                if(lancamento.tipo == 'Despesa')
                    $scope.previsto.despesas += lancamento.valor;
                else
                    $scope.previsto.receitas += lancamento.valor;

                if(!lancamento.realizado) {
                    if(lancamento.tipo == 'Despesa')
                        $scope.pendente.despesas += lancamento.valor;
                    else
                        $scope.pendente.receitas += lancamento.valor;
                } else {
                    if(lancamento.tipo == 'Despesa')
                        $scope.realizado.despesas += lancamento.valor;
                    else
                        $scope.realizado.receitas += lancamento.valor;
                } 
            }
            
            if(exibir && $scope.apenasPendentes)
                exibir = !lancamento.realizado;
            
            return exibir;
        });
        
        $scope.previsto.saldo = $scope.previsto.receitas + $scope.previsto.despesas;
        $scope.pendente.saldo = $scope.pendente.receitas + $scope.pendente.despesas;
        $scope.realizado.saldo = $scope.realizado.receitas + $scope.realizado.despesas;
        
        return filteredData;
    }
});

app.controller('novo-lancamento', function($scope) {
    $scope.registro = {
        incluido_em: moment(),
        nome: null,
        descricao: null,
        tipo: 'Despesa',
        valor: null,
        frequencia: 'Único',
        vencimento_em: moment([2018, 8, 3]).startOf('day'),
        parcelamento: null,
        recorrencia: null,
        dia_mes: null,
        dia_semana: null,
        realizado: false
    }
});

/* Controller: Previsão do Tempo */
app.controller('previsao-tempo', function($scope, $sce, $http) {
    $scope.estados = [];
    $scope.cidades = [];
    
    $http.get($sce.trustAsResourceUrl("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"))
        .then(function(response) {
            $scope.estados = response.data;
        })/*.
        error(function(data, status) {
            console.log(data || "Request failed");
        })*/;
    
    $scope.$watch('estado', function() {
        $http.get($sce.trustAsResourceUrl('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + $scope.estado + '/municipios/'))
            .then(function(response) {
                $scope.cidades = response.data;
                $scope.cidade = $scope.cidades[0].id;
            })
    });
    
    $scope.$watch('cidade', function() {
        $http.get($sce.trustAsResourceUrl("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22americana%2C%20sp%22)%20AND%20u%20%3D%20'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"))
            .then(function(response) {
                l(response);
            })
    });
    
    $scope.cidade = null;
    $scope.estado = 35;
    
    $scope.getEstado = function() {
        var nome = '-';
        var estados = $scope.estados.filter(function(estado) {
            return estado.id == $scope.estado;
        });
        
        if(estados.length > 0)
            nome = estados[0].nome;
        
        return nome;
    }
    
    $scope.getCidade = function() {
        var nome = '-';
        var cidades = $scope.cidades.filter(function(cidade) {
            return cidade.id == $scope.cidade;
        });
        
        if(cidades.length > 0)
            nome = cidades[0].nome;
        
        return nome;
    }
});