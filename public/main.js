const App = {
    MAX_RT: 2,
    MAX_CASES: 240,
    rt: 1,
    cases: null,

    _setCases() {
        const cases = document.getElementById('cases');
        if (cases)
            cases.textContent = this.MAX_CASES / 2;
    },
    _getYPosition() {
        return (this.cases * 90) / this.MAX_CASES + '%';
    },
    _getXPosition() {
        return (this.rt * 93.5) / this.MAX_RT + '%';
    },
    _getData() {
        const url = "https://covid19-api.org/api/timeline/pt";

        fetch(url)
            .then(response => response.json())
            .then(commits => {

                const lastDayCases = commits[0].cases;
                const previousDayCases = commits[13].cases;
                const newCases = lastDayCases - previousDayCases;
                
                const populationPT = 10295909;
                const newCasesByPopulation = (100000 * newCases) / populationPT;
                
                this.cases = newCasesByPopulation;

                this._setPosition();

            });

    },
    _setPosition() {

        const cruzinha = document.getElementById('cruzinha');
        if(cruzinha) {
            cruzinha.style.bottom = this._getYPosition();
            cruzinha.style.left = this._getXPosition();

            cruzinha.removeAttribute("hidden");
        }
    },

    init() {
        this._setCases();
        this._getData();
    }
}

App.init();