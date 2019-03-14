// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBwE9yjpyz60Le4j6krVBvHU9Yk3wyCIjg",
//     authDomain: "gifvia-7b161.firebaseapp.com",
//     databaseURL: "https://gifvia-7b161.firebaseio.com",
//     projectId: "gifvia-7b161",
//     storageBucket: "gifvia-7b161.appspot.com",
//     messagingSenderId: "400561292234"
// };
var config = {
    apiKey: "AIzaSyAh9csQszjYRTf32OYxyoalMqw1fIusxac",
    authDomain: "gifvia-b45c0.firebaseapp.com",
    databaseURL: "https://gifvia-b45c0.firebaseio.com",
    projectId: "gifvia-b45c0",
    storageBucket: "gifvia-b45c0.appspot.com",
    messagingSenderId: "160762099816"
};
firebase.initializeApp(config);
var database = firebase.database();
const PAST_PLAYERS_REF = "past-players";
const QUESTION_REF = "questions";

var pastPlayers = [];
var questions = [];
var categoryHistogram = {};
var questionHistogram = {};
var question = {};

database.ref(PAST_PLAYERS_REF).on('value', function (snapshot) {
    if (snapshot.val()) {
        pastPlayers = [];

        snapshot.forEach(function (childSnapshot) {
            pastPlayers.push(childSnapshot.val());
        });

        ///
        // console.log("past players:");
        console.log(pastPlayers);

        makeCategoryHistogram();
        plotChart1();

    } else {
        console.log(`There is no data: ${PAST_PLAYERS_REF}`);
    }
});

database.ref(QUESTION_REF).on('value', function (snapshot) {
    if (snapshot.val()) {
        questions = [];

        snapshot.forEach(function (childSnapshot) {
            questions.push(childSnapshot.val());
        });

        // console.log("questions: ");
        console.log(questions);
    } else {
        console.log(`There is no data for ${QUESTION_REF}`);
    };

    makeQuestionsHistogram();
    plotChart2();
})

function makeCategoryHistogram() {

    pastPlayers.forEach(function (player) {
        if (player.category in categoryHistogram) {
            categoryHistogram[player.category] += 1;
        } else {
            categoryHistogram[player.category] = 1;
        }
    });

    ////
    // console.log("categoryHistogram:");
    // console.log(categoryHistogram);
}

function makeQuestionsHistogram() {

    questions.forEach(function (question) {
        if (question.category in questionHistogram) {
            questionHistogram[question.category] += 1;
        } else {
            questionHistogram[question.category] = 1;
        }
    });

    console.log(questionHistogram);
}


function plotChart1() {

    // var labels = Object.keys(categoryHistogram);
    // var data = Object.values(categoryHistogram);

    var sortable = [];
    for (var category in categoryHistogram) {
        sortable.push([category, categoryHistogram[category]]);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    var labels = [];
    var data = [];
    for (let i = 0; i < sortable.length; i++) {
        labels.push(sortable[i][0]);
        data.push(sortable[i][1]);

    }

    ////
    // console.log(labels);
    // console.log(data);

    var totalCountGames = pastPlayers.length;

    ////
    // console.log(totalCountGames);
    
    Chart.defaults.global.defaultFontSize = 16;

    var ctx = document.getElementById("chart-1").getContext('2d');
    
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    // 'rgba(153, 102, 255, 1)',
                    // 'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Most Often Chosen Quiz Topics, Games Played: ' + totalCountGames,
            },

        }
    });
};

function plotChart2() {


    var sortableTwo = [];
    for (var category in questionHistogram) {
        sortableTwo.push([category, questionHistogram[category]]);
    }
    sortableTwo.sort(function (a, b) {
        return b[1] - a[1];
    });

    var questionLabels = [];
    var dataChartTwo = [];
    for (let i = 0; i < sortableTwo.length; i++) {
        questionLabels.push(sortableTwo[i][0]);
        dataChartTwo.push(sortableTwo[i][1]);
    };

    console.log(questionLabels);
    console.log(dataChartTwo);


    var ctx = document.getElementById("chart-2");

    var barChartData = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: questionLabels, // categories, x-axis
            datasets: [{
                data: dataChartTwo,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    // 'rgba(75, 192, 192, 1)',
                    // 'rgba(153, 102, 255, 1)',
                    // 'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: "Amount of questions asked per topic",
            }
        }
    })
};
