$(document).ready(function () {
    cardapio.eventos.init();
//     console.log('Ola turma')
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

    //obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = ['burgers'], vermais = false) => {
        var filtro = MENU[categoria]
        console.log(filtro)
        if(!vermais){   
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');
        }
        //$("#itensCardapio").html('')
        
        $.each(filtro, (i, e) => {
            console.log(e.name);
            // let temp = cardapio.templates.item;
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${id}/g, e.id)   
            .replace(/\${price}/g, e.price.toFixed(2).replace('.',','))

           //botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }
            //paginação inicial (8 itens)
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }
            // $("#itensCardapio").append(temp)
        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-"+categoria).addClass('active')

    },

    //clique no botão ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu-][burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    diminuirQuantidade: (id) =>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
        if(qntdAtual > 0){
            $("#qntd-"+id).text(qntdAtual - 1);

        }
    },

    aumentarQuantidade: (id) =>{
        let qntdAtual = parseInt($("#qntd-"+id).text());
        
        $("#qntd-"+id).text(qntdAtual + 1);
    },

    adicionarCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-"+id).text());
        

        //grep cria um outro vetor, com elementos que atendam suas condições, sem alterar o original. RETORNA OBJETOS
        //filter é o mesmo, com objetos e callback. NÃO RETORNA OBJETOS
        if(qntdAtual > 0){
            //obtem a categoria
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem todos os itens da categoria atuak
            let filtro = MENU[categoria];

            //pega o item a ser adicionado
            let item = $.grep(filtro, (e, i) => {return e.id == id});


            if(item.length > 0){

                //validar se este item já existe
                let existe = $.grep(MEU_CARRINHO, (e, i) => {return e.id == id})
    
                if(existe.length > 0){

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));

                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }
                else{
                   
                    item[0].qntd = qntdAtual;

                    MEU_CARRINHO.push(item[0]);
                }
                $("#qntd-" + id).text(0)

                cardapio.metodos.mensagem("Item adicionado ao carrinho!", 'green')

                cardapio.metodos.atualizarBadgeTotal();
                
            }
        }

        
        


    },

    atualizarBadgeTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) =>{
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');

            $(".container-total-carrinho").removeClass('hidden');

        }else{

            $(".botao-carrinho").addClass('hidden');

            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    mensagem: (texto, cor='red', tempo = 3500) =>{
        
        let msg = `<div class="toast ${cor}">${texto}</div>`;

        let id = Math.floor(Date.now) * Math.random().toString();

        $("#container-mensagens").append(msg);

        setTimeout(() => {

            $("#msg-" + id).removeClass('fadeInDown');

            $("#msg-" + id).addClass('fadeOutUp');

            setTimeout(() => {

                $("#msg-" + id).remove();

            }, 800);
            
        }, tempo)

    }



}
bn  
cardapio.templates = {
    item: `
    <div class="col-3 mb-5">
        <div class="card card-item" id="\${id}">
        <div class="img-produto">
            <img src="\${img}" />
        </div>
        <p class="title-produto text-center mt-4">
            <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
            <b>R$ \${price}</b>
        </p>

        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="btn-numero-itens" id="qntd-\${id}">0</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-add" onclick="cardapio.metodos.adicionarCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
        </div>
        </div>
    </div>`

}
