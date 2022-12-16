#include <bits/stdc++.h>
using namespace std;

#define fore(i, l, r) for (int i = (l); i < (r); i++)

void readTestCase() {
  // Entrada original que se le fue dada al concursante
  ifstream cin("data.in");

  cin.close();
}

void readCorrect() {
  // Archivo que puede contener más información util para evaluar (por ejemplo preprocesamiento de todas las respuestas para este caso)
  // Esta NO es la respuesta del concursante
  ifstream cin("data.out");

  cin.close();
}

double score() {
  // Aqui se lee la respuesta del concursante con entrada normal
  // Se tiene que comprobar que la respuesta tenga la forma esperada
  // Regresar un valor entre 0 y 1 el porcentaje obtenido
  return 0.0;
}

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  readTestCase();
  readCorrect();

  cout << fixed << setprecision(2) << score() << '\n';

  return 0;
}
