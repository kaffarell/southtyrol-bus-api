tableBx = document.getElementById("abfahrt-bx");
tableKh = document.getElementById("abfahrt-kh");


dmRequestAction("66001143").then(data => {
    let tbodyBX = document.createElement('tbody');
    let tbodyKH = document.createElement('tbody');

        for(let j = 0; j<data.length; j++){
            let trBX = document.createElement('tr'); //spalten
            let trKH = document.createElement('tr');
            
            let parsedData = parseData(data, j);
            for(let i = 0; i<4;i++){
                let td = document.createElement('td');
                td.innerText = parsedData[i];
                console.log("Richtung: " + parsedData[4]);
                if(parsedData[4] == "H")
                    trKH.appendChild(td);
                else
                    trBX.appendChild(td);
            }
            if(trBX.innerHTML.length !== 0)
                tbodyBX.appendChild(trBX);
            if(trKH.innerHTML.length !== 0)
                tbodyKH.appendChild(trKH);
        }
    tableBx.appendChild(tbodyBX);
    tableKh.appendChild(tbodyKH);
});

function parseData(data, index){
    console.log(data);
    let arr = [];
    arr.push(data[index].number);
    arr.push(data[index].directionName);
    if(data[index].timeMinute.length == 1)
        arr.push(data[index].timeHour + ":" + "0" + data[index].timeMinute);
    else
        arr.push(data[index].timeHour + ":" + data[index].timeMinute);
    if(data[index].realtime == 0)
        arr.push("-")
    else
        arr.push(data[index].realtime + "min");
    arr.push(data[index].direction)
    console.log(arr);
    return arr;

}