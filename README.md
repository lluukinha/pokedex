# Pokedex PHP

Este código é um projeto que inclui um backend feito em PHP e um frontend usando somente HTML, CSS e JavaScript (jQuery também)
Todo o banco de dados foi gerado através de uma planilha em excel.

## Projeto
Todo o projeto foi gravado desde o início, e você pode acompanhá-lo neste link aqui:

[Criando a Pokedex](https://www.youtube.com/playlist?list=PLIUcOrGGQI6Q7iXUBgHWilAXeHdMkZRFS)

## Instalação

Você precisará ter uma máquina rodando apache para carregar o servidor php da forma como está, se não precisará de fazer algumas alterações importantes.

O Projeto foi feito pensando em usar o Front em um Servidor separado do backend, mas pode ser usado no mesmo sem problemas.

## Banco de Dados
Para os preguiçosos, vou disponibilizar uma versão `.sql` do banco de dados, porém aconselharia você a tentar criar do zero acompanhando a playlist no youtube. O código que uso para concatenar é
```bash
INSERT INTO --nomeDaTabela-- (--colunas--) VALUES 
CONCAT("('";ID;"','";NOME;"','";ETC....;"'),")
```
Fazendo isso, ele vai gerar uma query feita pronta para ser rodada e inserida no seu banco.


## Contribua
Pull requests são bem vindos.

Insira dados que considere importantes no código para que ele continue vivo.
