const App = {
    MAX_RT: 2,
    MAX_CASES: 240,
    rt: null,
    cases: null,
    previousDays: 0, // if it doesn't find data from today, adds one day before


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
        return (this.rt * 99) / this.MAX_RT + "%";
    },
    _getCases(dates) {
        const startDateStr = this._getFormatedDate(dates.startDate);
        const endDateStr = this._getFormatedDate(dates.endDate);
        const url = `https://covid19-api.vost.pt/Requests/get_entry/${startDateStr}_until_${endDateStr}`;

        fetch(url)
            .then(response => response.json())
            .then(commits => {

                const lastDayCases = commits.confirmados[Object.keys(commits.confirmados)[13]];
                const previousDayCases = commits.confirmados[Object.keys(commits.confirmados)[0]];
                this.cases = this._calculateCases(lastDayCases, previousDayCases);
                
                this._setPosition("y");

            }).catch(err => {
                // if it doesn't find data, try previous days
                if (this.previousDays <= 5) {
                    this.previousDays ++;
                    var dates = this._getDates(this.previousDays);
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
        const db = this.firebase.firestore();

        db.collection("rt").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();

                    this.rt = data.rt; // set RT
                    this._setPosition("x");
                })
            })
    },

    _initializeFirebase() {
        this.firebase = firebase.initializeApp({
            apiKey: "AIzaSyA0zCOtlm13rOxVrElzN9lmjObpr1Qateg",
            projectId: "cruzinhadocosta",
            appId: "1:420331082067:web:1d120775dd53e3858211a6"
        })
    },
    _startAnalytics() {
        this.firebase.analytics();
    },

    // INIT
    init() {
        this._setCases();

        this._initializeFirebase();

        this._getRT();

        const dates = this._getDates();
        this._getCases(dates);

        this._startAnalytics();
    }
}

App.init();