const App = {
    MAX_RT: 2,
    MAX_CASES: 240,
    rt: 0.71,
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
        //const url = "https://covid19-api.org/api/timeline/pt";

        const today = new Date();
        const startDate = new Date().setDate(today.getDate() - 14);
        const startDateStr = this._getFormatedDate(new Date(startDate));
        const endDateStr = this._getFormatedDate(today);
        const url = `https://covid19-api.vost.pt/Requests/get_entry/${startDateStr}_until_${endDateStr}`;

        fetch(url)
            .then(response => response.json())
            .then(commits => {

                //const lastDayCases = commits[0].cases;
                //const previousDayCases = commits[13].cases;
                const lastDayCases = commits.confirmados[Object.keys(commits.confirmados)[13]];
                const previousDayCases = commits.confirmados[Object.keys(commits.confirmados)[0]];
                this.cases = this._calculateCases(lastDayCases, previousDayCases);
                this._setPosition();

            });

    },
    _calculateCases(lastDayCases, previousDayCases) {
        const newCases = lastDayCases - previousDayCases;
        const populationPT = 10295909;
        const newCasesByPopulation = (100000 * newCases) / populationPT;

        return newCasesByPopulation;
    },
    _getFormatedDate(date) {
        const dateStr = date.toISOString().split('T');
        const splitDate = dateStr[0].split('-');
        return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
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