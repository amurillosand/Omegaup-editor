#pragma GCC optimize("Ofast,unroll-loops,no-stack-protector")
#include <bits/stdc++.h>
using namespace std;

#define fore(i, l, r) for (auto i = (l) - ((l) > (r)); i != (r) - ((l) > (r)); i += 1 - 2 * ((l) > (r)))
#define sz(x) int(x.size())
#define all(x) begin(x), end(x)
#define f first
#define s second
#define pb push_back

#ifdef LOCAL
#include "debug.h"
#else
#define debug(...)
#endif

using ld = long double;
using lli = long long;
using ii = pair<int, int>;

const int N = 305;
const int T = 5e3 + 5;

bool isPal[N][N];
int need[T];
int tc;

void readTestCase() {
  ifstream cin("data.in");

  cin >> tc;

  fore (i, 0, tc) {
    cin >> need[i];
  }

  cin.close();
}

void readCorrect() {
  ifstream cin("data.out");

  // Leer la salida esperada (No es necesario)

  cin.close();
}

int countPalindromes(string& s) {
  fore (i, 0, sz(s))
    fore (j, 0, sz(s))
      isPal[i][j] = 0;

  fore (len, 1, sz(s) + 1) {
    fore (i, 0, sz(s)) {
      int j = i + len - 1;
      if (j >= sz(s)) {
        break;
      }

      if (len == 1) {
        isPal[i][i] = 1;
      } else if (len == 2) {
        isPal[i][i + 1] = (i + 1 < sz(s) && s[i] == s[i + 1]);
      } else {
        isPal[i][j] = (isPal[i + 1][j - 1] && s[i] == s[j]);
      }
    }
  }

  int cnt = 0;
  fore (i, 0, sz(s))
    fore (j, i, sz(s)) {
      cnt += isPal[i][j];
    }

  return cnt;
}

double score() {
  // Leer la respuesta del concursante
  // Comprobar que la respuesta tenga la forma esperada
  // Regresar un valor entre 0 y 1 el porcentaje obtenido

  string s;
  fore (i, 0, tc) {
    if (!(cin >> s))
      return 0;

    if (sz(s) > 300)
      return 0;

    int cnt = countPalindromes(s);
    if (cnt != need[i])
      return 0;
  }

  return 1;
}

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  readTestCase();
  // readCorrect();

  cout << fixed << setprecision(2) << score() << '\n';

  return 0;
}
