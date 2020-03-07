<?php
require_once("../conexao.php");

function buscarTiposPokemon($idPokemon, $conexao) {
    $sqlTipos = "SELECT t.id, t.nome, t.cor, t.corTexto
                 FROM tipos t
                 JOIN pokemons_tipos tp ON tp.id_tipo = t.id
                 WHERE tp.id_pokemon = '$idPokemon'";
    $resultTipos = $conexao->query($sqlTipos);
    $arrayTipos = array();

    while($listTipos = $resultTipos->fetch_assoc()) {
        array_push($arrayTipos, $listTipos);
    }

    return $arrayTipos;
}

$tipo = isset($_GET["tipo"]) ? htmlspecialchars($_GET["tipo"]) : NULL;

$extraQuery = $tipo ? "WHERE lower(t.nome) = lower('$tipo')" : "";

$sql = "SELECT p.numero_dex
              ,p.nome
              ,p.img
              ,p.descricao
              ,ant.numero_dex id_anterior
              ,ant.nome anterior
              ,prox.numero_dex id_proximo
              ,prox.nome proximo
        FROM pokemons p
        LEFT JOIN pokemons ant ON ant.numero_dex = p.anterior
        LEFT JOIN pokemons prox ON p.numero_dex = prox.anterior
        LEFT JOIN pokemons_tipos tp ON tp.id_pokemon = p.numero_dex
        LEFT JOIN tipos t ON t.id = tp.id_tipo
        $extraQuery
        GROUP BY p.numero_dex";

if (!$result = $conexao->query($sql)) {
    $retorno["status"] = 0;
    $retorno["qtd"] = 0;
    $retorno["msg"] = "Erro ". $conexao->error;
    $retorno["item"] = [];
} else {
    $tmp_array = array();
    $retorno["status"] = 1;
    $retorno["qtd"] = $result->num_rows;
    while($list = $result->fetch_assoc()) {
        $list["tipos"] = buscarTiposPokemon($list["numero_dex"], $conexao);
        array_push($tmp_array, $list);
    }
    $retorno["item"] = $tmp_array;
}

$json = json_encode($retorno, JSON_UNESCAPED_UNICODE);
exit($json);
