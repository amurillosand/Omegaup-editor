#include <bits/stdc++.h>
using namespace std;

#define fore(i, l, r) for (int i = (l); i < (r); i++)

using ii = pair<int, int>;
int row, col;

const int N = 1005;
int dr[] = {-1, 0, 1, 0};
int dc[] = {0, 1, 0, -1};
string mat[N];
int dist[N][N];
vector<ii> far;
int maxDist;
int n, m;

mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

template <class T>
T random(T l, T r) {
  return uniform_int_distribution<T>(l, r)(rng);
}

bool valid(int r, int c) {
  return 0 <= r && r < n && 0 <= c && c < m;
}

void bfs(int sr, int sc) {
  fore (r, 0, n)
    fore (c, 0, m)
      dist[r][c] = -1;

  queue<ii> que;

  que.push({sr, sc});
  dist[sr][sc] = 0;

  while (que.size()) {
    auto [r, c] = que.front();
    que.pop();

    fore (i, 0, 4) {
      int nr = r + dr[i];
      int nc = c + dc[i];

      if (!valid(nr, nc))
        continue;
      if (dist[nr][nc] != -1)
        continue;

      if (mat[nr][nc] == '.') {
        dist[nr][nc] = dist[r][c] + 1;
        que.push({nr, nc});

        if (dist[nr][nc] > maxDist) {
          maxDist = dist[nr][nc];
          far.clear();
        }

        if (dist[nr][nc] == maxDist) {
          far.emplace_back(nr, nc);
        }
      }
    }
  }
}

void readTestCase() {
  ifstream cin("data.in");

  cin >> n >> m;
  fore (r, 0, n)
    cin >> mat[r];

  int r, c;
  cin >> r >> c;

  // Solve
  bfs(r - 1, c - 1);

  cin.close();
}

void readCorrect() {
  ifstream cin("data.out");

  cin.close();
}

double score() {
  // Leer la respuesta del concursante

  int row, col;
  if (!(cin >> row))
    return 0.0;
  if (!(cin >> col))
    return 0.0;

  row--, col--;

  for (auto [r, c] : far)
    if (r == row && c == col)
      return 1;

  return 0.0;
}

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  readTestCase();
  // readCorrect();

  cout << fixed << setprecision(2) << score() << '\n';

  return 0;
}