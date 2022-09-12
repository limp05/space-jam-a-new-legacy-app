import csv

# O nome do jogador está na segunda coluna (índice 1).
NAME_INDEX = 1

# O PER do jogador está na 10ª coluna (índice 9).
PER_INDEX = 9

# Existem apenas 15 jogadores que estamos lendo.
COUNT = 15

# # Abra o arquivo game_stats.csv.
with open('game_stats.csv') as csv_file:
    # Use o leitor de CSV e confirme que o delimitador é uma vírgula.
    csv_reader = csv.reader(csv_file, delimiter=',')
    
    # Inicializa o contador e as listas vazias.

    character_count = 0
    names = []
    pers = []
    urls = []

    # lopp passando por cada linha do CSV
    for row in csv_reader:
        # Ignora a primeira linha, pois é o cabeçalho.
        if character_count == 0:
            character_count += 1
        
        # Pegue apenas os dados dos 15 primeiros porque precisamos apenas do PER inicial do jogador, não para cada quarto.

        elif character_count <= COUNT:
            # O nome do jogador está na segunda coluna (no índice 1).
            names.append(row[NAME_INDEX])

            # O arquivo de imagem do player é o nome dele sem espaços ou ponto e todo em minúsculas.
            urls.append("https://sjanlassets.blob.core.windows.net/assets/" + row[NAME_INDEX].replace(" ","").replace(".","").lower()+".png")

            # O PER do jogador está na 10ª linha (no índice 9).
            pers.append(row[PER_INDEX])

            character_count += 1
        else:
            break

# Crie um arquivo players.json se ainda não estiver criado e abra-o. 
# # O parâmetro "w" substituirá o arquivo se houver algo nele.
f = open("players.json", "w")

# Grava o colchete de abertura do objeto JSON no arquivo.
f.write("[\n")

# Iterar sobre todos os jogadores.
for index in range(0,COUNT):
    # Escreva o colchete de abertura do primeiro objeto player no arquivo.
    f.write("\t{\n")

    # Escreva o nome, PER e url da imagem, com seus rótulos, no arquivo.
    f.write("\t\t\"nome\": \""+names[index]+"\",\n")
    f.write("\t\t\"per\": \""+pers[index]+"\",\n")
    f.write("\t\t\"imgUrl\": \""+urls[index]+"\"\n")
    f.write("\t},\n")

# Escreva o colchete de abertura do objeto Yosemite Sam no arquivo.
f.write("\t{\n")

# Escreva o nome dele, PER (0), e o URL da imagem, com os rótulos de dados, no arquivo.
f.write("\t\t\"nome\": \"Yosemite Sam\",\n")
f.write("\t\t\"per\": \"0\",\n")
f.write("\t\t\"imgUrl\": \"https://sjanlassets.blob.core.windows.net/assets/yosemitesam.png\"\n")

# Já que ele é o último do Tune Squad, não inclua uma vírgula após fechar seu objeto.
f.write("\t}\n")

# Grave o colchete de fechamento no objeto JSON no arquivo.

f.write("]")

#feche o arquivo

f.close()

