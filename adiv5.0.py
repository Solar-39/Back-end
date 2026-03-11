import random
print("1 - Fácil")
print("2 - Médio")
print("3 - Difícil")

opcao = int(input("Digite a opção desejada (1 a 3): "))

if opcao == 1:
    sorteio_max = 10
    tentativas_max = 5
    print("Modo Fácil selecionado (˶ˆᗜˆ˵)")
elif opcao == 2:
    sorteio_max = 20
    tentativas_max = 3
    print("Modo Médio selecionado (˶> ₃ <˶)")
else:
    sorteio_max = 50
    tentativas_max = 3
    print("Modo Difícil selecionado (¬`‸´¬)")

numero = random.randint(0, sorteio_max)
tentativas = 1
errou = True

while tentativas <= tentativas_max:
    print("Tentativa:", tentativas)
    chute = int(input("Digite o seu chute (0 a 10):"))
    
    if chute == numero:
        print("Parabéns, você acertouu!!!!! (˶˃ ᵕ ˂˶)")
        errou = False
        break
    else:
        print("Errou (╥﹏╥)")
        if chute < numero:
            print("O número é maior")
        else:
            print("O número é menor")
            
    tentativas = tentativas + 1

if errou:
    print("O número sorteado era:", numero)

print("### FIM DO JOGO ###")