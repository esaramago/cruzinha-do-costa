const App = {
    MAX_RT: 2,
    MAX_CASES: 240,
    rt: 0.8,
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
    _getData(dates) {
        const startDateStr = this._getFormatedDate(dates.startDate);
        const endDateStr = this._getFormatedDate(dates.endDate);
        const url = `https://covid19-api.vost.pt/Requests/get_entry/${startDateStr}_until_${endDateStr}`;

        let prevDays = 0;
        fetch(url)
            .then(response => response.json())
            .then(commits => {

                const lastDayCases = commits.confirmados[Object.keys(commits.confirmados)[13]];
                const previousDayCases = commits.confirmados[Object.keys(commits.confirmados)[0]];
                this.cases = this._calculateCases(lastDayCases, previousDayCases);
                
                this._setPosition();

            }).catch(err => {
                // if it doensn't find data, try previous days
                if (prevDays <= 5) {
                    prevDays ++;
                    var dates = this._getDates(prevDays);
                    this._getData(dates);
                }
            });

    },
    _getDates(prevDays = 0) {
        const daysRange = 14;
        const today = new Date();
        const startDate = new Date().setDate(today.getDate() - daysRange - prevDays);
        const endDate = new Date().setDate(today.getDate() - prevDays);
        return dates = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        }
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

        const dates = this._getDates();
        this._getData(dates);
    }
}

App.init();