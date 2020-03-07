arrayPokemons = [];
arrayTipos = [];
urlBackend = 'INSIRA A URL DO BACKEND AQUI';
urlImagem = 'INSIRA A PASTA COM IMAGEM DOS POKEMONS AQUI';
urlTreinadores = 'INSIRA A PASTA COM IMAGEM DOS TREINADORES AQUI';
visualizados = 0;
battleVisualization = [5, 10, 15, 20, 25, 30];
treinadores = [
    {
        nome: 'Lucas',
        img: 'missingno.jpg',
        link: 'https://www.youtube.com/lucasdev',
    },
    {
        nome: 'Felipe Deschamps',
        img: 'deschamps.gif',
        link: 'https://www.youtube.com/channel/UCU5JicSrEM5A63jkJ2QvGYw',
    },
    {
        nome: 'Codigo Fonte TV',
        img: 'codigofonte.gif',
        link: 'https://www.youtube.com/user/codigofontetv',
    },
    {
        nome: 'Fábio Akita',
        img: 'akita.gif',
        link: 'https://www.youtube.com/user/AkitaOnRails',
    },
    {
        nome: 'Paulo Torrens',
        img: 'pauloTorrens.gif',
        link: 'https://www.facebook.com/groups/osadpa/',
    }
];

$(function () {
    carregarDados();
    openNav();
});

function startBattle() {
    const audio = document.getElementById('battle');
    audio.play();

    const treinador = treinadores[Math.floor(Math.random()*treinadores.length)];

    const modal = $(".modal-body");
    const batalha = `<h1>Um ${treinador.nome} selvagem apareceu</h1>
                     <img src="${urlTreinadores}/${treinador.img}" />
                     <div class="entre-botoes">
                     <a class="btn btn-success" href="${treinador.link}" target="_blank">Conhecer</a>
                     <button class="btn btn-light" onclick="stopBattle();">Fugir</button>
                     </div>`;
    modal.html(batalha);
    $("#modal").fadeIn();
}

function stopBattle() {
    const audio = document.getElementById('battle');
    audio.currentTime = 0;
    audio.pause();
    $(".modal-body").html('');
    $("#modal").fadeOut();
}

function arrayFilter() {
    const buscaEl = $("#busca");
    const busca = buscaEl.find("input").val().trim();
    const tipoSelect = buscaEl.find("select").val();

    const lista = arrayPokemons
        .filter(pokemon => {
            const nome = pokemon.nome.toUpperCase();
            const pesquisa = busca.toUpperCase();
            return nome.indexOf(pesquisa) > -1;
        })
        .filter(pokemon => {
            const tipos = pokemon.tipos
                .map(tipo => tipo.id);
            return tipos.find(tipo => tipo === tipoSelect || tipoSelect === 'todos');
        });
    return lista;
};

function openNav() {
    $("#menu").css('width', '100%');
    $("#menu").css('margin-right', '0px');
}

function closeNav() {
    $("#menu").css('width', '0');
    $("#menu").css('margin-right', '-40px');
}

function criarTipos() {
    const select = $("#busca").find("select");
    select.html('');

    let tipos = "<option value='todos' selected>TODOS</option>";
    arrayTipos.forEach(tipo => {
        tipos += `<option value='${tipo.id}'>${tipo.nome}</option>`;
    });
    select.html(tipos);
}

function criarTabela() {
    const tbody = $("#lista").find("table").find("tbody");
    tbody.html('');
    let pokemonsTr = '';

    const lista = arrayFilter();

    if (lista.length === 0) {
        pokemonsTr = `<tr>
                        <td colspan="2" style="text-align: center;">
                          SEM REGISTROS
                        </td>
                      </tr>`;

    } else {
        lista.forEach(pokemon => {
            pokemonsTr += `<tr onclick="abrirDetalhesPokemon($(this))" key="${pokemon.numero_dex}">
                             <td>#${pokemon.numero_dex}</td>
                             <td class='nomePokemon'>${pokemon.nome}</td>
                           </tr>`;
        });
    }

    tbody.html(pokemonsTr);
}

function abrirDetalhesPokemon(tr) {
    const numeroDex = tr.attr("key");
    const pokemon = arrayPokemons
        .find(pokemon => Number(pokemon.numero_dex) === Number(numeroDex));

    if (!pokemon) {
        console.log(`pokemon ${numeroDex} não encontrado`);
        return false;
    }

    $("td").removeClass("pokemonSelecionado");
    tr.find("td").addClass("pokemonSelecionado");

    visualizados++;

    if (battleVisualization.indexOf(visualizados) > -1) {
        startBattle();
    }

    escreverNaTela(pokemon);
    closeNav();
}

function pesquisarPorTipo(tipoId) {
    $("#busca").find("select").val(tipoId);
    criarTabela();
    openNav();
}

function carregarDados() {
    $.ajax({
        url: `${urlBackend}/pokemons`,
        dataType: 'JSON',
        success: function (result) {
            if (result.status === 0) {
                console.log(result.msg);
                return;
            }
            arrayPokemons = result.item;
            criarTabela();
        }
    });

    $.ajax({
        url: `${urlBackend}/tipos`,
        dataType: 'JSON',
        success: function (result) {
            if (result.status === 0) {
                console.log(result.msg);
                return;
            }
            arrayTipos = result.item;
            criarTipos();
        }
    });
}

function escreverNaTela({
    numero_dex,
    nome,
    img,
    descricao,
    id_anterior,
    anterior,
    id_proximo,
    proximo,
    tipos,
}) {

    const titulo = `${nome} - #${numero_dex}`;

    if (anterior) {
        const pokemonAnterior = anterior ? anterior : "NENHUM";
        const linkAnterior = anterior ? `abrirDetalhesPokemon($("tr[key='${id_anterior}']"))` : "";
        $("#evoluiDe").find("span").text(pokemonAnterior);
        $("#evoluiDe").find("span").attr("onclick", linkAnterior);
        $("#evoluiDe").find("span").addClass('evolucoesPokemon');
    } else {
        $("#evoluiDe").find("span").html('NENHUM');
        $("#evoluiDe").find("span").attr('onclick', '');
        $("#evoluiDe").find("span").removeClass('evolucoesPokemon');
    }

    if (proximo) {
        const pokemonProximo = proximo ? proximo : "NENHUM";
        const linkProximo = proximo ? `abrirDetalhesPokemon($("tr[key='${id_proximo}']"))` : "";
        $("#evoluiPara").find("span").text(pokemonProximo);
        $("#evoluiPara").find("span").attr("onclick", linkProximo);
        $("#evoluiPara").find("span").addClass('evolucoesPokemon');
    } else {
        $("#evoluiPara").find("span").html('NENHUM');
        $("#evoluiPara").find("span").attr('onclick', '');
        $("#evoluiPara").find("span").removeClass('evolucoesPokemon');
    }

    let tiposSpan = '';

    tipos.forEach(tipo => {
        const cor = tipo.cor ? `background-color: ${tipo.cor};` : '';
        const corTexto = tipo.corTexto ? `color: ${tipo.corTexto};` : '';
        const style = `style="${cor} ${corTexto}"`;

        tiposSpan += `<span onclick="pesquisarPorTipo(${tipo.id})" ${style}>
                                ${tipo.nome}
                              </span>`;
    });

    $("#titulo").text(titulo);
    $("#imagem").find("img").attr("src", `${urlImagem}/${img}`);
    $("#descricao").text(descricao);
    $("#tipos").html(tiposSpan);
}