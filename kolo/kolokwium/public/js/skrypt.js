const mapka = [
    { woj: 'pomorskie', left: 173, top: 1, width: 152, height: 125 },
    { woj: 'warmińsko-mazurskie', left: 327, top: 44, width: 168, height: 102 },
    { woj: 'zachodnio-pomorskie', left: 16, top: 54, width: 143, height: 124 },
    { woj: 'podlaskie', left: 501, top: 79, width: 115, height: 171 },
    { woj: 'lubuskie', left: 26, top: 193, width: 89, height: 141 },
    { woj: 'wielkopolskie', left: 123, top: 215, width: 130, height: 123 },
    { woj: 'mazowieckie', left: 387, top: 167, width: 106, height: 205 },
    { woj: 'kujawsko-pomorskie', left: 206, top: 147, width: 138, height: 64 },
    { woj: 'łódzkie', left: 277, top: 285, width: 104, height: 101 },
    { woj: 'dolnośląskie', left: 56, top: 345, width: 140, height: 70 },
    { woj: 'lubelskie', left: 499, top: 289, width: 121, height: 151 },
    { woj: 'opolskie', left: 203, top: 395, width: 59, height: 81 },
    { woj: 'śląskie', left: 268, top: 399, width: 62, height: 156 },
    { woj: 'świętokrzyskie', left: 354, top: 389, width: 133, height: 69 },
    { woj: 'małopolskie', left: 332, top: 462, width: 121, height: 111 },
    { woj: 'podkarpackie', left: 458, top: 459, width: 109, height: 113 }
];


window.onload = function () {
    mapka.forEach(element => {
        let area = document.createElement('area');
        let map = document.getElementById('mapka');

        area.id = element.woj;
        area.coords = element.left + "," + element.top + "," + (element.width + element.left) + "," + (element.height + element.top);
;
        map.appendChild(area);

        document.getElementById(element.woj).addEventListener('click', function() {
            socket = io.connect(`http://${location.host}`);
            console.log(element.woj);
            socket.on('connect', () => {
                socket.emit('woj', {
                    woj: element.woj
                });
                socket.on('gminy', (data) => {
                    let gminy = document.getElementById('gminy');

                    while (gminy.firstChild) {
                        gminy.removeChild(gminy.firstChild);
                    }
                    
                    let ke = 0;
                    let le = 0;
                    let pol = 0;
                    let jed = 0;
                    let pis = 0;
                    let eur = 0;
                    let wio = 0;
                    let kon = 0;
                    let kuk = 0;
                    let fair = 0;
                  
                    data.gminy.forEach(gmina => {
                        let li = document.createElement('li');
                        
                        li.innerText = gmina.gmina;

                        li.addEventListener('click', function() {

                            ke = gmina["KOALICJA EUROPEJSKA"];
                            le = gmina["LEWICA RAZEM"];
                            pol = gmina["POLEXIT"];
                            jed = gmina["JEDNOŚĆ NARODU"];
                            pis = gmina["PRAWO I SPRAWIEDLIWOŚĆ"];
                            eur = gmina["EUROPA CHRISTI"];
                            wio = gmina["WIOSNA"];
                            kon = gmina["KONFEDERACJA"];
                            kuk = gmina["KUKIZ'15"];
                            fair = gmina["POLSKA FAIR PLAY"];

                            new Chartist.Bar('.ct-chart2', {
                                series: [
                                  [ke, le, pol, jed, pis, eur, wio, kon, kuk, fair]
                                ],
                                labels: [
                                    'KE', 'LE', 'POL', 'PIS', 'EUR', 'WI', 'KO', 'KU', 'FP'
                                ]
                              }, {
                                seriesBarDistance: 10,
                                axisX: {
                                  offset: 60
                                },
                                axisY: {
                                  offset: 80,
                                  scaleMinSpace: 15
                                }
                              });
                        });

                        gminy.appendChild(li);

                        ke = 0;
                        le = 0;
                        pol = 0;
                        jed = 0;
                        pis = 0;
                        eur = 0;
                        wio = 0;
                        kon = 0;
                        kuk = 0;
                        fair = 0;
                        ke += gmina["KOALICJA EUROPEJSKA"];
                        le += gmina["LEWICA RAZEM"];
                        pol += gmina["POLEXIT"];
                        jed += gmina["JEDNOŚĆ NARODU"];
                        pis += gmina["PRAWO I SPRAWIEDLIWOŚĆ"];
                        eur += gmina["EUROPA CHRISTI"];
                        wio += gmina["WIOSNA"];
                        kon += gmina["KONFEDERACJA"];
                        kuk += gmina["KUKIZ'15"];
                        fair += gmina["POLSKA FAIR PLAY"];


                    });

                    new Chartist.Bar('.ct-chart', {
                        series: [
                          [ke, le, pol, jed, pis, eur, wio, kon, kuk, fair]
                        ],
                        labels: [
                            'KE', 'LE', 'POL', 'PIS', 'EUR', 'WI', 'KO', 'KU', 'FP'
                        ]
                      }, {
                        seriesBarDistance: 10,
                        axisX: {
                          offset: 60
                        },
                        axisY: {
                          offset: 80,
                          scaleMinSpace: 15
                        }
                      });

                });
            });
        });
    });

};