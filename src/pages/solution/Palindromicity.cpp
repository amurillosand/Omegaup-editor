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

const int MX = 2e4 + 5;

int gauss(int n) {
  return 1LL * n * (n + 1) / 2LL;
}

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  vector<int> add = {0};
  while (add.back() < MX) {
    int x = add.size();
    add.emplace_back(gauss(x));
  }

  int tc;
  cin >> tc;

  int n;
  while (cin >> n) {

    int k = 0;
    while (n > 0) {
      int pos = upper_bound(all(add), n) - add.begin() - 1;
      cout << string(pos, char('a' + k));

      n -= add[pos];
      ++k %= 26;
    }

    cout << '\n';
  }

  return 0;
}

/* Please, check the following:
 * int overflow, array bounds
 * special cases (n=1?)
 * do smth instead of nothing and stay organized
 * write down your ideas
 * DON'T get stuck on ONE APPROACH!
 * ASK for HELP from your TEAMMATES
 */