#include <bits/stdc++.h>
using namespace std;

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  int n;
  cin >> n;

  vector<int> a(n);
  long long sum = 0;
  for (auto& x : a) {
    cin >> x;
    sum += x;
  }

  cout << sum << '\n';

  return 0;
}