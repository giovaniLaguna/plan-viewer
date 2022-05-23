Dados do Backend
-> 

Pagina
-> workspace/division-definition/division/{divisionId}/{layoutId}
    - header
        -> (mostra) titulo do espaço
    - toolbar
        -> ferramenta de desenho (circulo e quadrado)
        -> ferramenta de alocação de espaços
    - planta
        -> (faz) desenha com a ferramenta selecionada
        - espaços
            -> (mostra) formato do espaço
            -> (faz) marca estações
            -> 
        - 
        -> (mostra) espaços
            -> (mostra) estações
        - zoom
            -> (mostra) minimapa com a area visivel da planta
            -> (mostra/faz) controla o zoom


ui state
    - ferramenta ativa no momento
    - nivel de zoom aplicado
    - posicionamento da view

Ações da tela
- selecionar um ferramenta
- desenhar um forma
- estação
    - criar estações
    - editar uma estação
    - remover uma estação
- espaço
    - desenhar um espaço
    - remover um espaço
    - salvar um espaço
    - editar um espaço
- 


Atividades
-> carregar dados da request
    -> popular 


------------------------------------------------

planta-viewer
    - (input) src planta [recebe a iamgem da planta]
    - (input) pixel per zoom = 1280 [ex - 1280px equivale a 1 de zoom, se a imagem for dez vezes maior o zoom exibido sera de 0.1]
    - (input) autoZoom = true [faz a imagem preencher a largura maxima do componente]
    - (input/output) zoom (1 é normal, 2 é o dobro)
        -> sera defiido automaticamente após renderização do componente
    - (input/output) visibleAreaPosition (x,y)
    - (output) draw (inicia com um mousedown (x,y), drag, mouseup(x,y))
        -> as coordenadas deste evento são computadas de acordo com o posicionamento e o zoom
    - dragMode = 'draw' | 'move'
    - 
    - (input) canMove = false [esta propriedade sera usada com true para a visualização no mobile]
    - // minZoom = 0
    - // maxZoom = computado de acordo com o tamanho
    --- considerações de dev
        - o dimensionamento deste elemento deve ser recalculado com o resize da janela
        - a largura padrão é 100%
        - a altura padrão também é 100%
        - o container deve limitar o tamanho
        - o resize da pagina, recalcula o tamanho fisico deste elemento, e entao recalcula toda a imagem
        - por isso este componente deve ser inserido em uma div que ocupe 100%, de largura e altura da área disponivel dele 
    --- mais considerações
        - o control click / tap, arrasta a view
            fazer a penas se der tempo e separar task da atividade
    --- responsabilidades do plata views
        - servir apenas de interface da plata
        - permitir o uso de zoom
        - permitir o arrastar
        - permitir a exibição de objetos na view, como as estações
        - permitir o calculo automatico correto de zoom de acordo com o tamanho da planta
        - não faz nenhuma interação com api
        - não controla dados
        - é apenas uma interface burra, com o objetivo de posicionar elementos e dar zoom

    ng-content controlsLayer
        --- descricao da camada
        - esta é a camada de controles que ficara acima de tudo na planta

        planta-minimap
        - (injetado pelo planta-viewer) src planta
        - (injetado e sincronizado pelo planta-viewer) visibleAreaPosition (x,y)
        ---
        - (injetado e sincronizado pelo planta-viewer) zoom
        - minZoom = 0
        - maxZoom = 2

        planta-simple-zoom
        - (injetado e sincronizado pelo planta-viewer) zoom
        - minZoom = 0
        - maxZoom = 2
    
    ng-content objectsLayer
        --- descricao da camada
        - esta é a camada de objetos que fica acima da planta e abaixo dos controles

        [planta-object] directive
        - (output) click (positionRelativeToObject, positionRelativeToPlanta)
        - (output) dblClick (positionRelativeToObject, positionRelativeToPlanta)
        - (input/output) position (x,y)
        - (input/output) size (height, width)
        --- desc
        - esta diretiva funciona apenas para posicionar os objetos nesta camada
        - exibir informacoes do posicionamento real
        - e adicionar informacoes de posicionamento a alguns eventos do mouse

        planta-room [extends planta-object]
            herdado
            - (output) click (positionRelativeToObject, positionRelativeToPlanta)
            - (output) dblClick (positionRelativeToObject, positionRelativeToPlanta)
            - (input/output) position (x,y)
            - (input/output) size (height, width)
            ---
            - (input) shape ['rect', 'oval']
            - (input) selected = false [indica se esta selecionada ou não]
            - (input) description = '' [titulo da sala]
            - (input) resize allowed = true [se pode redimencionar ou não]
            - (input) drag allowed = true [se pode arrastar ou não]
            - (input) shouldShowToolbar = false [se pode exibir a toolbar quando selecionado]
            - (output) delete
            - (output) edit
            - (output) save

            planta-room-toolbar [não precisa ser um componente]
                (output) delete
                    se der tempo colocarei o keyup.delete para triggar este evento
                (output) edit
                (output) save
                ----
                quando a estação estiver com foco, exibe a toolbar se shouldShowToolbar for true

            ng-content
                planta-station
                    (input) stationRelativePosition (x,y) (posicao relativa a estacao)
                    (input) plantaRelativePosition (x,y) (posicao relativa a planta)
                    (output) click -> nativo
                    (output) dblClick -> nativo
                    (input) label
                    --- responsabilidades
                    - se posicionar de forma relativa a sala e a planta
                    - exibir uma label



Alinhamentos com Rapha
    ajustes de usabilidades
        - 1 clique no espaço ja entra no modo edição
        - 2 cliques no espaço ja abre a modal de detalhes
        - 1 clique na estação, abre modal de confirmação de exclusão
    funcionamento do zoom
        - mostra no modo contain ao abrir
        - régua do zoom variavel de acordo com tamanho da imagem
            -> zoom fica de acordo com quantidade de pixels
            -> 100% equivale a x pixels
            -> quando abre a tela, o zoom ira automaticamente para o valor que preenche a tela
            -> 
    