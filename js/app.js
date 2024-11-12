 $(document).ready(function () {
    cardapio.eventos.init();
    // console.log('Ola turma')
})

var cardapio = {};
var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {

        // console.log('iniciou')
        cardapio.metodos.obterItensCardapio();

    }

}

cardapio.metodos = {

    // obter a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria]

        console.log(filtro)

        if (!vermais) {

            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');

        }

        //$("#itensCardapio").html('')

        $.each(filtro, (i, e) => {

            console.log(e.name);
            // let temp = cardapio.templates.item
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${id}/g, e.id)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {

                $("#itensCardapio").append(temp)

            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {

                $("#itensCardapio").append(temp)

            }

        })

        // remove ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active');

    },

    // clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu-][burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    // diminue a quantidades de itens do carrinho
    diminuirQuantidade:(id) => {

        let qntdAtual = parseInt($('#qntd-carrinho-'+id).text())
        if (qntdAtual > 0) {

            $('#qntd-carrinho-'+id).text(qntdAtual - 1)

        }

    },

    // aumenta a quantidades de itens do carrinho
    aumentarQuantidade:(id) => {

        let qntdAtual = parseInt($('#qntd-carrinho-' + id).text())        
        $('#qntd-carrinho-'+id).text(qntdAtual+1)

    },
}

adicionarAoCarrinho: (id) =>{
    let qntdAtual = parseInt($("#qntd-"+id).text());

    if(qntdAtual > 0){

        var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

        let filtro = MENU[categoria];

        let item = $.grep(filtro, (e, i) => {return e.id ==id});

        if(item.lenght > 0) {
            
            let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});
        }
        if (existe.lenght > 0 ) {
            let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
            MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        else{
            item[0].qntd = qntdAtual;
            MEU_CARRINHO.push(item[0]);
        }
    }
}

atualizarBadgeTotal: () =>{

    var total = 0;

    $.each(MEU_CARRINHO, (e, i) =>{
        total+= e.qntd
    })

    if(total > 0){
        $(".botao-carrinho").removeClass('hidden');
        $(".container-total-carrinho").removeClass('hidden');
    }
    else{
        $(".botao-carrinho").addClass('hidden');
        $(".container-total-carrinho").addClass('hidden');
    }

    $(".badge-total-carrinho").html(total);
},



cardapio.templates = {

    item:
        `
        <div class="col-3 mt-4">

            <div class="card card-item" id="\${id}">

                <div class="img-produto">

                    <img src="\${img}">

                </div>

                <p class="title-produto text-center mt-4">

                    <b>\${name}</b>

                </p>

                <p class="price-produto text-center">

                    <b>R$: \${price}</b>

                </p>

                <div class="add-carrinho">

                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="btn-numero-itens" id="qntd-carrinho-\${id}">0</span>
                    <span class="btn-mais"><i class="fas fa-plus" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>

                </div>

            </div>

        </div>
        `



}