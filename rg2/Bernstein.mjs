export class Bernstein {
    constructor(n, k) {
        this.binom = binomial(n, k);
        this.n = n;
        this.k = k;

        this.zero = false;
        if (this.k > this.n || this.k < 0)
            this.zero = true;
    }

    value(x) {
        if (this.zero) return 0;
        return this.binom * x ** this.k * (1 - x) ** (this.n - this.k);
    }

    derivative(x) {
        return this.n * (new Bernstein(this.n - 1, this.k - 1).value(x) - new Bernstein(this.n - 1, this.k).value(x));
    }

}
function binomial(n, k) {
    var coeff = 1;
    for (var x = n - k + 1; x <= n; x++)coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}