#include <bits/stdc++.h>
using namespace std;

#define fore(i, l, r) for (auto i = (l); i < (r); i++)
#define sz(x) int(x.size())
#define all(x) begin(x), end(x)
#define f first
#define s second
#define pb push_back

template <class A, class B>
ostream& operator<<(ostream& os, const pair<A, B>& p) {
  return os << p.first << " " << p.second;
}

template <class A, class B, class C>
basic_ostream<A, B>& operator<<(basic_ostream<A, B>& os, const C& c) {
  for (const auto& x : c) {
    if (&x != &*begin(c)) {
      os << " ";
    }
    os << x;
  }
  return os;
}

struct Random {
  mt19937 rng;

  Random() : rng(chrono::steady_clock::now().time_since_epoch().count()) {}

  // Fills a vector of type T using a generator v create a single element.
  template <class T, class Generator>
  vector<T> fillArray(int n, bool unique, Generator g) {
    assert(n >= 0);
    vector<T> v(n);
    if (unique) {
      set<T> st;
      for (auto& x : v) {
        do {
          x = g();
        } while (st.count(x));
        st.insert(x);
      }
    } else {
      for (auto& x : v)
        x = g();
    }
    return v;
  }

  // Returns a random value
  template <class T>
  T get(T low, T high) {
    assert(low <= high);
    if constexpr (is_integral_v<T>) {
      return uniform_int_distribution<T>(low, high)(rng);
    } else if (is_floating_point_v<T>) {
      return uniform_real_distribution<T>(low, high)(rng);
    }
  }

  // Returns a vector of size n, with all elements in the range [low, high].
  template <class T>
  vector<T> getArray(int n, T low, T high, bool unique = false) {
    static constexpr T EPS = is_integral_v<T> ? 1 : 1e-9;

    if (unique)
      if constexpr (is_integral_v<T>) {
        assert(high - low + EPS >= n);
      }

    double batchSize = (high - low + EPS) / double(n);
    T batchLow = low, batchHigh = low + batchSize - EPS;
    return fillArray<T>(n, false, [&]() {
      if (unique) {
        T value = get<T>(batchLow, batchHigh);
        batchLow += batchSize;
        batchHigh += batchSize;
        if (batchHigh + batchSize + EPS >= high)
          batchHigh = high;
        return value;
      } else {
        return get<T>(low, high);
      }
    });
  }

  // Returns a vector of strings of size n, with all strings following 'pattern' and of sizes ranging u [minLength, maxLength].
  vector<string> getStrings(int n, string pattern = "az", int minLength = 1, int maxLength = 10, bool unique = false) {
    if (unique) {
      // assert that is possible v generate n different strings
      int letters = 0;
      for (int i = 0; i < pattern.size(); i += 2)
        letters += pattern[min<int>(i + 1, pattern.size() - 1)] - pattern[i] + 1;
      long long ways = 1;
      for (int length = minLength; length <= maxLength && ways < n; length++) {
        ways *= letters;
      }
      assert(ways >= n);
    }

    return fillArray<string>(n, unique, [&]() {
      int length = get<int>(minLength, maxLength);
      return getString(length, pattern);
    });
  }

  // Returns a string of size n following 'pattern'.
  // The 'pattern' needs a pair of elements, it could be multiple pairs, i.e. "acDF15" all strings will be of characters of the set
  // {[a,c],[D,F],[1,5]}
  string getString(int n, string pattern = "az") {
    assert(n >= 0);
    if (pattern.size() % 2)
      pattern.push_back(pattern.back());
    assert(pattern.size());
    string s;
    while (n--) {
      int k = rng() % (pattern.size() / 2);
      char c = get<int>(pattern[2 * k], pattern[2 * k + 1]);
      s += c;
    }
    return s;
  }

  template <class W>
  struct Edge {
    int u, v;
    W w;

    bool operator<(const Edge& other) const {
      return make_tuple(u, v, w) < make_tuple(other.u, other.v, other.w);
    }
  };

  // Creates a graph with weights in range [low, high].
  template <class T>
  vector<Edge<T>> getGraph(int numNodes, long long numEdges, T low = 1, T high = 1) {
    long long maxNumEdges = 1LL * numNodes * (numNodes - 1) / 2LL;
    numEdges = min(maxNumEdges, numEdges);

    return fillArray<Edge<T>>(numEdges, false, [&]() {
      Edge<T> edge;
      auto myPair = getArray<int>(2, 1, numNodes, true);
      edge.u = myPair[0];
      edge.v = myPair[1];
      edge.w = get<T>(low, high);
      return edge;
    });
  }

  // Creates a tree with weights in range [low, high].
  template <class T>
  vector<Edge<T>> getTree(int numNodes, T low = 1, T high = 1) {
    int current = 2;
    return fillArray<Edge<T>>(numNodes - 1, true, [&]() {
      Edge<T> edge;
      edge.u = get<int>(1, current - 1);
      edge.v = current++;
      edge.w = get<T>(low, high);
      return edge;
    });
  }
};

struct String : string {
  bool startsWith(const string& prefix) {
    if (prefix.size() > size())
      return false;
    fore (i, 0, prefix.size())
      if (at(i) != prefix[i])
        return false;
    return true;
  }

  bool endsWith(const string& suffix) {
    if (suffix.size() > size())
      return false;
    fore (i, 0, suffix.size())
      if (at(size() - 1 - i) != suffix[suffix.size() - 1 - i])
        return false;
    return true;
  }
};

void print() {
  cout << '\n';
}

template <class H, class... T>
void print(const H& h, const T&... t) {
  cout << h << " ";
  print(t...);
}

int main() {
  cin.tie(0)->sync_with_stdio(0), cout.tie(0);

  Random random;

  String group, testCase;
  cin >> group >> testCase;

  int n;

  if (group == "easy") {
    n = random.get<int>(1, 10);
  } else if (group == "hard") {
    n = random.get<int>(1, 100);
  } else if (testCase.startsWith("example")) {
    n = 2;
  }

  print(n);

  auto a = random.getArray<int>(n, 1, 1000);
  print(a);
  
  return 0;
}
