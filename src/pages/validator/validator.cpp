#include <bits/stdc++.h>
using namespace std;

#define fore(i, l, r) for (int i = (l); i < (r); i++)

void readTestCase() {
  ifstream cin("data.in");
  
  // Leer la entrada de cada caso

  cin.close();
}

void readCorrect() {
  ifstream cin("data.out");

  // Leer la salida esperada (No es necesario)

  cin.close();
}

double score() {
  // Leer la respuesta del concursante
  // Comprobar que la respuesta tenga la forma esperada
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
