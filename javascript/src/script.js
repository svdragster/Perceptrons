var andGate = {
    type: "AND",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1]
    ]
}

var orGate = {
    type: "OR",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ]
}

var xorGate = {
    type: "XOR",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
    ]
}

var nandGate = {
    type: "NAND",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
    ]
}

var norGate = {
    type: "NOR",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 0]
    ]
}

var xnorGate = {
    type: "XNOR",
    titles: ["input1", "input2", "expected output"],
    table: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1]
    ]
}


////////////////

var gatesArray = [andGate, orGate, xorGate, nandGate, norGate, xnorGate];
var currentNetwork = null;
var timer = null;
var showRow = 0;

////////////////


function display(gate) {
    var table = gate.table;
    var tbl = document.getElementById('myTable');

    while (tbl.firstChild) {
        tbl.removeChild(tbl.firstChild);
    }

    document.getElementById("mySelected").innerHTML = "Selected: " + gate.type;

    ////////////
    // HEADER //
    ////////////

    var tr = document.createElement("tr");
    gate.titles.forEach(function(item, index) {
        var th = document.createElement("th");
        var text = document.createTextNode("" + item);
        th.appendChild(text);
        tr.appendChild(th);
    });

    var th = document.createElement("th");
    var text = document.createTextNode("Neural Network");
    th.appendChild(text);
    tr.appendChild(th);

    tbl.appendChild(tr);

    /////////////
    // CONTENT //
    /////////////

    table.forEach(function(item, index) {
        var tr = document.createElement("tr");

        item.forEach(function(item2, index2) {
            var td = document.createElement("td");
            var text = document.createTextNode("" + item2);
            td.appendChild(text);
            tr.appendChild(td);
        })

        var td = document.createElement("td");
        var text = document.createTextNode("?");
        td.id = "neuralOut" + index;
        td.appendChild(text);
        tr.appendChild(td);

        var td2 = document.createElement("td");
        var button = document.createElement("button");
        var text = document.createTextNode("Show");
        button.appendChild(text);
        button.classList.add('btn');
        button.classList.add('btn-info');

        button.addEventListener("click", function() {
            showRow = index;
        });
        td2.appendChild(button);
        tr.appendChild(td2);

        tbl.appendChild(tr);

    });
}

function writeOutput(row) {
    var output = currentNetwork.outputLayer;
    output.forEach(function(neuron, index) {
        var td = document.getElementById("neuralOut" + row);
        var val = "???";
        if (neuron.value == 1) {
            val = "1";
        } else if (neuron.value == -1) {
            val = "0";
        }
        td.innerHTML = "<b>" + val + "</b>";
    });
}

function toBit(n) {
    if (n == 1) {
        return "1";
    } else if (n == -1) {
        return "0";
    }
    return "?";
}

function drawNetwork() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle="#000000";
    ctx.lineWidth = 2;

    var x = 50;
    var y = 140;

    var inputCoords = new Array();
    var hiddenCoords = new Array();
    var outputCoords = new Array();

    currentNetwork.inputLayer.forEach(function(neuron) {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.font = "30px Arial";
        ctx.fillText(toBit(neuron.value), x - 10, y + 10);

        inputCoords.push({
            x1: x,
            y1: y
        });

        y += 120;
    });

    x = 300;
    y = 100;

    currentNetwork.hiddenLayer.forEach(function(neuron) {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.stroke();


        ctx.font = "30px Arial";
        ctx.fillText(toBit(neuron.value), x - 10, y + 10);

        hiddenCoords.push({
            x1: x,
            y1: y,
            weights: neuron.inputs
        });

        y += 100;
    });

    x = 520;
    y = 200;

    currentNetwork.outputLayer.forEach(function(neuron) {
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillText(toBit(neuron.value), x - 10, y + 10);

        outputCoords.push({
            x1: x,
            y1: y,
            weights: neuron.inputs
        });

        y += 70;
    });

    inputCoords.forEach(function(input, index) {
        hiddenCoords.forEach(function(hidden) {
            ctx.beginPath();
            ctx.moveTo(input.x1 + 30, input.y1);
            ctx.lineTo(hidden.x1 - 30, hidden.y1);

            var con = hidden.weights[index];

            if (con.weight < 0) {
                ctx.strokeStyle="#FF0000";
            } else {
                ctx.strokeStyle="#00FF00";
            }
            ctx.lineWidth = Math.abs(con.weight*10) + 2;

            ctx.stroke();
            ctx.closePath();

            var xBetween = (input.x1 + hidden.x1) / 2;
            var yBetween = (input.y1 + hidden.y1) / 2;
            ctx.font = "18px Arial";
            if (hidden.y1 < input.y1) {
                yBetween -= 10;
            } else {
                yBetween += 20;
            }
            ctx.fillText(Math.round(con.weight * 100) / 100, xBetween, yBetween);
        });
    });

    hiddenCoords.forEach(function(hidden, index) {
        outputCoords.forEach(function(output) {
            ctx.beginPath();
            ctx.moveTo(hidden.x1 + 30, hidden.y1);
            ctx.lineTo(output.x1 - 30, output.y1);

            var con = output.weights[index];

            if (con.weight < 0) {
                ctx.strokeStyle="#FF0000";
            } else {
                ctx.strokeStyle="#00FF00";
            }
            ctx.lineWidth = Math.abs(con.weight*10) + 2;

            ctx.stroke();
            ctx.closePath();

            var xBetween = (hidden.x1 + output.x1) / 2;
            var yBetween = (hidden.y1 + output.y1) / 2;
            ctx.font = "18px Arial";
            if (output.y1 < hidden.y1) {
                yBetween -= 10;
            } else {
                yBetween += 20;
            }
            ctx.fillText(Math.round(con.weight * 100) / 100, xBetween, yBetween);
        });
    });

}

function createButtons() {
    var div = document.getElementById("buttons");
    gatesArray.forEach(function(gate, index) {
        var button = document.createElement("button");
        var text = document.createTextNode(gate.type + " Gate");
        button.appendChild(text);
        button.classList.add('btn');
        button.classList.add('btn-primary');

        button.addEventListener("click", function() {
            display(gate);
            if (currentNetwork == null) {
                currentNetwork = new Network(gate);
            }
            if (timer != null) {
                clearTimeout(timer);
            }
            timer = setInterval(function() {
                console.log("#############");
                var finished = true;
                for (var row=0; row<gate.table.length; row++) {
                    var inputs = [];
                    var i = 0;
                    for (i=i; i<gate.table[row].length-1; i++) {
                        var input = gate.table[row][i];
                        if (input == 0) input = -1;
                        inputs.push(input);
                    }
                    var correctOutput = gate.table[row][i];
                    if (correctOutput == 0) correctOutput = -1;

                    if (!currentNetwork.calculate(inputs, correctOutput)) {
                        finished = false;
                    }

                    writeOutput(row);

                    if (row == showRow) {
                        drawNetwork();
                    }
                }


                if (finished) {
                    clearTimeout(timer);
                    console.log("FINISHED");
                    timer = null;
                }

            }, 400);
        });

        div.appendChild(button);
    });
}

window.onload = function() {
    display(andGate);
    createButtons();
};
