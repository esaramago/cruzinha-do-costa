const App = {
    MAX_RT: 2,
    MAX_CASES: 240,
    rt: null,
    cases: null,


    // GET CASES
    _setCases() {
        const cases = document.getElementById("cases");
        if (cases)
            cases.textContent = this.MAX_CASES / 2;
    },
    _getYPosition() {
        return (this.cases * 90) / this.MAX_CASES + "%";
    },
    _getXPosition() {
        return (this.rt * 93.5) / this.MAX_RT + "%";
    },
    _getCases(dates) {
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
                
                this._setPosition("y");

            }).catch(err => {
                // if it doensn't find data, try previous days
                if (prevDays <= 5) {
                    prevDays ++;
                    var dates = this._getDates(prevDays);
                    this._getCases(dates);
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
        const dateStr = date.toISOString().split("T");
        const splitDate = dateStr[0].split("-");
        return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    },
    _setPosition(axis) {

        const cruzinha = document.getElementById("cruzinha");
        if(cruzinha) {
            if (axis === "x") {
                cruzinha.style.left = this._getXPosition();
            }
            if (axis === "y") {
                cruzinha.style.bottom = this._getYPosition();
            }

            // check if RT and Cases data is loaded
            if(this.rt && this.cases) {
                cruzinha.removeAttribute("hidden"); // show cruzinha
            }
        }
    },

    // GET RT
    _getRT() {

        // https://console.firebase.google.com/project/cruzinhadocosta/firestore/
        const db = firebase.initializeApp({ projectId: "cruzinhadocosta" }).firestore();

        db.collection("rt").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();

                    this.rt = data.rt; // set RT
                    this._setPosition("x");
                })
            })
    },

    // INIT
    init() {
        this._setCases();

        this._getRT();

        const dates = this._getDates();
        this._getCases(dates);
    }
}

App.init();